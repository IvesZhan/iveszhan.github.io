import { containsPoint, loadLayoutScene } from "./scene.js?v=studio-version-save";
import { createVrBackgroundMusic } from "../vr-background-music.js";

const presets = {
  sofa: { name: "沙发", widthM: 2.2, depthM: 0.9, heightM: 0.85 },
  cabinet: { name: "柜子", widthM: 1.2, depthM: 0.45, heightM: 0.9 },
  table: { name: "餐桌", widthM: 1.4, depthM: 0.8, heightM: 0.75 },
  fridge: { name: "冰箱", widthM: 0.75, depthM: 0.7, heightM: 1.84 },
};

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function clickButton(label, callback, className = "layout-action") {
  const button = el("button", className, label);
  button.type = "button";
  button.addEventListener("click", callback);
  return button;
}

function filenamePart(value) {
  const name = String(value ?? "").normalize("NFKC").trim()
    .replace(/[<>:"/\\|?*\u0000-\u001f\u007f]+/g, "-")
    .replace(/\s+/g, "-").replace(/^[-.]+|[-.]+$/g, "");
  return Array.from(name).slice(0, 28).join("");
}

const millimeters = (number) => `${Math.round(number * 1000).toLocaleString("zh-CN")} 毫米`;
const byOpening = new Map([ ["door", "门"], ["passage", "通道"], ["window", "窗"] ]);
const isInteriorView = (mode) => mode === "walk" || mode === "panorama";
const walkDirections = [
  ["forward", "↑", "前进"], ["left", "←", "向左移动"],
  ["backward", "↓", "后退"], ["right", "→", "向右移动"],
];

export function readLayoutDraft(key) {
  try {
    const saved = localStorage.getItem(`xspace:layout:${key}`);
    return saved ? loadLayoutScene(JSON.parse(saved)) : null;
  } catch {
    return null;
  }
}

export function createLayoutWorkspace(holder, {
  source, key, draft, onSceneChange, readOnly = false, initialMode = "3d", initialRoomId = "", music, panoramaCaptureLabel = null,
  onSaveVersion, saveVersionLabel = "保存新版本", allowSaveUnchanged = false, allowLocalDraft = true,
  onShareVersion, shareVersionLabel = "分享漫游", onSelectItem, onWalkRoom, onViewModeChange, styleId, visualProfile,
} = {}) {
  const root = el("section", readOnly ? "layout-workbench layout-workbench--read-only" : "layout-workbench");
  const left = el("section", "layout-drawing");
  const toolbar = el("div", "layout-tools");
  const stage = el("div", "layout-canvas");
  const viewport = el("div", "layout-viewport");
  const shareSurface = readOnly ? holder.closest(".realtime-share") : null;
  const fullscreenSurface = shareSurface || viewport;
  if (readOnly && !shareSurface) root.classList.add("layout-workbench--embedded");
  const modeTools = el("div", "layout-view-toggle");
  const secondaryTools = el("div", "layout-tool-secondary");
  const roomMenu = readOnly ? el("details", "layout-room-menu") : null;
  const roomTrigger = readOnly ? el("summary", "layout-room-trigger") : null;
  const activeRoomName = readOnly ? el("span", null, "房间") : null;
  const tourRooms = readOnly ? el("nav", "layout-tour-rooms") : null;
  tourRooms?.setAttribute("aria-label", "切换房间");
  const tourRoomButtons = new Map();
  const hint = el("p", "layout-hint");
  const walkHint = el("p", "layout-hint layout-walk-hint");
  walkHint.append(el("span", "layout-walk-desktop-hint", "WASD 或方向键移动 · 拖动转向 · 点击门扇开关"),
    el("span", "layout-walk-touch-hint", "按住方向键移动 · 拖动转向 · 点按门扇开关"));
  walkHint.hidden = true;
  const walkControls = el("div", "layout-walk-controls");
  walkControls.setAttribute("role", "group");
  walkControls.setAttribute("aria-label", "漫游移动");
  walkControls.hidden = true;
  const stageStatus = el("p", "layout-stage-status", "正在读取户型…");
  stageStatus.setAttribute("role", "status");
  const walkNotice = el("p", "layout-walk-notice");
  walkNotice.setAttribute("role", "status");
  const right = el("aside", "layout-controls");
  const heading = el("h2", null, "空间检查");
  const status = el("p", "layout-status", "正在读取户型…");
  status.setAttribute("role", "status");
  const report = el("div", "layout-findings");
  const inspector = el("div", "layout-inspector");
  const warnings = el("details", "layout-warnings");
  const roomPicker = el("select", "layout-picker");
  roomPicker.setAttribute("aria-label", "选择空间");
  const addPicker = el("select", "layout-picker");
  addPicker.setAttribute("aria-label", "添加家具");
  const entryPicker = el("select", "layout-picker");
  entryPicker.setAttribute("aria-label", "选择入户门");
  const sideHeader = el("div", "layout-side-header");
  const sideBody = el("div", "layout-side-body");
  const entrySettings = el("details", "layout-entry-settings");
  const editor = el("div", "layout-edit-panel");
  const reportFilter = el("div", "layout-report-filter");
  const actions = el("div", "layout-footer-actions");
  const versionStatus = el("p", "layout-version-status layout-status");
  versionStatus.setAttribute("role", "status");
  versionStatus.hidden = true;
  const allRoomsOption = new Option("全部空间", "");
  const soundtrack = music?.url ? createVrBackgroundMusic() : null;
  const musicPackage = soundtrack ? { projectId: music.projectId, versionId: music.versionId, shareMeta: { backgroundMusic: music } } : null;
  let alive = true;
  let viewer;
  let original;
  let model;
  let selectedItemId = null;
  let roomId = "";
  let walkingRoomId = "";
  let measuring = false;
  let mode = "3d";
  let sequence = 0;
  let timer;
  let running = false;
  let runAgain = false;
  let reportData;
  let compareOriginal = false;
  let reportScope = "attention";
  let dirty = false;
  let savedSignature = "";
  let versionAction = "";
  let panoramaCaptureBusy = false;
  let guiding = false;
  const unselect = () => { selectedItemId = null; updateInspector(); viewer?.highlight(null); };
  const visibleModel = () => compareOriginal ? original : model;

  const mode3d = clickButton(readOnly ? "全屋" : "3D", () => {
    if (readOnly) roomId = "";
    switchMode("3d");
    if (readOnly) viewer?.focusRoom("");
  });
  const modePlan = clickButton("平面", () => switchMode("plan"));
  const modeWalk = clickButton("漫游", () => switchMode("walk", { focus: true }));
  const modePanorama = clickButton("全景", () => switchMode("panorama", { focus: true }));
  modePanorama.title = "实时 3D 全景，在当前站位环视房间";
  const measure = clickButton("测距", () => {
    measuring = !measuring;
    if (measuring) switchMode("plan");
    measure.setAttribute("aria-pressed", String(measuring));
    viewer?.setMeasuring(measuring);
    updateViewHint();
  });
  const resetView = clickButton(readOnly ? "复位" : "复位视角", () => viewer?.focusRoom(isInteriorView(mode) ? walkingRoomId : roomId));
  if (readOnly) resetView.title = "复位当前视角";
  const guide = clickButton("导览", () => {
    if (guiding) viewer?.stopGuide();
    else viewer?.startGuide();
  });
  guide.hidden = true;
  guide.disabled = true;
  guide.title = "沿实际室内动线查看各房间全景机位";
  guide.setAttribute("aria-label", "动线导览");
  guide.setAttribute("aria-pressed", "false");
  const compare = clickButton("对比原布局", () => {
    compareOriginal = !compareOriginal;
    compare.textContent = compareOriginal ? "返回校对草稿" : "对比原布局";
    compare.setAttribute("aria-pressed", String(compareOriginal));
    viewer?.update(visibleModel());
    unselect();
    updateEditControls();
    scheduleCheck();
  });
  const save = clickButton("保存校对草稿", saveDraft, onSaveVersion ? "layout-action" : "layout-action layout-action-primary");
  const saveVersion = onSaveVersion && clickButton(saveVersionLabel, saveCurrentVersion, "layout-action layout-action-primary");
  const shareVersion = onShareVersion && clickButton(shareVersionLabel, shareCurrentVersion);
  const run = clickButton("重新检查", () => scheduleCheck(0));
  const exportButton = clickButton("导出校对数据", exportLayout);
  const panoramaExport = typeof panoramaCaptureLabel === "string" && panoramaCaptureLabel.trim()
    ? clickButton("导出全景样张", exportPanorama)
    : null;
  if (panoramaExport) {
    panoramaExport.hidden = true;
    panoramaExport.disabled = true;
    panoramaExport.title = "下载到本机的 4096 × 2048 JPEG 全景样张";
  }
  const musicButton = el("button", "layout-action layout-walk-music", "音乐");
  musicButton.type = "button";
  musicButton.hidden = true;
  soundtrack?.attach(musicButton);
  const fullscreen = clickButton("全屏", toggleFullscreen);
  fullscreen.setAttribute("aria-pressed", "false");
  fullscreenSurface.addEventListener("fullscreenchange", updateFullscreenButton);
  fullscreenSurface.addEventListener("keydown", exitViewportFullscreen);
  window.addEventListener("pagehide", pauseMusic);
  window.addEventListener("blur", clearMovement);
  for (const [direction, glyph, label] of walkDirections) {
    const button = el("button", "layout-walk-direction", glyph);
    button.type = "button";
    button.dataset.direction = direction;
    button.setAttribute("aria-label", label);
    bindWalkDirection(button, direction);
    walkControls.append(button);
  }
  addPicker.append(new Option("添加家具", ""), ...Object.entries(presets).map(([key, value]) => new Option(value.name, key)));
  addPicker.addEventListener("change", () => {
    const preset = presets[addPicker.value];
    addPicker.value = "";
    if (!preset || compareOriginal) return;
    const room = model.rooms.find((room) => room.id === roomId) || model.rooms.find((room) => !room.excludeFromRoutes);
    if (!room) return;
    const center = room.polygon.reduce(([x, z], p) => [x + p[0] / room.polygon.length, z + p[1] / room.polygon.length], [0, 0]);
    const id = `furniture_${crypto.randomUUID()}`;
    model.items.push({ ...preset, id, roomId: room.id, center, bottomM: 0, rotationRad: 0 });
    mutateModel();
    selectItem(id);
  });
  roomPicker.addEventListener("change", () => chooseRoom(roomPicker.value));
  entryPicker.addEventListener("change", () => {
    if (compareOriginal) return;
    model.entranceId = entryPicker.value || null;
    mutateModel();
  });
  const attentionFilter = clickButton("待查看", () => setReportScope("attention"));
  const allFilter = clickButton("全部", () => setReportScope("all"));
  reportFilter.append(attentionFilter, allFilter);
  setReportScope("attention");
  secondaryTools.append(guide, resetView, musicButton);
  if (panoramaExport) secondaryTools.append(panoramaExport);
  secondaryTools.append(fullscreen);
  stage.append(stageStatus, walkControls, walkNotice);
  if (readOnly) {
    roomMenu.hidden = true;
    roomTrigger.append(activeRoomName);
    roomTrigger.setAttribute("aria-label", "切换房间");
    roomMenu.append(roomTrigger, tourRooms);
    roomMenu.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !roomMenu.open) return;
      event.preventDefault();
      roomMenu.open = false;
      roomTrigger.focus({ preventScroll: true });
    });
    fullscreenSurface.addEventListener("pointerdown", closeRoomMenuOutside);
    modeTools.setAttribute("role", "group");
    modeTools.setAttribute("aria-label", "查看方式");
    modeTools.append(modeWalk, modePanorama, mode3d, modePlan);
    toolbar.append(roomMenu, modeTools, secondaryTools);
    toolbar.addEventListener("click", (event) => {
      if (event.detail && isInteriorView(mode) && event.target.closest("button")) focusWalkCanvas();
    });
    viewport.append(stage, toolbar);
  } else {
    modeTools.append(mode3d, modePlan, modeWalk, modePanorama);
    secondaryTools.prepend(measure);
    secondaryTools.append(compare);
    toolbar.append(modeTools, roomPicker, secondaryTools);
    viewport.append(toolbar, stage);
  }
  left.append(viewport, hint, walkHint);
  entrySettings.append(el("summary", null, "检查设置"), entryPicker);
  sideHeader.append(heading, status, reportFilter);
  sideBody.append(report, warnings, entrySettings);
  editor.append(el("h3", null, "家具校对"), addPicker, inspector);
  actions.append(run, exportButton);
  if (allowLocalDraft) actions.append(save);
  if (saveVersion) actions.append(saveVersion);
  if (shareVersion) actions.append(shareVersion);
  if (saveVersion || shareVersion) actions.append(versionStatus);
  right.append(sideHeader, sideBody, editor, actions);
  root.append(left);
  if (!readOnly) root.append(right);
  holder.replaceChildren(root);
  for (const node of [mode3d, modePlan, modeWalk, modePanorama, measure, resetView, compare, roomPicker, entryPicker, addPicker, run, save, exportButton, fullscreen, saveVersion, shareVersion].filter(Boolean)) node.disabled = true;
  updateViewHint();

  function setReportScope(value) {
    reportScope = value;
    attentionFilter.setAttribute("aria-pressed", String(value === "attention"));
    allFilter.setAttribute("aria-pressed", String(value === "all"));
    renderReport();
  }

  function updateViewHint() {
    const walking = mode === "walk";
    hint.hidden = walking;
    walkHint.hidden = !walking;
    if (!walking) {
      hint.textContent = measuring ? "点击平面上的两个点测距。"
        : mode === "plan" ? "滚轮缩放 · 点击家具查看尺寸"
        : mode === "panorama" ? "拖动环视 · 切换房间"
        : "拖动旋转 · 滚轮缩放 · 点击家具查看尺寸";
    }
  }

  function focusWalkCanvas() {
    stage.querySelector("canvas")?.focus({ preventScroll: true });
  }

  function closeRoomMenuOutside(event) {
    if (roomMenu.open && !roomMenu.contains(event.target)) roomMenu.open = false;
  }

  function pauseMusic() {
    soundtrack?.pause();
  }

  function clearMovement() {
    viewer?.clearWalkInput?.();
    for (const button of walkControls.children) button.removeAttribute("data-held");
  }

  function bindWalkDirection(button, direction) {
    let pointerId = null;
    function setHeld(active) {
      viewer?.setWalkInput?.(direction, active);
      button.toggleAttribute("data-held", active);
    }
    button.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || pointerId !== null) return;
      event.preventDefault();
      pointerId = event.pointerId;
      button.setPointerCapture(pointerId);
      setHeld(true);
    });
    function releasePointer(event) {
      if (pointerId !== event.pointerId) return;
      pointerId = null;
      setHeld(false);
    }
    for (const event of ["pointerup", "pointercancel", "lostpointercapture"]) button.addEventListener(event, releasePointer);
    button.addEventListener("keydown", (event) => {
      if (event.key !== " " && event.key !== "Enter") return;
      event.preventDefault();
      if (!event.repeat) setHeld(true);
    });
    button.addEventListener("keyup", (event) => {
      if (event.key === " " || event.key === "Enter") setHeld(false);
    });
    button.addEventListener("blur", () => { if (pointerId === null) setHeld(false); });
  }

  function chooseRoom(id) {
    if (isInteriorView(mode)) walkNotice.textContent = "";
    else roomId = id;
    if (roomMenu) roomMenu.open = false;
    viewer?.focusRoom(id);
    unselect();
    if (readOnly) {
      onSelectItem?.(null);
      updateTourRooms();
      if (isInteriorView(mode)) focusWalkCanvas();
      else roomTrigger.focus({ preventScroll: true });
    }
    renderReport();
  }

  function populateTourRooms() {
    if (!tourRooms) return;
    for (const room of [{ id: "", name: "起点" }, ...model.rooms]) {
      const button = clickButton(room.name, () => chooseRoom(room.id), "layout-tour-room");
      button.disabled = true;
      tourRoomButtons.set(room.id, button);
      tourRooms.append(button);
    }
    roomMenu.hidden = false;
  }

  function updateTourRooms() {
    if (!tourRooms) return;
    const inside = isInteriorView(mode);
    const activeId = inside ? walkingRoomId : roomId;
    tourRoomButtons.get("").textContent = inside ? "起点" : "全部空间";
    for (const [id, button] of tourRoomButtons) button.setAttribute("aria-pressed", String(id === activeId));
    for (const room of model.rooms) tourRoomButtons.get(room.id).hidden = inside && room.excludeFromRoutes;
    activeRoomName.textContent = tourRoomButtons.get(activeId)?.textContent || "房间";
    roomTrigger.setAttribute("aria-label", `切换房间，当前${activeRoomName.textContent}`);
  }

  function updateFullscreenButton() {
    const expanded = document.fullscreenElement === fullscreenSurface || fullscreenSurface.classList.contains("layout-viewport--expanded");
    fullscreen.textContent = expanded ? "退出全屏" : "全屏";
    fullscreen.setAttribute("aria-pressed", String(expanded));
  }

  function exitViewportFullscreen(event) {
    if (event.key === "Escape" && fullscreenSurface.classList.contains("layout-viewport--expanded")) {
      fullscreenSurface.classList.remove("layout-viewport--expanded");
      updateFullscreenButton();
      fullscreen.focus();
    }
  }

  async function toggleFullscreen(event) {
    if (fullscreenSurface.classList.contains("layout-viewport--expanded")) {
      fullscreenSurface.classList.remove("layout-viewport--expanded");
    } else if (document.fullscreenElement === fullscreenSurface) {
      await document.exitFullscreen().catch(() => {});
    } else {
      try {
        if (document.fullscreenEnabled && fullscreenSurface.requestFullscreen) await fullscreenSurface.requestFullscreen();
        else fullscreenSurface.classList.add("layout-viewport--expanded");
      } catch {
        fullscreenSurface.classList.add("layout-viewport--expanded");
      }
    }
    updateFullscreenButton();
    if (isInteriorView(mode) && event.detail) focusWalkCanvas();
  }

  function switchMode(value, { focus = false, initializing = false } = {}) {
    const previousMode = mode;
    const wasInside = isInteriorView(mode);
    const wasWalking = mode === "walk";
    mode = value;
    if (roomMenu) roomMenu.open = false;
    const inside = isInteriorView(mode);
    const walking = mode === "walk";
    if (mode !== "plan" && measuring) {
      measuring = false;
      measure.setAttribute("aria-pressed", "false");
      viewer?.setMeasuring(false);
    }
    if (wasWalking && !walking) clearMovement();
    if (wasInside && !inside) {
      walkingRoomId = "";
      onWalkRoom?.(null);
    }
    walkNotice.textContent = "";
    mode3d.setAttribute("aria-pressed", String(mode === "3d"));
    modePlan.setAttribute("aria-pressed", String(mode === "plan"));
    modeWalk.setAttribute("aria-pressed", String(walking));
    modePanorama.setAttribute("aria-pressed", String(mode === "panorama"));
    guide.hidden = !walking || (model?.viewpoints?.length ?? 0) < 2;
    updatePanoramaExport();
    root.classList.toggle("is-interior", inside);
    walkControls.hidden = !walking;
    measure.hidden = inside;
    allRoomsOption.textContent = inside ? "起点" : "全部空间";
    for (const option of roomPicker.options) option.hidden = inside && Boolean(model?.rooms.find((room) => room.id === option.value)?.excludeFromRoutes);
    roomPicker.value = inside ? walkingRoomId : roomId;
    soundtrack?.setPackage(inside ? musicPackage : null);
    viewer?.setMode(value);
    if ((inside !== wasInside && roomId) || (initializing && !inside && roomId)) viewer?.focusRoom(roomId);
    if (focus) focusWalkCanvas();
    updateViewHint();
    updateTourRooms();
    renderReport();
    if (!initializing && previousMode !== mode) onViewModeChange?.(mode);
  }

  function updatePanoramaExport() {
    if (!panoramaExport) return;
    panoramaExport.hidden = mode !== "panorama";
    panoramaExport.disabled = !viewer?.capturePanorama || panoramaCaptureBusy;
    panoramaExport.setAttribute("aria-busy", String(panoramaCaptureBusy));
    panoramaExport.textContent = panoramaCaptureBusy ? "正在出图…" : "导出全景样张";
  }

  async function exportPanorama() {
    if (!alive || mode !== "panorama" || !viewer?.capturePanorama || panoramaCaptureBusy) return;
    panoramaCaptureBusy = true;
    updatePanoramaExport();
    walkNotice.textContent = "正在生成 4096 × 2048 全景样张…";
    try {
      const { blob, width, height, roomId, roomName } = await viewer.capturePanorama();
      if (!alive) return;
      if (!(blob instanceof Blob) || !blob.size || width !== 4096 || height !== 2048) {
        throw new Error("全景样张未成功生成，请重试。");
      }
      const project = filenamePart(panoramaCaptureLabel) || "全景样张";
      const room = filenamePart(roomName || roomId) || "房间";
      const url = URL.createObjectURL(blob);
      const anchor = el("a");
      anchor.href = url;
      anchor.download = `${project}-${room}-360-${width}x${height}.jpg`;
      anchor.hidden = true;
      root.append(anchor);
      try { anchor.click(); }
      finally {
        anchor.remove();
        setTimeout(() => URL.revokeObjectURL(url), 10000);
      }
      if (mode === "panorama") walkNotice.textContent = `${roomName || "当前空间"}全景样张已生成。`;
    } catch (error) {
      if (alive && mode === "panorama") walkNotice.textContent = error?.message || "无法生成全景样张，请重试。";
    } finally {
      panoramaCaptureBusy = false;
      if (alive) updatePanoramaExport();
    }
  }

  function handleWalkRoom(id) {
    if (!isInteriorView(mode) || !alive) return;
    walkingRoomId = id || "";
    roomPicker.value = walkingRoomId;
    updateTourRooms();
    renderReport();
    onWalkRoom?.(id || null);
  }

  function selectItem(id) {
    selectedItemId = id;
    updateInspector();
    viewer?.highlight(id);
    onSelectItem?.(id);
  }

  function updateInspector() {
    if (readOnly) return;
    const item = visibleModel()?.items.find((item) => item.id === selectedItemId);
    inspector.replaceChildren();
    if (!item) return;
    inspector.append(el("h3", null, item.name));
    const fields = el("div", "layout-fields");
    for (const [label, getter, setter, min, max] of [
      ["X 位置 (毫米)", () => item.center[0] * 1000, (number) => { item.center[0] = number / 1000; }, -500000, 500000],
      ["Y 位置 (毫米)", () => item.center[1] * 1000, (number) => { item.center[1] = number / 1000; }, -500000, 500000],
      ["宽度 (毫米)", () => item.widthM * 1000, (number) => { item.widthM = number / 1000; }, 20, 30000],
      ["深度 (毫米)", () => item.depthM * 1000, (number) => { item.depthM = number / 1000; }, 20, 30000],
      ["旋转 (度)", () => item.rotationRad * 180 / Math.PI, (number) => { item.rotationRad = number * Math.PI / 180; }, -360, 360],
    ]) {
      const input = el("input");
      input.type = "number";
      input.value = String(Math.round(getter()));
      input.min = String(min);
      input.max = String(max);
      input.disabled = compareOriginal;
      input.addEventListener("change", () => {
        const value = input.valueAsNumber;
        if (!Number.isFinite(value) || value < min || value > max) {
          input.value = String(Math.round(getter()));
          return;
        }
        setter(value);
        item.roomId = model.rooms.find((room) => containsPoint(item.center, room.polygon))?.id || null;
        mutateModel();
      });
      const field = el("label", "layout-field", label);
      field.append(input);
      fields.append(field);
    }
    inspector.append(fields);
    if (!compareOriginal && !original.items.some((candidate) => candidate.id === item.id)) {
      inspector.append(clickButton("移除新增家具", () => {
        model.items = model.items.filter((candidate) => candidate.id !== item.id);
        unselect();
        mutateModel();
      }));
    }
  }

  function mutateModel() {
    dirty = JSON.stringify(model) !== savedSignature;
    if (shareVersion && !versionAction) {
      if (dirty) setVersionStatus("当前改动保存为新版本后即可分享。");
      else versionStatus.hidden = true;
    }
    updateEditControls();
    viewer?.update(model);
    viewer?.highlight(selectedItemId);
    onSceneChange?.(structuredClone(model));
    scheduleCheck();
  }

  function saveDraft() {
    if (!allowLocalDraft || !model || !key || compareOriginal) return;
    try {
      localStorage.setItem(`xspace:layout:${key}`, JSON.stringify(loadLayoutScene(model)));
      status.textContent = "校对草稿已保存到此浏览器。";
    } catch (error) {
      status.textContent = `无法保存草稿。${error?.message || "可导出校对数据。"}`;
    }
  }

  function updateEditControls() {
    if (readOnly) return;
    const saving = versionAction === "save";
    const disabled = !model || compareOriginal || saving;
    compare.disabled = !model || saving;
    addPicker.disabled = disabled || !model?.rooms.length;
    entryPicker.disabled = disabled;
    save.disabled = disabled;
    editor.inert = saving;
    if (saveVersion) saveVersion.disabled = disabled || (!dirty && !allowSaveUnchanged) || Boolean(versionAction);
    if (shareVersion) {
      shareVersion.disabled = !model || compareOriginal || dirty || Boolean(versionAction);
      shareVersion.title = dirty ? "保存新版本后才能分享" : "";
    }
  }

  function setVersionStatus(message, failed = false) {
    versionStatus.hidden = false;
    versionStatus.dataset.state = failed ? "attention" : "ready";
    versionStatus.textContent = message;
  }

  async function saveCurrentVersion() {
    if (!model || compareOriginal || (!dirty && !allowSaveUnchanged) || versionAction) return;
    versionAction = "save";
    updateEditControls();
    setVersionStatus(`正在${saveVersionLabel}…`);
    try {
      const snapshot = loadLayoutScene(model);
      const message = await onSaveVersion(snapshot);
      if (!alive) return;
      if (message === null) {
        setVersionStatus("已取消保存，改动仍在草稿中。");
        return;
      }
      savedSignature = JSON.stringify(snapshot);
      dirty = JSON.stringify(model) !== savedSignature;
      setVersionStatus(typeof message === "string" && message ? message : "新版本已保存。");
    } catch (error) {
      if (alive) setVersionStatus(error?.message || `暂时无法${saveVersionLabel}。`, true);
    } finally {
      versionAction = "";
      if (alive) updateEditControls();
    }
  }

  async function shareCurrentVersion() {
    if (!model || compareOriginal || dirty || versionAction) return;
    versionAction = "share";
    updateEditControls();
    setVersionStatus("正在生成漫游链接…");
    try {
      const message = await onShareVersion();
      if (alive) setVersionStatus(typeof message === "string" && message ? message : "已生成漫游分享链接。");
    } catch (error) {
      if (alive) setVersionStatus(error?.message || "暂时无法生成漫游链接。", true);
    } finally {
      versionAction = "";
      if (alive) updateEditControls();
    }
  }

  function exportLayout() {
    const exported = JSON.stringify(loadLayoutScene(visibleModel()), null, 2);
    const url = URL.createObjectURL(new Blob([exported], { type: "application/json" }));
    const anchor = el("a");
    anchor.href = url;
    anchor.download = "layout-review.json";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function scheduleCheck(delay = 240) {
    if (!alive || readOnly || !model) return;
    sequence += 1;
    clearTimeout(timer);
    timer = setTimeout(check, delay);
  }

  async function check() {
    if (!alive || !model) return;
    if (running) { runAgain = true; return; }
    running = true;
    const attempt = sequence;
    status.textContent = "正在检查通道、洞口和门扇…";
    try {
      const { analyzeLayout } = await import("./pascal.js");
      const result = await analyzeLayout(structuredClone(visibleModel()));
      if (!alive || attempt !== sequence) return;
      reportData = result;
      const alertedOpenings = new Set((result.openings || []).filter((item) => item.status === "attention").map((item) => item.id));
      const additionalRoutes = (result.routes || []).filter((item) => ["narrow", "unreachable"].includes(item.status) &&
        !(item.obstacles || []).some((obstacle) => alertedOpenings.has(obstacle.id)));
      const issueCount = alertedOpenings.size + additionalRoutes.length;
      status.textContent = `${issueCount ? `${issueCount} 项需要查看` : "未发现已可判定的问题"} · ${compareOriginal ? "原布局" : "当前校对布局"}`;
      renderReport();
    } catch (error) {
      if (alive && attempt === sequence) status.textContent = `暂时无法完成空间检查。${error?.message || "请重试。"}`;
    } finally {
      running = false;
      if (runAgain) { runAgain = false; scheduleCheck(0); }
    }
  }

  function renderReport() {
    if (readOnly) return;
    const scene = visibleModel();
    report.replaceChildren();
    warnings.replaceChildren();
    const sourceWarnings = [...new Set([...(scene?.warnings || []), ...(reportData?.warnings || [])])];
    warnings.hidden = !sourceWarnings.length;
    if (sourceWarnings.length) warnings.append(el("summary", null, `${sourceWarnings.length} 条尺寸或判读说明`), ...sourceWarnings.map((message) => el("p", null, message)));
    if (!reportData) return;
    const openings = new Map(scene.openings.map((opening) => [opening.id, opening]));
    const rooms = new Map(scene.rooms.map((room) => [room.id, room]));
    const inspectedRoom = isInteriorView(mode) ? walkingRoomId : roomId;
    const checks = (reportData.openings || []).filter((item) => (!inspectedRoom || openings.get(item.id)?.roomIds.includes(inspectedRoom)) &&
      (reportScope === "all" || ["attention", "unknown"].includes(item.status)));
    const pathNeedsReview = (item) => ["narrow", "unreachable", "unknown"].includes(item.status);
    const relatedOpeningIds = new Set(checks.map((item) => item.id));
    const paths = (reportData.routes || []).filter((item) => (!inspectedRoom || item.roomId === inspectedRoom) &&
      (reportScope === "all" || (pathNeedsReview(item) && !item.obstacles?.some((obstacle) => relatedOpeningIds.has(obstacle.id)))));
    function show(label, rows, renderRow) {
      const group = el("section", "layout-report-group");
      group.append(el("h3", null, label));
      if (!rows.length) group.append(el("p", "layout-hint", reportScope === "attention" ? "当前没有需要单独查看的结果。" : "没有可显示的结果。"));
      for (const row of rows) group.append(renderRow(row));
      report.append(group);
    }
    function resultButton(title, meta, details, type, point, blockers) {
      const button = clickButton("", () => {
        viewer?.highlight(null, point, blockers.map((item) => item.id));
        selectedItemId = scene.items.find((item) => blockers.some((blocker) => blocker.id === item.id))?.id || null;
        updateInspector();
      }, `layout-result ${type === "attention" ? "needs-attention" : ""}`);
      const head = el("span", "layout-result-head");
      head.append(el("strong", null, title), el("span", null, meta));
      button.append(head);
      if (details) button.append(el("small", null, details));
      return button;
    }
    show("洞口与门扇", checks.toSorted((a, b) => Number(b.status === "attention") - Number(a.status === "attention")), (result) => {
      const opening = openings.get(result.id);
      const blockers = result.blockers || [];
      const width = Number.isFinite(result.widthM) ? `净宽 ${millimeters(result.widthM)}` : "净宽待核";
      const angle = Number.isFinite(result.angleDeg) ? ` · ${result.angleDeg}°` : (result.swingStatus === "unknown" ? " · 开向待核" : "");
      const details = [opening?.roomIds.map((id) => rooms.get(id)?.name).filter(Boolean).join(" / "),
        opening?.excludedReason || result.reason, opening?.doorType === "sliding" ? "固定开口" : "", ...blockers.map((obstacle) => obstacle.name)].filter(Boolean).join(" · ");
      return resultButton(opening?.name || byOpening.get(opening?.kind) || "洞口", width + angle, details, result.status, result.point, blockers);
    });
    if (paths.length || reportScope === "all") show("从入户门通行", paths, (path) => resultButton(rooms.get(path.roomId)?.name || "房间",
      Number.isFinite(path.widthM) ? millimeters(path.widthM) : path.status === "unreachable" ? "不可达" : "待核验",
      [path.reason, ...(path.obstacles || []).map((obstacle) => obstacle.name)].filter(Boolean).join(" / "), ["narrow", "unreachable"].includes(path.status) ? "attention" : "", path.point, path.obstacles || []));
    entryPicker.value = scene.entranceId || "";
  }

  (async () => {
    try {
      let data = source;
      if (typeof source === "string") {
        const url = new URL(source, location.href);
        if (url.origin !== location.origin) throw new Error("方案校对数据必须来自当前网站。");
        const response = await fetch(url);
        if (!response.ok) throw new Error("无法读取此方案的户型模型。");
        data = await response.json();
      }
      if (!alive) return;
      original = loadLayoutScene(data);
      const localDraft = allowLocalDraft && !readOnly && !draft && key ? readLayoutDraft(key) : null;
      model = readOnly ? original : draft ? loadLayoutScene(draft) : localDraft || structuredClone(original);
      roomPicker.append(allRoomsOption, ...model.rooms.map((room) => new Option(room.name, room.id)));
      populateTourRooms();
      if (!readOnly) {
        savedSignature = JSON.stringify(original);
        dirty = JSON.stringify(model) !== savedSignature;
        if (shareVersion && dirty) setVersionStatus("当前改动保存为新版本后即可分享。");
        onSceneChange?.(structuredClone(model));
        const interiorRooms = new Set(model.rooms.filter((room) => !room.excludeFromRoutes).map((room) => room.id));
        const entryOptions = model.openings.filter((opening) => opening.kind !== "window" && opening.wallId && !opening.excludedReason &&
          (opening.id === original.entranceId || opening.roomIds.filter((id) => interiorRooms.has(id)).length <= 1));
        entryPicker.append(new Option("入户门待确认", ""), ...entryOptions.map((opening) => new Option(opening.name, opening.id)));
        entrySettings.open = !model.entranceId;
        if (model.entranceId && ![...entryPicker.options].some((option) => option.value === model.entranceId)) {
          entryPicker.add(new Option(model.openings.find((opening) => opening.id === model.entranceId)?.name || "当前入户门", model.entranceId));
        }
        entryPicker.value = model.entranceId || "";
        run.disabled = false;
        exportButton.disabled = false;
        updateEditControls();
        renderReport();
        scheduleCheck(0);
      }
      try {
        const { createLayoutViewer } = await import("./viewer.js?v=studio-version-save");
        if (!alive) return;
        viewer = createLayoutViewer(stage, {
          styleId,
          visualProfile,
          onItem: selectItem,
          onMeasure: (value) => { hint.textContent = value == null ? "选择第二个测量点。" : `距离 ${millimeters(value)}`; },
          onWalkRoom: handleWalkRoom,
          onWalkNotice: (message) => { if (alive && isInteriorView(mode)) walkNotice.textContent = message || ""; },
          onGuideChange: (active) => {
            guiding = active;
            guide.textContent = active ? "停止" : "导览";
            guide.title = active ? "停止动线导览" : "沿实际室内动线查看各房间全景机位";
            guide.setAttribute("aria-pressed", String(active));
          },
        });
        viewer.update(model, { reset: true });
        const view = ["3d", "plan", "walk", "panorama"].includes(initialMode) ? initialMode : "3d";
        roomId = model.rooms.find((room) => room.id === initialRoomId && (!isInteriorView(view) || !room.excludeFromRoutes))?.id || "";
        const preparingWalk = readOnly && isInteriorView(view);
        if (preparingWalk) {
          root.classList.add("is-preparing-walk");
          stageStatus.textContent = view === "panorama" ? "正在载入全景场景…" : "正在载入漫游…";
        }
        switchMode(view, { focus: isInteriorView(view), initializing: true });
        if (preparingWalk) {
          let deadline;
          try {
            await Promise.race([viewer.readyForWalk(), new Promise((resolve) => { deadline = setTimeout(resolve, 2600); })]);
          } finally {
            clearTimeout(deadline);
            root.classList.remove("is-preparing-walk");
          }
          if (!alive) return;
          focusWalkCanvas();
        }
        stageStatus.hidden = true;
        for (const node of [mode3d, modePlan, modeWalk, modePanorama, measure, resetView, roomPicker, fullscreen, guide]) node.disabled = false;
        for (const button of tourRoomButtons.values()) button.disabled = false;
      } catch {
        stageStatus.textContent = readOnly ? "当前浏览器无法显示 3D 漫游。" : "当前浏览器无法显示 3D。你仍可在右侧查看空间检查结果。";
      }
    } catch (error) {
      if (!alive) return;
      stageStatus.textContent = error?.message || "无法加载户型模型。";
      status.textContent = stageStatus.textContent;
    }
  })();
  return {
    dispose() {
      alive = false;
      clearTimeout(timer);
      window.removeEventListener("pagehide", pauseMusic);
      window.removeEventListener("blur", clearMovement);
      fullscreenSurface.removeEventListener("fullscreenchange", updateFullscreenButton);
      fullscreenSurface.removeEventListener("keydown", exitViewportFullscreen);
      fullscreenSurface.classList.remove("layout-viewport--expanded");
      fullscreenSurface.removeEventListener("pointerdown", closeRoomMenuOutside);
      if (document.fullscreenElement === fullscreenSurface) document.exitFullscreen().catch(() => {});
      soundtrack?.setPackage(null);
      viewer?.dispose();
      root.remove();
    },
  };
}
