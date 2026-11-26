import { APP_CONFIG } from "./config.js";
import { mountFloorplanStudio } from "./floorplan-studio/bridge.js?v=studio-save-feedback";
import { loadLayoutScene } from "./layout-review/scene.js?v=studio-version-save";
import { makeRealtimeShareUrl, makeRealtimeStudioUrl, realtimeMusic, REALTIME_SESSION_KEY, requestRealtime } from "./realtime-projects.js?v=studio-version-save";

const stage = document.querySelector("[data-studio-stage]");
const title = document.querySelector("[data-studio-title]");
const versionLabel = document.querySelector("[data-studio-version]");
const feedback = document.querySelector("[data-studio-status]");
const returnLink = document.querySelector("[data-studio-back]");
const saveDialog = document.querySelector("[data-studio-save-dialog]");
const saveForm = saveDialog.querySelector("form");
const saveChoices = saveForm.querySelector(".studio-save-choices");
const overwriteButton = document.querySelector("[data-studio-save-overwrite]");
const appendButton = document.querySelector("[data-studio-save-append]");
const cancelButton = document.querySelector("[data-studio-save-cancel]");
const overwriteLabel = document.querySelector("[data-studio-save-overwrite-label]");
const saveNote = document.querySelector("[data-studio-save-note]");
const saveProgress = document.querySelector("[data-studio-save-progress]");
const query = new URLSearchParams(location.search);
const projectId = query.get("project");
const requestedVersion = query.get("version");
const apiBase = (APP_CONFIG.api?.realtimeBaseUrl || APP_CONFIG.api?.baseUrl || "").replace(/\/$/, "");
const projectPath = `/realtime-projects/${projectId}`;
const appUrl = new URL("./", import.meta.url);
let mounted;
let mountSequence = 0;
let saving = false;

function setStatus(message = "", state) {
  feedback.textContent = message;
  if (state) feedback.dataset.state = state;
  else delete feedback.dataset.state;
}

function returnUrl(versionId = requestedVersion, edit = false) {
  const url = new URL(appUrl);
  url.searchParams.set("project", projectId);
  if (versionId) url.searchParams.set("version", versionId);
  if (edit) url.searchParams.set("view", "editor");
  return url.href;
}

function setSaving(value) {
  saving = value;
  if (value) returnLink.setAttribute("aria-disabled", "true");
  else returnLink.removeAttribute("aria-disabled");
}

returnLink.addEventListener("click", (event) => {
  if (saving) event.preventDefault();
  else mounted?.flushDraft?.();
});

function openLogin(versionId) {
  sessionStorage.removeItem(REALTIME_SESSION_KEY);
  window.location.replace(returnUrl(versionId, true));
}

function confirmSave(version, draftRevision, submit) {
  const supportsOverwrite = Number.isInteger(version.revision);
  const staleDraft = supportsOverwrite && draftRevision !== version.revision;
  const canOverwrite = supportsOverwrite && !staleDraft;
  overwriteLabel.textContent = `覆盖 V${version.number}`;
  overwriteButton.disabled = !canOverwrite;
  saveNote.hidden = canOverwrite;
  saveNote.textContent = staleDraft ? `V${version.number} 已更新，草稿可以保存为新版本。`
    : "当前服务只支持新建版本。";
  saveProgress.textContent = "";
  delete saveProgress.dataset.state;

  return new Promise((resolve) => {
    const events = new AbortController();
    const { signal } = events;
    let pending = false;
    let result = null;
    const setPending = (value) => {
      pending = value;
      overwriteButton.disabled = value || !canOverwrite;
      appendButton.disabled = value;
      cancelButton.disabled = value;
      saveChoices.setAttribute("aria-busy", String(value));
    };

    saveForm.addEventListener("submit", async (event) => {
      const mode = event.submitter?.value;
      if (!pending && mode === "cancel") return;
      event.preventDefault();
      const validChoice = mode === "append" || (mode === "overwrite" && canOverwrite);
      if (pending || !validChoice) return;

      setPending(true);
      saveProgress.dataset.state = "pending";
      saveProgress.textContent = mode === "overwrite" ? `正在保存 V${version.number}…` : "正在保存为新版本…";
      try {
        result = { mode, response: await submit(mode) };
        saveDialog.close();
      } catch (error) {
        saveProgress.dataset.state = "error";
        saveProgress.textContent = `保存失败。${error?.message || "请重试。"}`;
      } finally {
        setPending(false);
        if (saveDialog.open) event.submitter.focus();
      }
    }, { signal });
    saveDialog.addEventListener("cancel", (event) => {
      if (pending) event.preventDefault();
    }, { signal });
    saveDialog.addEventListener("close", () => {
      events.abort();
      resolve(result);
    }, { signal });
    saveDialog.showModal();
  });
}

function openVersion({ project, version }) {
  const baseScene = loadLayoutScene(version.layout);
  title.textContent = project.title;
  versionLabel.textContent = `V${version.number} · 3D 编辑`;
  document.title = `${project.title} · V${version.number} · 3D 设计工作台`;
  returnLink.href = returnUrl(version.id);
  history.replaceState(null, "", makeRealtimeStudioUrl(project.id, version.id));

  const draftKey = `xspace:studio-draft:${project.id}:${version.id}`;
  const baseSignature = JSON.stringify(baseScene);
  const music = realtimeMusic(version.musicId, project.id, version.id);
  let draft = null;
  let draftRevision = version.revision;
  try {
    const stored = sessionStorage.getItem(draftKey);
    if (stored) {
      const record = JSON.parse(stored);
      draft = loadLayoutScene(record.layout ?? record);
      draftRevision = record.revision ?? 1;
    }
  } catch { /* A corrupt browser draft does not block the saved version. */ }

  function setDraft(scene) {
    const serialized = JSON.stringify(scene);
    draft = serialized === baseSignature ? null : scene;
    if (!draft) draftRevision = version.revision;
    if (draft && feedback.dataset.state === "success") setStatus();
    try {
      if (draft) sessionStorage.setItem(draftKey, JSON.stringify({ revision: draftRevision, layout: draft }));
      else sessionStorage.removeItem(draftKey);
    } catch { /* The current workbench can still save its in-memory draft. */ }
  }

  async function save(scene) {
    setDraft(scene);
    const saved = await confirmSave(version, draftRevision, (mode) => requestRealtime(apiBase, `${projectPath}/versions`, {
      method: "POST",
      body: {
        mode, baseVersionId: version.id, expectedVersionRevision: version.revision, layout: scene,
        ...(mode === "append" ? { expectedActiveVersionId: project.activeVersionId } : {}),
      },
    }).catch((error) => {
      if (error.status === 401) openLogin(version.id);
      throw error;
    }));
    if (!saved) return null;
    const { mode, response } = saved;
    setDraft(baseScene);
    openVersion(response);
    const message = mode === "overwrite" ? `V${response.version.number} 已保存。` : `已保存为 V${response.version.number}。`;
    setStatus(message, "success");
    return message;
  }

  async function share() {
    const { token } = await requestRealtime(apiBase, `${projectPath}/versions/${version.id}/shares`, { method: "POST" });
    const link = makeRealtimeShareUrl(token, appUrl.pathname);
    try {
      await navigator.clipboard.writeText(link);
      return "版本分享链接已复制。";
    } catch {
      const field = document.createElement("input");
      field.className = "studio-share-link";
      field.type = "url";
      field.readOnly = true;
      field.setAttribute("aria-label", "当前版本的分享链接");
      field.value = link;
      document.querySelector(".studio-share-link")?.remove();
      feedback.after(field);
      field.focus();
      field.select();
      return "版本分享链接已生成。";
    }
  }

  function openStudio() {
    const attempt = ++mountSequence;
    mounted?.dispose();
    document.querySelector(".studio-share-link")?.remove();
    setStatus();
    mounted = mountFloorplanStudio(stage, {
      source: draft || baseScene, baseScene, styleId: version.styleId, readOnly: false, music,
      onChange: setDraft, onSave: save, onShare: share, onSavingChange: setSaving,
      onReview: () => openReview(),
      onError: (error) => { if (attempt === mountSequence) openReview(error); },
    });
  }

  async function openReview(editorError) {
    const attempt = ++mountSequence;
    mounted?.dispose();
    mounted = null;
    setStatus(editorError ? "当前户型改用空间检查器查看。" : "正在打开空间检查…");
    try {
      const { createLayoutWorkspace } = await import("./layout-review/workspace.js?v=studio-save-feedback");
      if (attempt !== mountSequence) return;
      const holder = document.createElement("div");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "layout-action studio-review-back";
      button.textContent = "返回 3D 编辑";
      button.addEventListener("click", openStudio);
      button.hidden = Boolean(editorError);
      stage.replaceChildren(button, holder);
      const workspace = createLayoutWorkspace(holder, {
        source: baseScene, draft: draft || baseScene, allowLocalDraft: false, styleId: version.styleId, music, initialMode: "3d",
        onSceneChange: setDraft, onShareVersion: share, saveVersionLabel: "保存",
        async onSaveVersion(scene) {
          setSaving(true);
          button.disabled = true;
          holder.inert = true;
          try { return await save(scene); }
          finally { setSaving(false); button.disabled = false; holder.inert = false; }
        },
      });
      mounted = { dispose() { workspace.dispose(); stage.replaceChildren(); } };
      if (!editorError) setStatus();
    } catch (error) {
      if (attempt === mountSequence) setStatus(error.message || "空间检查暂时无法打开。", "error");
    }
  }

  openStudio();
}

async function start() {
  if (!/^rt-[a-f0-9]{32}$/.test(projectId || "") || (requestedVersion && !/^rv-[a-f0-9]{32}$/.test(requestedVersion))) {
    setStatus("找不到要编辑的方案或版本。", "error");
    return;
  }
  returnLink.href = returnUrl();
  if (!sessionStorage.getItem(REALTIME_SESSION_KEY)) return openLogin();
  try {
    const record = await requestRealtime(apiBase, projectPath);
    if (requestedVersion && requestedVersion !== record.version.id) {
      record.version = (await requestRealtime(apiBase, `${projectPath}/versions/${requestedVersion}`)).version;
    }
    openVersion(record);
  } catch (error) {
    if (error.status === 401) openLogin();
    else setStatus(error.message || "3D 工作台暂时无法打开。", "error");
  }
}

start();
