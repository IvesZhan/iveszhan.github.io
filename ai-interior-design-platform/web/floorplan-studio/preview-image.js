import { getLayoutBounds, loadLayoutScene } from "../layout-review/scene.js?v=studio-version-save";

const width = 1280;
const height = 960;
const background = "#f3f0e8";
const byVersion = new Map();
const byScene = new WeakMap();
const floorColors = {
  wood: "#dec9ad", walnut: "#bda184", tile800: "#e9e3d7", tile600: "#e4dfd7",
  marble: "#eee8dd", antislip: "#d9d3c7", terrazzo: "#ded8ca", carpet: "#dacfc2",
};

function previewCache(scene, styleId, cacheKey) {
  if (cacheKey != null) return { entries: byVersion, key: JSON.stringify([cacheKey, styleId]), limit: 6 };
  if (!byScene.has(scene)) byScene.set(scene, new Map());
  return { entries: byScene.get(scene), key: styleId, limit: 2 };
}

function planPreview(layout) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("平面预览暂不可用。");
  const { minX, maxX, minZ, maxZ } = getLayoutBounds(layout);
  const scale = Math.min((width - 160) / Math.max(maxX - minX, 0.1), (height - 160) / Math.max(maxZ - minZ, 0.1));
  const project = ([x, z]) => [
    width / 2 + (x - (minX + maxX) / 2) * scale,
    height / 2 + (z - (minZ + maxZ) / 2) * scale,
  ];

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);
  function trace(points) {
    ctx.beginPath();
    ctx.moveTo(...project(points[0]));
    for (const point of points.slice(1)) ctx.lineTo(...project(point));
  }

  for (const room of layout.rooms) {
    trace(room.polygon);
    ctx.closePath();
    ctx.fillStyle = Object.hasOwn(floorColors, room.editorMaterial) ? floorColors[room.editorMaterial] : "#e9e2d4";
    ctx.fill();
  }

  for (const item of layout.items) {
    const itemWidth = item.widthM * scale;
    const itemDepth = item.depthM * scale;
    ctx.save();
    ctx.translate(...project(item.center));
    ctx.rotate(item.rotationRad);
    ctx.beginPath();
    if (item.shape === "round") ctx.ellipse(0, 0, itemWidth / 2, itemDepth / 2, 0, 0, Math.PI * 2);
    else ctx.rect(-itemWidth / 2, -itemDepth / 2, itemWidth, itemDepth);
    ctx.fillStyle = item.editorColor || "#c8b59c";
    ctx.strokeStyle = "#93836c";
    ctx.lineWidth = 1;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  const walls = new Map(layout.walls.map((wall) => [wall.id, wall]));
  for (const wall of layout.walls) {
    trace([wall.start, wall.end]);
    ctx.strokeStyle = "#867c6d";
    ctx.lineWidth = Math.max(2, wall.thicknessM * scale);
    ctx.stroke();
  }
  for (const opening of layout.openings) {
    if (opening.excludedReason || !walls.has(opening.wallId)) continue;
    trace(opening.segment);
    ctx.strokeStyle = opening.kind === "window" ? "#aebeb7" : "#e9e2d4";
    ctx.lineWidth = Math.max(2, walls.get(opening.wallId).thicknessM * scale + 1);
    ctx.stroke();
  }

  return new Promise((resolve, reject) => canvas.toBlob((blob) => {
    if (blob) resolve(blob);
    else reject(new Error("平面预览暂不可用。"));
  }, "image/png"));
}

async function overviewPreview(layout, styleId, signal) {
  const { createLayoutViewer } = await import("../layout-review/viewer.js?v=overview-preview");
  if (signal.aborted) return null;
  const viewer = createLayoutViewer(document.createElement("div"), { styleId, overviewPreview: true });
  let released = false;
  const release = () => {
    if (released) return;
    released = true;
    viewer.dispose();
  };
  signal.addEventListener("abort", release, { once: true });
  try {
    viewer.update(layout, { reset: true });
    return await viewer.captureOverview({ width, height });
  } finally {
    signal.removeEventListener("abort", release);
    release();
  }
}

export function mountFloorplanPreview(holder, { scene, styleId, cacheKey } = {}) {
  const controller = new AbortController();
  const { signal } = controller;
  const figure = document.createElement("figure");
  figure.className = "floorplan-preview";
  const status = document.createElement("p");
  status.className = "floorplan-preview-status";
  status.setAttribute("role", "status");
  let url;

  function showStatus(state, message) {
    figure.dataset.state = state;
    status.textContent = message;
    figure.replaceChildren(status);
  }

  function showImage(blob, fallback = false) {
    if (signal.aborted || !blob) return;
    url = URL.createObjectURL(blob);
    const image = document.createElement("img");
    image.className = "floorplan-preview-image";
    image.width = width;
    image.height = height;
    image.alt = fallback ? "当前方案的户型平面图" : "当前方案的整屋 3D 鸟瞰图";
    image.src = url;
    figure.dataset.state = fallback ? "fallback" : "ready";
    figure.replaceChildren(image);
  }

  showStatus("loading", "正在生成户型预览…");
  holder.replaceChildren(figure);
  (async () => {
    try {
      const layout = loadLayoutScene(scene);
      const { entries, key, limit } = previewCache(scene, styleId, cacheKey);
      if (entries.has(key)) {
        const blob = entries.get(key);
        entries.delete(key);
        entries.set(key, blob);
        showImage(blob);
        return;
      }
      try {
        const blob = await overviewPreview(layout, styleId, signal);
        if (signal.aborted || !blob) return;
        entries.set(key, blob);
        if (entries.size > limit) entries.delete(entries.keys().next().value);
        showImage(blob);
      } catch {
        if (!signal.aborted) showImage(await planPreview(layout), true);
      }
    } catch {
      if (!signal.aborted) showStatus("empty", "暂无户型预览");
    }
  })();

  return {
    dispose() {
      controller.abort();
      if (url) URL.revokeObjectURL(url);
      figure.remove();
    },
  };
}
