import { loadLayoutScene } from "../layout-review/scene.js?v=studio-version-save";
import { createVrBackgroundMusic } from "../vr-background-music.js";

export function mountFloorplanStudio(holder, {
  source, baseScene = source, styleId, readOnly, initialMode = "3d", initialRoomId, music, onChange, onSave, onShare, onReview,
  onSelection, onSavingChange, onError,
}) {
  const container = document.createElement("section");
  container.className = "floorplan-studio";
  const frame = document.createElement("iframe");
  frame.className = "floorplan-studio-frame";
  frame.title = readOnly ? "整屋 3D 查看" : "户型 2D / 3D 设计工作台";
  frame.allow = "fullscreen";
  frame.src = new URL("./editor/?embedded=1&v=studio-version-save", import.meta.url).href;
  const actions = document.createElement("div");
  actions.className = "floorplan-studio-actions";
  const status = document.createElement("p");
  status.setAttribute("role", "status");
  const profile = document.createElement("p");
  profile.className = "floorplan-studio-profile";
  let shareButton;
  let reviewButton;
  let sharing = false;
  let soundtrack;
  if (music?.url) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "layout-action";
    soundtrack = createVrBackgroundMusic();
    soundtrack.attach(button);
    soundtrack.setPackage({ projectId: music.projectId, versionId: music.versionId, shareMeta: { backgroundMusic: music } });
    actions.append(button);
  }
  if (onShare) {
    shareButton = document.createElement("button");
    shareButton.type = "button";
    shareButton.className = "layout-action";
    shareButton.textContent = "分享当前版本";
    shareButton.addEventListener("click", async () => {
      sharing = true;
      syncActionButtons();
      status.textContent = "正在创建分享链接…";
      try { status.textContent = (await onShare()) || "分享链接已生成。"; }
      catch (error) { status.textContent = error.message || "暂时无法创建分享链接。"; }
      finally { sharing = false; syncActionButtons(); }
    });
    actions.append(shareButton);
  }
  if (onReview) {
    reviewButton = document.createElement("button");
    reviewButton.type = "button";
    reviewButton.className = "layout-action";
    reviewButton.textContent = "空间检查";
    reviewButton.addEventListener("click", onReview);
    actions.append(reviewButton);
  }
  actions.append(profile, status);
  container.append(actions);
  container.append(frame);

  const events = new AbortController();
  let scene = source;
  let saving = false;

  function syncActionButtons() {
    if (shareButton) shareButton.disabled = sharing || saving;
    if (reviewButton) reviewButton.disabled = saving;
  }

  function setSaving(value) {
    if (saving === value) return;
    saving = value;
    syncActionButtons();
    onSavingChange?.(saving);
  }

  const send = (message) => frame.contentWindow?.postMessage(message, window.location.origin);
  const timeout = setTimeout(() => fail("3D 工作台加载超时。"), 20_000);

  function persistDraft(draft) {
    if (readOnly || saving || events.signal.aborted) return;
    try {
      scene = loadLayoutScene(draft);
      onChange?.(scene);
    } catch { /* Incomplete edits never replace the last usable draft. */ }
  }

  frame.persistFloorplanStudioDraft = persistDraft;

  function flushDraft() {
    if (readOnly || saving || events.signal.aborted) return;
    try { frame.contentWindow?.flushFloorplanStudioDraft?.(); }
    catch { /* The frame may already be navigating. */ }
  }

  function dispose() {
    if (events.signal.aborted) return;
    flushDraft();
    clearTimeout(timeout);
    events.abort();
    delete frame.persistFloorplanStudioDraft;
    setSaving(false);
    soundtrack?.pause();
    container.remove();
  }
  function fail(message) {
    if (events.signal.aborted) return;
    dispose();
    if (onError) onError(new Error(message));
    else holder.textContent = message;
  }

  async function receive(event) {
    if (event.origin !== window.location.origin || event.source !== frame.contentWindow) return;
    const message = event.data;
    if (message?.type === "floorplan-studio:ready") {
      send({ type: "floorplan-studio:init", scene, baseScene, readOnly, canSave: Boolean(onSave), styleId, initialMode, initialRoomId });
    } else if (message?.type === "floorplan-studio:loaded") {
      clearTimeout(timeout);
      if (!readOnly && message.styleProfile === "neutral") profile.textContent = "当前使用基础材质预览，风格已记录在此版本。";
    } else if (message?.type === "floorplan-studio:error") {
      fail(message.message || "当前户型无法加载 3D 工作台。");
    } else if (message?.type === "floorplan-studio:selection") {
      onSelection?.(message);
    } else if (message?.type === "floorplan-studio:change") {
      persistDraft(message.scene);
    } else if (!readOnly && onSave && !saving && message?.type === "floorplan-studio:save") {
      try {
        const snapshot = loadLayoutScene(message.scene);
        setSaving(true);
        const result = await onSave(snapshot);
        if (!events.signal.aborted) {
          send(result === null
            ? { type: "floorplan-studio:save-result", cancelled: true }
            : { type: "floorplan-studio:save-result", ok: true, message: result });
        }
      } catch (error) {
        if (!events.signal.aborted) send({ type: "floorplan-studio:save-result", ok: false, message: error.message || "保存失败，请重试。" });
      } finally {
        setSaving(false);
      }
    }
  }

  window.addEventListener("message", receive, { signal: events.signal });
  window.addEventListener("pagehide", () => {
    flushDraft();
    soundtrack?.pause();
  }, { signal: events.signal });
  holder.replaceChildren(container);
  return { dispose, flushDraft };
}
