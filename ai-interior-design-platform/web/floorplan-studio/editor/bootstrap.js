import { adaptJindiDesign } from "./jindi-adapter.js";
import { coffeeTableFootprint } from "./cream-coffee-table.js";
import { createPlatformDesign, mergePlatformScene } from "./platform-scene.js";
import { loadLayoutScene } from "../../layout-review/scene.js?v=studio-version-save";

const status = document.querySelector("#editorLoadStatus");
const parameters = new URLSearchParams(location.search);
const embedded = parameters.get("embedded") === "1";
const post = (type, details = {}) => window.parent.postMessage({ type: `floorplan-studio:${type}`, ...details }, location.origin);

function loadClassicEditor() {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = new URL("./editor-2d.js?v=studio-version-save", import.meta.url);
    script.onload = resolve;
    script.onerror = reject;
    document.body.append(script);
  });
}

async function startEditor(design, { view, room }) {
  window.floorplanStudioDesign = { ...design, coffeeTableFootprint };
  document.body.classList.toggle("editor-embedded", Boolean(design.embedded));
  document.body.classList.toggle("editor-readonly", Boolean(design.readOnly));
  await loadClassicEditor();
  if (!window.floorplanEditorReady) throw new Error("户型编辑器初始化失败。");
  document.body.classList.add("editor-ready");
  status.hidden = true;
  try {
    await import("./editor-3d.js?v=studio-version-save");
    const openingIn3D = ["3d", "walk"].includes(view);
    if (openingIn3D) await window.setView("3d");
    if (openingIn3D && !document.body.classList.contains("m3d")) throw new Error("当前浏览器无法打开 3D。");
    if (room && design.rooms.some(({ id }) => id === room)) {
      window.select({ kind: "room", id: room });
      if (openingIn3D && view !== "walk") window.View3D.flyToRoom(room);
    }
    if (view === "walk") window.View3D.walk(room);
  } catch (error) {
    document.querySelector('[data-view="3d"]').disabled = true;
    if (design.embedded) throw error;
  }
}

function initializationError(error) {
  const message = error instanceof Error ? error.message : "无法载入户型编辑器。";
  status.textContent = message;
  status.hidden = false;
  if (embedded && window.parent !== window) post("error", { message });
}

function connectToPlatform() {
  if (window.parent === window) throw new Error("请从方案工作台打开此编辑器。");
  let connected = false;
  let saveInProgress = null;
  let base = null;
  let latest = null;
  let design;
  let scene;
  let dirty = false;
  let canSave = false;
  const saveButton = document.querySelector("#platformSave");
  const saveStatus = document.querySelector("#platformSaveStatus");
  const editor = document.querySelector(".app");
  const lockRegions = editor.querySelectorAll(":scope > main, :scope > aside, :scope > header > :not(#platformSaveStatus)");
  const signatureOf = (layout) => JSON.stringify(loadLayoutScene(layout));

  function setSaveLock(locked) {
    window.floorplanEditorSaving = locked;
    editor.setAttribute("aria-busy", String(locked));
    for (const region of lockRegions) region.inert = locked;
  }

  function canonicalState() {
    return mergePlatformScene(scene, design, window.getFloorplanEditorState());
  }

  function sendChanges() {
    try {
      const updated = canonicalState();
      const signature = signatureOf(updated);
      if (signature !== latest) {
        const persist = window.frameElement?.persistFloorplanStudioDraft;
        if (typeof persist === "function") persist(updated);
        else post("change", { scene: updated });
      }
      latest = signature;
      const hasChanges = signature !== base;
      if (dirty !== hasChanges) post("dirty", { dirty: hasChanges });
      dirty = hasChanges;
      saveStatus.textContent = "";
      return updated;
    } catch (error) {
      saveStatus.textContent = error.message;
      return null;
    } finally {
      saveButton.disabled = !canSave || !dirty || Boolean(saveInProgress);
    }
  }

  function flushDraft() {
    if (!design || design.readOnly || saveInProgress || !window.floorplanEditorReady) return;
    document.activeElement?.blur();
    sendChanges();
  }

  window.flushFloorplanStudioDraft = flushDraft;
  window.addEventListener("pagehide", flushDraft);

  function save() {
    if (!canSave || saveInProgress || !window.floorplanEditorReady) return;
    document.activeElement?.blur();
    const updated = sendChanges();
    if (!updated || !dirty) return;
    saveInProgress = latest;
    saveButton.disabled = true;
    saveStatus.textContent = "正在保存…";
    setSaveLock(true);
    post("save", { scene: updated });
  }

  saveButton.addEventListener("click", save);
  window.addEventListener("message", async (event) => {
    if (event.source !== window.parent || event.origin !== location.origin || !event.data) return;
    const message = event.data;
    if (message.type === "floorplan-studio:init" && !connected) {
      connected = true;
      try {
        scene = message.scene;
        design = createPlatformDesign(scene, { readOnly: message.readOnly !== false, styleId: message.styleId ?? "cream" });
        base = signatureOf(message.baseScene ?? scene);
        latest = signatureOf(scene);
        canSave = !design.readOnly && message.canSave !== false;
        design.onChange = () => {
          if (!saveInProgress) sendChanges();
        };
        design.onSelection = (selection) => post("selection", {
          itemId: selection?.kind === "furn" ? selection.id : null,
          roomId: selection?.kind === "room" ? selection.id : null,
        });
        await startEditor(design, { view: message.initialMode, room: message.initialRoomId });
        saveButton.hidden = !canSave;
        if (!design.readOnly) sendChanges();
        post("loaded", { styleProfile: design.styleId === "cream" ? "cream" : "neutral" });
      } catch (error) {
        initializationError(error);
      }
    } else if (message.type === "floorplan-studio:request-save") {
      save();
    } else if (message.type === "floorplan-studio:save-result" && saveInProgress) {
      if (message.ok) base = saveInProgress;
      saveInProgress = null;
      setSaveLock(false);
      sendChanges();
      saveStatus.textContent = message.cancelled ? "" : message.message || (message.ok ? "版本已保存。" : "保存失败，请重试。");
      if (!message.ok && !saveButton.disabled) saveButton.focus();
    }
  });
  post("ready");
}

try {
  if (embedded) {
    connectToPlatform();
  } else {
    const response = await fetch(new URL("../jindi-cream.json", import.meta.url));
    if (!response.ok) throw new Error("无法读取户型数据。");
    await startEditor({ ...adaptJindiDesign(await response.json()), styleId: "cream" }, {
      view: parameters.get("view"),
      room: parameters.get("room"),
    });
  }
} catch (error) {
  initializationError(error);
}
