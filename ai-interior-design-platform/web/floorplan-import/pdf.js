import { getDocument, GlobalWorkerOptions } from "./vendor/pdfjs-6.5.438/pdf.min.mjs";

const resourceUrl = (path) => new URL(path, import.meta.url).href;
const vendorPath = "./vendor/pdfjs-6.5.438/";
const longEdge = 2048;
const imageType = "image/jpeg";

GlobalWorkerOptions.workerSrc = resourceUrl(`${vendorPath}pdf.worker.min.mjs`);

function cancelled() {
  return new DOMException("已取消 PDF 页面读取。", "AbortError");
}

async function waitFor(promise, signal) {
  if (!signal) return promise;
  let onAbort;
  const interruption = new Promise((_, reject) => {
    onAbort = () => reject(cancelled());
    if (signal.aborted) onAbort();
    else signal.addEventListener("abort", onAbort, { once: true });
  });
  try {
    return await Promise.race([promise, interruption]);
  } finally {
    signal.removeEventListener("abort", onAbort);
  }
}

function encodePage(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob?.type === imageType) resolve(blob);
      else reject(new Error("无法将该 PDF 页面生成图片。"));
    }, imageType, 0.95);
  });
}

export async function openFloorplanPdf(file, { signal } = {}) {
  if (signal?.aborted) throw cancelled();
  const data = new Uint8Array(await waitFor(file.arrayBuffer(), signal));
  if (signal?.aborted) throw cancelled();

  const loadingTask = getDocument({
    data,
    cMapUrl: resourceUrl(`${vendorPath}cmaps/`),
    standardFontDataUrl: resourceUrl(`${vendorPath}standard_fonts/`),
    iccUrl: resourceUrl(`${vendorPath}iccs/`),
    wasmUrl: resourceUrl(`${vendorPath}wasm/`),
    disableWorkerRendering: true,
  });
  let destroyPromise;
  function destroy() {
    return destroyPromise ??= loadingTask.destroy();
  }

  let pdf;
  try {
    pdf = await waitFor(loadingTask.promise, signal);
    if (signal?.aborted) throw cancelled();
  } catch (error) {
    await destroy().catch(() => {});
    if (signal?.aborted) throw cancelled();
    if (error?.name === "PasswordException") throw new Error("此 PDF 需要密码，请先解除保护后再导入。");
    throw new Error("无法打开该 PDF，请检查文件或重新导出。", { cause: error });
  }

  const name = file.name?.replace(/\.pdf$/i, "") || "户型图";
  let currentRender = null;
  let closed = false;

  function cancelRender(render) {
    render?.controller.abort();
    render?.task?.cancel();
  }

  async function renderPage(pageNumber) {
    if (closed) throw cancelled();
    if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > pdf.numPages) {
      throw new RangeError("PDF 页码超出范围。");
    }

    const previousRender = currentRender;
    const rendering = { controller: new AbortController(), task: null };
    currentRender = rendering;
    cancelRender(previousRender);

    let page;
    let canvas;
    try {
      page = await waitFor(pdf.getPage(pageNumber), rendering.controller.signal);
      if (currentRender !== rendering) throw cancelled();
      const original = page.getViewport({ scale: 1 });
      const dimension = Math.max(original.width, original.height);
      if (!Number.isFinite(dimension) || dimension <= 0) throw new Error("该 PDF 页面尺寸无效。");
      const viewport = page.getViewport({ scale: longEdge / dimension });
      canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.ceil(viewport.width));
      canvas.height = Math.max(1, Math.ceil(viewport.height));
      const canvasContext = canvas.getContext("2d");
      if (!canvasContext) throw new Error("当前浏览器无法栅格化 PDF 页面。");
      rendering.task = page.render({ canvas, canvasContext, viewport, background: "#ffffff" });
      await rendering.task.promise;
      rendering.task = null;
      if (currentRender !== rendering) throw cancelled();
      const image = await encodePage(canvas);
      if (currentRender !== rendering) throw cancelled();
      return new File([image], `${name}-第${pageNumber}页.jpg`, { type: imageType });
    } catch (error) {
      if (currentRender !== rendering || error?.name === "RenderingCancelledException") throw cancelled();
      throw error;
    } finally {
      page?.cleanup();
      if (canvas) canvas.width = canvas.height = 0;
      if (currentRender === rendering) currentRender = null;
    }
  }

  function close() {
    if (!closed) {
      closed = true;
      const activeRender = currentRender;
      currentRender = null;
      cancelRender(activeRender);
    }
    return destroy();
  }

  return { pageCount: pdf.numPages, renderPage, close };
}
