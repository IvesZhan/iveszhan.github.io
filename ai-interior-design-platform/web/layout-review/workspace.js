import { containsPoint, loadLayoutScene } from "./scene.js";

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

const millimeters = (number) => `${Math.round(number * 1000).toLocaleString("zh-CN")} 毫米`;
const byOpening = new Map([ ["door", "门"], ["passage", "通道"], ["window", "窗"] ]);

export function readLayoutDraft(key) {
  try {
    const saved = localStorage.getItem(`xspace:layout:${key}`);
    return saved ? loadLayoutScene(JSON.parse(saved)) : null;
  } catch {
    return null;
  }
}

export function createLayoutWorkspace(holder, { source, key, draft, onSceneChange } = {}) {
  const root = el("section", "layout-workbench");
  const left = el("section", "layout-drawing");
  const toolbar = el("div", "layout-tools");
  const stage = el("div", "layout-canvas");
  const viewport = el("div", "layout-viewport");
  const modeTools = el("div", "layout-view-toggle");
  const secondaryTools = el("div", "layout-tool-secondary");
  const hint = el("p", "layout-hint", "拖动旋转 · 滚轮缩放 · 点击家具查看尺寸");
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
  let alive = true;
  let viewer;
  let original;
  let model;
  let selectedItemId = null;
  let roomId = "";
  let measuring = false;
  let mode = "3d";
  let sequence = 0;
  let timer;
  let running = false;
  let runAgain = false;
  let reportData;
  let compareOriginal = false;
  let reportScope = "attention";
  const unselect = () => { selectedItemId = null; updateInspector(); viewer?.highlight(null); };
  const visibleModel = () => compareOriginal ? original : model;

  const mode3d = clickButton("3D", () => switchMode("3d"));
  const modePlan = clickButton("平面", () => switchMode("plan"));
  const measure = clickButton("测距", () => {
    measuring = !measuring;
    if (measuring) switchMode("plan");
    measure.setAttribute("aria-pressed", String(measuring));
    viewer?.setMeasuring(measuring);
    hint.textContent = measuring ? "点击平面上的两个点测距。" : "点击家具查看尺寸";
  });
  const resetView = clickButton("复位视角", () => viewer?.focusRoom(roomId));
  const compare = clickButton("对比原布局", () => {
    compareOriginal = !compareOriginal;
    compare.textContent = compareOriginal ? "返回校对草稿" : "对比原布局";
    compare.setAttribute("aria-pressed", String(compareOriginal));
    viewer?.update(visibleModel());
    unselect();
    scheduleCheck();
  });
  const save = clickButton("保存校对草稿", saveDraft, "layout-action layout-action-primary");
  const run = clickButton("重新检查", () => scheduleCheck(0));
  const exportButton = clickButton("导出校对数据", exportLayout);
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
  roomPicker.addEventListener("change", () => {
    roomId = roomPicker.value;
    viewer?.focusRoom(roomId);
    unselect();
    renderReport();
  });
  entryPicker.addEventListener("change", () => {
    if (compareOriginal) return;
    model.entranceId = entryPicker.value || null;
    mutateModel();
  });
  const attentionFilter = clickButton("待查看", () => setReportScope("attention"));
  const allFilter = clickButton("全部", () => setReportScope("all"));
  reportFilter.append(attentionFilter, allFilter);
  setReportScope("attention");
  modeTools.append(mode3d, modePlan);
  secondaryTools.append(measure, resetView, compare);
  toolbar.append(modeTools, roomPicker, secondaryTools);
  viewport.append(toolbar, stage);
  left.append(viewport, hint);
  entrySettings.append(el("summary", null, "检查设置"), entryPicker);
  sideHeader.append(heading, status, reportFilter);
  sideBody.append(report, warnings, entrySettings);
  editor.append(el("h3", null, "家具校对"), addPicker, inspector);
  actions.append(run, exportButton, save);
  right.append(sideHeader, sideBody, editor, actions);
  root.append(left, right);
  holder.replaceChildren(root);
  for (const node of [mode3d, modePlan, measure, resetView, compare, roomPicker, entryPicker, addPicker, run, save, exportButton]) node.disabled = true;

  function setReportScope(value) {
    reportScope = value;
    attentionFilter.setAttribute("aria-pressed", String(value === "attention"));
    allFilter.setAttribute("aria-pressed", String(value === "all"));
    renderReport();
  }

  function switchMode(value) {
    mode = value;
    if (mode === "3d" && measuring) {
      measuring = false;
      measure.setAttribute("aria-pressed", "false");
      viewer?.setMeasuring(false);
      hint.textContent = "拖动旋转 · 滚轮缩放 · 点击家具查看尺寸";
    }
    mode3d.setAttribute("aria-pressed", String(mode === "3d"));
    modePlan.setAttribute("aria-pressed", String(mode === "plan"));
    viewer?.setMode(value);
  }

  function selectItem(id) {
    selectedItemId = id;
    updateInspector();
    viewer?.highlight(id);
  }

  function updateInspector() {
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
    viewer?.update(model);
    viewer?.highlight(selectedItemId);
    onSceneChange?.(structuredClone(model));
    scheduleCheck();
  }

  function saveDraft() {
    if (!model || !key || compareOriginal) return;
    try {
      localStorage.setItem(`xspace:layout:${key}`, JSON.stringify(loadLayoutScene(model)));
      status.textContent = "校对草稿已保存到此浏览器。";
    } catch (error) {
      status.textContent = `无法保存草稿。${error?.message || "可导出校对数据。"}`;
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
    if (!model) return;
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
    const scene = visibleModel();
    report.replaceChildren();
    warnings.replaceChildren();
    const sourceWarnings = [...new Set([...(scene?.warnings || []), ...(reportData?.warnings || [])])];
    warnings.hidden = !sourceWarnings.length;
    if (sourceWarnings.length) warnings.append(el("summary", null, `${sourceWarnings.length} 条尺寸或判读说明`), ...sourceWarnings.map((message) => el("p", null, message)));
    if (!reportData) return;
    const openings = new Map(scene.openings.map((opening) => [opening.id, opening]));
    const rooms = new Map(scene.rooms.map((room) => [room.id, room]));
    const checks = (reportData.openings || []).filter((item) => (!roomId || openings.get(item.id)?.roomIds.includes(roomId)) &&
      (reportScope === "all" || ["attention", "unknown"].includes(item.status)));
    const pathNeedsReview = (item) => ["narrow", "unreachable", "unknown"].includes(item.status);
    const relatedOpeningIds = new Set(checks.map((item) => item.id));
    const paths = (reportData.routes || []).filter((item) => (!roomId || item.roomId === roomId) &&
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
    addPicker.disabled = compareOriginal || !model.rooms.length;
    entryPicker.disabled = compareOriginal;
    save.disabled = compareOriginal;
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
      model = draft ? loadLayoutScene(draft) : (key && readLayoutDraft(key)) || structuredClone(original);
      onSceneChange?.(structuredClone(model));
      roomPicker.append(new Option("全部空间", ""), ...model.rooms.map((room) => new Option(room.name, room.id)));
      const interiorRooms = new Set(model.rooms.filter((room) => !room.excludeFromRoutes).map((room) => room.id));
      const entryOptions = model.openings.filter((opening) => opening.kind !== "window" && opening.wallId && !opening.excludedReason &&
        (opening.id === original.entranceId || opening.roomIds.filter((id) => interiorRooms.has(id)).length <= 1));
      entryPicker.append(new Option("入户门待确认", ""), ...entryOptions.map((opening) => new Option(opening.name, opening.id)));
      entrySettings.open = !model.entranceId;
      if (model.entranceId && ![...entryPicker.options].some((option) => option.value === model.entranceId)) {
        entryPicker.add(new Option(model.openings.find((opening) => opening.id === model.entranceId)?.name || "当前入户门", model.entranceId));
      }
      entryPicker.value = model.entranceId || "";
      for (const node of [compare, roomPicker, entryPicker, addPicker, run, save, exportButton]) node.disabled = false;
      renderReport();
      scheduleCheck(0);
      try {
        const { createLayoutViewer } = await import("./viewer.js");
        if (!alive) return;
        viewer = createLayoutViewer(stage, { onItem: selectItem, onMeasure: (value) => { hint.textContent = value == null ? "选择第二个测量点。" : `距离 ${millimeters(value)}`; } });
        viewer.update(model, { reset: true });
        switchMode("3d");
        for (const node of [mode3d, modePlan, measure, resetView]) node.disabled = false;
      } catch {
        stage.textContent = "当前浏览器无法显示 3D。你仍可在右侧查看空间检查结果。";
      }
    } catch (error) {
      if (alive) status.textContent = error?.message || "无法加载户型校对。";
    }
  })();
  return {
    dispose() { alive = false; clearTimeout(timer); viewer?.dispose(); root.remove(); },
  };
}
