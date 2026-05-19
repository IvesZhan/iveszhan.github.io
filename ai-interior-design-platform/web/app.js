import { APP_CONFIG } from "./config.js";

const samples = [
  {
    id: "yixingyuan",
    name: "益兴园",
    title: "中古风整屋方案",
    status: "V2 · 业主确认版",
    area: "128 m²",
    style: "中古风",
    delivery: "效果图 + VR",
    summary: "已完成客餐厅、餐厨、主卧和 VR 全景预览，适合直接进入客户评审。",
    rooms: [
      {
        id: "living",
        name: "客餐厅效果",
        image: "./assets/showcase/project-vintage.jpg",
        alt: "益兴园客餐厅效果图",
      },
      {
        id: "kitchen",
        name: "餐厨效果",
        image: "./assets/showcase/detail-kitchen.jpg",
        alt: "益兴园餐厨效果图",
      },
      {
        id: "bedroom",
        name: "主卧",
        image: "./assets/master-bedroom.jpg",
        alt: "益兴园主卧效果图",
      },
      {
        id: "vr",
        name: "VR 全景",
        image: "./assets/showcase/vr-panorama.jpg",
        alt: "益兴园 VR 全景预览",
      },
    ],
  },
  {
    id: "jianningfu",
    name: "建宁府",
    title: "现代简约初版方案",
    status: "V1 · 设计师审阅",
    area: "96 m²",
    style: "现代简约",
    delivery: "效果图 + 全景",
    summary: "现代简约方向，进入设计师复核。",
    designerOnly: true,
    rooms: [
      {
        id: "living",
        name: "客厅效果",
        image: "./assets/showcase/project-modern.jpg",
        alt: "建宁府现代简约客厅效果图",
      },
      {
        id: "bathroom",
        name: "卫浴效果",
        image: "./assets/showcase/detail-bathroom.jpg",
        alt: "建宁府现代卫浴效果图",
      },
      {
        id: "vr",
        name: "VR 全景",
        image: "./assets/showcase/vr-panorama.jpg",
        alt: "建宁府 VR 全景预览",
      },
    ],
  },
  {
    id: "yun-jing-tai",
    name: "云境台",
    title: "奶油风全屋初版",
    status: "初版 · 待复核",
    area: "112 m²",
    style: "奶油风",
    delivery: "效果图 + 全景",
    summary: "奶油风方向，待复核收纳与灯光。",
    designerOnly: true,
    rooms: [
      {
        id: "living",
        name: "客厅效果",
        image: "./assets/showcase/project-cream.jpg",
        alt: "云境台奶油风客厅效果图",
      },
      {
        id: "kitchen",
        name: "餐厨效果",
        image: "./assets/showcase/detail-kitchen.jpg",
        alt: "云境台奶油风餐厨效果图",
      },
      {
        id: "materials",
        name: "材质板",
        image: "./assets/showcase/materials-moodboard.jpg",
        alt: "云境台奶油风材质板",
      },
    ],
  },
  {
    id: "linyuli",
    name: "林屿里",
    title: "原木风家庭方案",
    status: "V1 · 设计师审阅",
    area: "138 m²",
    style: "原木风",
    delivery: "效果图 + VR",
    summary: "原木风方向，适合家庭居住场景。",
    designerOnly: true,
    rooms: [
      {
        id: "living",
        name: "客厅效果",
        image: "./assets/showcase/project-wood.jpg",
        alt: "林屿里原木风客厅效果图",
      },
      {
        id: "kitchen",
        name: "开放餐厨",
        image: "./assets/showcase/detail-kitchen.jpg",
        alt: "林屿里开放餐厨效果图",
      },
      {
        id: "vr",
        name: "VR 全景",
        image: "./assets/showcase/vr-panorama.jpg",
        alt: "林屿里 VR 全景预览",
      },
    ],
  },
];

const role = resolveAccountRole();
const canUseDesignerWorkspace =
  role === "designer" || APP_CONFIG.featureFlags.designerWorkspace === true;
let availableSamples = canUseDesignerWorkspace
  ? samples
  : samples.filter((sample) => !sample.designerOnly);

const body = document.body;
const panels = [...document.querySelectorAll("[data-panel]")];
const sampleList = document.querySelector("#sampleList");
const detailStatus = document.querySelector("#detailStatus");
const detailTitle = document.querySelector("#detailTitle");
const detailImage = document.querySelector("#detailImage");
const detailRoomName = document.querySelector("#detailRoomName");
const detailSummary = document.querySelector("#detailSummary");
const detailArea = document.querySelector("#detailArea");
const detailStyle = document.querySelector("#detailStyle");
const detailDelivery = document.querySelector("#detailDelivery");
const detailRoomTabs = document.querySelector("#detailRoomTabs");
const navButtons = [...document.querySelectorAll("[data-go-tab]")];
const schemeTabButtons = [...document.querySelectorAll("[data-scheme-tab]")];
const schemePanes = [...document.querySelectorAll("[data-scheme-pane]")];
const importStepInputs = [...document.querySelectorAll("[data-import-step]")];
const styleOptionButtons = [...document.querySelectorAll("[data-style-option]")];
const designIdeaInput = document.querySelector("[data-design-idea]");
const generateButton = document.querySelector("[data-generate-plan]");
const generationStatusPanel = document.querySelector("[data-generation-status]");
const floorValidationPanel = document.querySelector("[data-floor-validation]");
const importSteps = ["floor", "style"];
const importState = Object.fromEntries(importSteps.map((step) => [step, false]));
const stylePackages = {
  vintage: {
    label: "中古风",
    title: "中古风整屋方案",
    summary: "中古风方向，已准备效果图、全景和交付入口。",
    rooms: [
      { id: "living", name: "客餐厅效果图", image: "./assets/showcase/project-vintage.jpg", alt: "中古风客餐厅效果图" },
      { id: "kitchen", name: "餐厨效果图", image: "./assets/showcase/detail-kitchen.jpg", alt: "中古风餐厨效果图" },
      { id: "bedroom", name: "主卧效果图", image: "./assets/master-bedroom.jpg", alt: "中古风主卧效果图" },
      { id: "vr", name: "VR 全景", image: "./assets/showcase/vr-panorama.jpg", alt: "中古风 VR 全景预览" },
    ],
  },
  cream: {
    label: "奶油风",
    title: "奶油风整屋方案",
    summary: "奶油风方向，已准备效果图、全景和交付入口。",
    rooms: [
      { id: "living", name: "客厅效果图", image: "./assets/showcase/project-cream.jpg", alt: "奶油风客厅生成预览" },
      { id: "kitchen", name: "餐厨效果图", image: "./assets/showcase/detail-kitchen.jpg", alt: "奶油风餐厨生成预览" },
      { id: "materials", name: "材质板", image: "./assets/showcase/materials-moodboard.jpg", alt: "奶油风材质生成预览" },
      { id: "vr", name: "VR 全景", image: "./assets/showcase/vr-panorama.jpg", alt: "奶油风 VR 全景预览" },
    ],
  },
  modern: {
    label: "现代简约",
    title: "现代简约整屋方案",
    summary: "现代简约方向，已准备效果图、全景和交付入口。",
    rooms: [
      { id: "living", name: "客厅效果图", image: "./assets/showcase/project-modern.jpg", alt: "现代简约客厅生成预览" },
      { id: "bathroom", name: "卫浴效果图", image: "./assets/showcase/detail-bathroom.jpg", alt: "现代简约卫浴生成预览" },
      { id: "materials", name: "材质板", image: "./assets/showcase/materials-moodboard.jpg", alt: "现代简约材质生成预览" },
      { id: "vr", name: "VR 全景", image: "./assets/showcase/vr-panorama.jpg", alt: "现代简约 VR 全景预览" },
    ],
  },
  wood: {
    label: "原木风",
    title: "原木风整屋方案",
    summary: "原木风方向，已准备效果图、全景和交付入口。",
    rooms: [
      { id: "living", name: "客厅效果图", image: "./assets/showcase/project-wood.jpg", alt: "原木风客厅生成预览" },
      { id: "kitchen", name: "厨房效果图", image: "./assets/showcase/detail-kitchen.jpg", alt: "原木风厨房生成预览" },
      { id: "materials", name: "材质板", image: "./assets/showcase/materials-moodboard.jpg", alt: "原木风材质生成预览" },
      { id: "vr", name: "VR 全景", image: "./assets/showcase/vr-panorama.jpg", alt: "原木风 VR 全景预览" },
    ],
  },
};
const acceptedFloorExtensions = [".dxf", ".dwg"];
const requiredFloorLayerRules = [
  {
    key: "wall",
    label: "墙体图层",
    expected: "WALL-STRUCT / WALL-PARTITION",
    aliases: ["WALL", "WALL-STRUCT", "WALL-PARTITION", "WALL_STRUCT", "WALL_PARTITION", "A-WALL", "A_WALL", "WALLS", "墙", "墙体", "墙线", "建筑墙体"],
  },
  {
    key: "door",
    label: "门图层",
    expected: "DOOR",
    aliases: ["DOOR", "A-DOOR", "A_DOOR", "门", "门洞"],
  },
  {
    key: "window",
    label: "窗图层",
    expected: "WINDOW",
    aliases: ["WINDOW", "A-WINDOW", "A_WINDOW", "窗", "窗户"],
  },
  {
    key: "room_boundary",
    label: "房间边界",
    expected: "ROOM-BOUNDARY",
    aliases: ["ROOM-BOUNDARY", "ROOM_BOUNDARY", "A-ROOM-BOUNDARY", "房间边界", "空间边界"],
  },
  {
    key: "room_text",
    label: "房间名称",
    expected: "ROOM-TEXT",
    aliases: ["ROOM-TEXT", "ROOM_TEXT", "ROOM", "A-ROOM-IDEN", "房间", "房间名称", "空间名称"],
  },
];
const optionalFloorLayerRules = [
  { key: "column", label: "COLUMN", aliases: ["COLUMN", "A-COLS", "A_COLUMN", "柱", "柱子"] },
  { key: "beam", label: "BEAM", aliases: ["BEAM", "A-BEAM", "梁"] },
  { key: "fixture", label: "FIXTURE", aliases: ["FIXTURE", "固定设备"] },
  { key: "utility", label: "UTILITY", aliases: ["UTILITY", "设备点位"] },
  { key: "no_demo", label: "NO-DEMO", aliases: ["NO-DEMO", "NO_DEMO", "不可拆改"] },
  { key: "furniture_ref", label: "FURNITURE-REF", aliases: ["FURNITURE-REF", "FURNITURE_REF", "家具参考"] },
];
const dxfEntityTypes = new Set([
  "3DFACE",
  "ARC",
  "CIRCLE",
  "ELLIPSE",
  "HATCH",
  "INSERT",
  "LEADER",
  "LINE",
  "LWPOLYLINE",
  "MTEXT",
  "POINT",
  "POLYLINE",
  "SPLINE",
  "TEXT",
]);
const dxfLineworkTypes = new Set(["ARC", "CIRCLE", "ELLIPSE", "HATCH", "INSERT", "LINE", "LWPOLYLINE", "POLYLINE", "SPLINE"]);
const dxfTextTypes = new Set(["TEXT", "MTEXT"]);
const dxfPolylineTypes = new Set(["LWPOLYLINE", "POLYLINE"]);
const allFloorLayerRules = [...requiredFloorLayerRules, ...optionalFloorLayerRules];
const dxfMillimeterInsunits = "4";

let activeTab = "samples";
let activeSampleId = availableSamples[0].id;
let activeRoomId = availableSamples[0].rooms[0].id;
let floorValidationState = { status: "empty", title: "", messages: [] };
let floorValidationRunId = 0;
let selectedStyleId = "";
let isGeneratingPlan = false;
let generationTimer = null;

applyRole();
configureLocalPreview();
bindNavigation();
bindImportWorkflow();
renderSampleList();
renderScheme();
updateGenerateState();
setTab(activeTab);

function resolveAccountRole() {
  const queryRole = new URLSearchParams(window.location.search).get("role");
  const accountRole = window.XSPACE_ACCOUNT?.role;
  const storedRole = window.localStorage.getItem("xspace-account-role");
  return queryRole || accountRole || storedRole || APP_CONFIG.account.role || "client";
}

function applyRole() {
  body.dataset.role = canUseDesignerWorkspace ? "designer" : "client";
}

function configureLocalPreview() {
  const localHosts = ["localhost", "127.0.0.1", "::1", ""];
  document.querySelectorAll("[data-local-preview]").forEach((link) => {
    if (localHosts.includes(window.location.hostname)) {
      link.href = link.dataset.localPreview;
      link.target = "_blank";
      link.rel = "noreferrer";
    }
  });
}

function bindNavigation() {
  document.querySelectorAll("[data-go-tab]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      setTab(button.dataset.goTab);
    });
  });

  document.querySelectorAll("[data-open-scheme]").forEach((button) => {
    button.addEventListener("click", () => {
      setSchemePane("preview");
      setTab("scheme-detail");
    });
  });

  schemeTabButtons.forEach((button) => {
    button.addEventListener("click", () => setSchemePane(button.dataset.schemeTab));
  });
}

function bindImportWorkflow() {
  importStepInputs.forEach((input) => {
    const label = input.closest(".upload-zone")?.querySelector("[data-upload-label]");
    if (label) {
      label.dataset.defaultLabel = label.textContent.trim();
    }

    bindUploadDropZone(input);
    input.addEventListener("change", () => handleImportInputChange(input));
  });

  styleOptionButtons.forEach((button) => {
    button.addEventListener("click", () => selectStylePackage(button.dataset.styleOption));
  });

  generateButton?.addEventListener("click", handleGeneratePlan);
}

function selectStylePackage(styleId) {
  selectedStyleId = stylePackages[styleId] ? styleId : "";
  importState.style = Boolean(selectedStyleId);

  styleOptionButtons.forEach((button) => {
    const isSelected = button.dataset.styleOption === selectedStyleId;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });

  clearGenerationStatus();
  updateGenerateState();
}

function handleGeneratePlan() {
  if (!importState.floor || !importState.style || isGeneratingPlan) {
    return;
  }

  const stylePackage = stylePackages[selectedStyleId];
  if (!stylePackage) {
    return;
  }

  isGeneratingPlan = true;
  generateButton.textContent = "生成中";
  setGenerationStatus({
    status: "running",
    title: "正在生成方案",
    messages: ["整理素材", "生成效果图与全景", "写入方案库"],
  });
  updateGenerateState();

  window.clearTimeout(generationTimer);
  generationTimer = window.setTimeout(() => {
    const sample = buildGeneratedSample(stylePackage);
    availableSamples = [
      sample,
      ...availableSamples.filter((item) => item.id !== sample.id),
    ];
    activeSampleId = sample.id;
    activeRoomId = sample.rooms[0].id;
    isGeneratingPlan = false;
    generateButton.textContent = "生成空间方案";

    renderSampleList();
    renderScheme();
    setGenerationStatus({
      status: "complete",
      title: "已加入方案库",
      messages: [`${sample.name} · ${sample.title}`, "效果图、全景和交付入口已完成。"],
    });
    updateGenerateState();
    setTab("samples");
  }, 700);
}

function buildGeneratedSample(stylePackage) {
  const floorInput = importStepInputs.find((input) => input.dataset.importStep === "floor");
  const floorFileName = floorInput?.files?.[0]?.name || "新导入方案";
  const name = normalizeProjectName(floorFileName);
  const idea = designIdeaInput?.value.trim();
  const ideaSummary = idea ? `想法：${idea}` : "按所选风格生成。";

  return {
    id: `ai-${Date.now()}`,
    name,
    title: stylePackage.title,
    status: "初版 · 已生成",
    area: "待识别",
    style: stylePackage.label,
    delivery: "效果图 + 全景 + VR",
    summary: `${stylePackage.summary} ${ideaSummary}`,
    designerOnly: true,
    rooms: stylePackage.rooms,
  };
}

function normalizeProjectName(fileName) {
  const baseName = fileName.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim();
  return baseName || "新导入方案";
}

function setGenerationStatus({ status, title, messages }) {
  if (!generationStatusPanel) {
    return;
  }

  generationStatusPanel.replaceChildren();
  generationStatusPanel.className = `generation-status is-${status}`;

  const heading = document.createElement("strong");
  heading.textContent = title;
  generationStatusPanel.append(heading);

  const list = document.createElement("ul");
  messages.forEach((message) => {
    const item = document.createElement("li");
    item.textContent = message;
    list.append(item);
  });
  generationStatusPanel.append(list);
}

function clearGenerationStatus() {
  if (!generationStatusPanel || generationStatusPanel.classList.contains("is-running")) {
    return;
  }

  generationStatusPanel.replaceChildren();
  generationStatusPanel.className = "generation-status";
}

function handleImportInputChange(input, files = input.files) {
  const step = input.dataset.importStep;
  if (step === "floor") {
    validateFloorFile(input, files);
    return;
  }

  importState[step] = files.length > 0;
  updateUploadLabel(input, files);
  updateGenerateState();
}

function bindUploadDropZone(input) {
  const zone = input.closest(".upload-zone");
  if (!zone) {
    return;
  }

  ["dragenter", "dragover"].forEach((eventName) => {
    zone.addEventListener(eventName, (event) => {
      event.preventDefault();
      zone.classList.add("is-drag-over");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    zone.addEventListener(eventName, (event) => {
      event.preventDefault();
      if (eventName === "dragleave" && zone.contains(event.relatedTarget)) {
        return;
      }
      zone.classList.remove("is-drag-over");
    });
  });

  zone.addEventListener("drop", (event) => {
    const droppedFiles = event.dataTransfer?.files;
    if (!droppedFiles || droppedFiles.length === 0) {
      return;
    }

    const files = assignDroppedFiles(input, droppedFiles);
    handleImportInputChange(input, files);
  });
}

function assignDroppedFiles(input, droppedFiles) {
  const selectedFiles = [...droppedFiles].slice(0, input.multiple ? droppedFiles.length : 1);

  if (typeof DataTransfer === "undefined") {
    return selectedFiles;
  }

  const transfer = new DataTransfer();
  selectedFiles.forEach((file) => transfer.items.add(file));
  input.files = transfer.files;
  return input.files;
}

function updateUploadLabel(input, files = input.files) {
  const label = input.closest(".upload-zone")?.querySelector("[data-upload-label]");
  if (!label) {
    return;
  }

  if (files.length === 0) {
    label.textContent = label.dataset.defaultLabel;
    return;
  }

  label.textContent = files.length === 1 ? files[0].name : `已选择 ${files.length} 个文件`;
}

async function validateFloorFile(input, files = input.files) {
  const file = files[0];
  const extension = getFileExtension(file?.name ?? "");
  const runId = ++floorValidationRunId;

  updateUploadLabel(input, files);
  importState.floor = false;

  if (!file) {
    setFloorValidation({ status: "empty", title: "", messages: [] });
    updateGenerateState();
    return;
  }

  setFloorValidation({
    status: "checking",
    title: "正在检查户型文件",
    messages: [
      extension === ".dwg"
        ? "正在上传 DWG 到本地后端，转换为 DXF 后检查规范。"
        : "正在检查文件格式、DXF 结构和 CAD 图层规范。",
    ],
  });
  updateGenerateState();

  const formatErrors = validateFloorFileFormat(file);
  if (formatErrors.length > 0) {
    setFloorValidation({
      status: "invalid",
      title: "户型文件未通过检查",
      messages: formatErrors,
    });
    updateGenerateState();
    return;
  }

  if (shouldUseBackendFloorValidation(extension)) {
    try {
      const apiResult = await validateFloorFileWithApi(file);
      if (runId !== floorValidationRunId) {
        return;
      }

      const result = normalizeBackendFloorValidation(apiResult);
      importState.floor = result.status === "valid";
      setFloorValidation(result);
      updateGenerateState();
      return;
    } catch (error) {
      if (runId !== floorValidationRunId) {
        return;
      }

      if (extension === ".dwg") {
        setFloorValidation({
          status: "invalid",
          title: "DWG 无法完成转换校验",
          messages: [formatBackendValidationError(error)],
        });
        updateGenerateState();
        return;
      }
    }
  }

  let content = "";
  try {
    content = await file.text();
  } catch (error) {
    if (runId !== floorValidationRunId) {
      return;
    }

    setFloorValidation({
      status: "invalid",
      title: "户型文件未通过检查",
      messages: ["无法读取 DXF 文件内容，请确认文件未损坏后重新选择。"],
    });
    updateGenerateState();
    return;
  }

  if (runId !== floorValidationRunId) {
    return;
  }

  const report = inspectDxfContent(content);
  const result = buildFloorValidationResult(report);
  importState.floor = result.status === "valid";
  setFloorValidation(result);
  updateGenerateState();
}

function validateFloorFileFormat(file) {
  const extension = getFileExtension(file.name);
  const errors = [];

  if (file.size === 0) {
    errors.push("文件为空，请重新导出有效的户型文件。");
  }

  if (acceptedFloorExtensions.includes(extension)) {
    return errors;
  }

  errors.push("文件格式不符合要求，请上传 .dxf 或 .dwg 户型文件。");
  return errors;
}

function shouldUseBackendFloorValidation(extension) {
  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) {
    return false;
  }
  return extension === ".dwg" || APP_CONFIG.api?.useBackendFloorValidation === true;
}

async function validateFloorFileWithApi(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${getApiBaseUrl()}/api/v1/import/floor-plan/check`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return response.json();
}

function normalizeBackendFloorValidation(payload) {
  const messages = Array.isArray(payload.messages) ? payload.messages : [];
  return {
    status: payload.status === "valid" ? "valid" : "invalid",
    title: payload.title || (payload.status === "valid" ? "户型文件已通过基础检查" : "户型文件未通过检查"),
    messages,
  };
}

async function readApiError(response) {
  try {
    const payload = await response.json();
    if (typeof payload.detail === "string") {
      return payload.detail;
    }
  } catch (error) {
    return response.statusText || "后端校验失败。";
  }
  return response.statusText || "后端校验失败。";
}

function formatBackendValidationError(error) {
  const message = error instanceof Error ? error.message : "";
  if (/failed to fetch|load failed|networkerror/i.test(message)) {
    return "无法连接本地后端转换服务，请先启动 backend：uvicorn app.main:app --reload --port 8010。";
  }
  if (message) {
    return message;
  }
  return "无法连接本地后端转换服务，请先启动 backend：uvicorn app.main:app --reload --port 8010。";
}

function getApiBaseUrl() {
  return APP_CONFIG.api?.baseUrl?.replace(/\/$/, "") ?? "";
}

function inspectDxfContent(content) {
  const lines = content.split(/\r\n|\n|\r/);
  const entities = [];
  let currentEntity = null;
  let pendingHeaderVariable = null;
  let insunits = null;

  for (let index = 0; index < lines.length - 1; index += 2) {
    const code = lines[index].trim();
    const value = lines[index + 1].trim();

    if (code === "9") {
      pendingHeaderVariable = value;
      continue;
    }

    if (pendingHeaderVariable === "$INSUNITS" && code === "70") {
      insunits = value;
      pendingHeaderVariable = null;
    }

    if (code === "0") {
      if (currentEntity) {
        entities.push(currentEntity);
      }

      currentEntity = dxfEntityTypes.has(value)
        ? { type: value, layer: "0", paperSpace: false, closed: false, text: "" }
        : null;
      continue;
    }

    if (!currentEntity) {
      continue;
    }

    if (code === "8") {
      currentEntity.layer = value || "0";
    } else if (code === "67") {
      currentEntity.paperSpace = value === "1";
    } else if (code === "70" && dxfPolylineTypes.has(currentEntity.type)) {
      currentEntity.closed = (Number.parseInt(value, 10) & 1) === 1;
    } else if ((code === "1" || code === "3") && dxfTextTypes.has(currentEntity.type)) {
      currentEntity.text = `${currentEntity.text} ${value}`.trim();
    }
  }

  if (currentEntity) {
    entities.push(currentEntity);
  }

  const modelspaceEntities = entities.filter((entity) => !entity.paperSpace);
  const roleStats = buildRoleStats(modelspaceEntities);

  return {
    hasSection: hasDxfToken(lines, "SECTION"),
    hasEntitiesSection: hasDxfToken(lines, "ENTITIES"),
    hasEof: hasDxfToken(lines, "EOF"),
    insunits,
    entities,
    modelspaceEntities,
    roleStats,
  };
}

function buildRoleStats(entities) {
  const stats = Object.fromEntries(
    allFloorLayerRules.map((rule) => [
      rule.key,
      {
        entityCount: 0,
        lineworkCount: 0,
        textCount: 0,
        closedPolylineCount: 0,
        layers: new Set(),
      },
    ])
  );

  entities.forEach((entity) => {
    const role = classifyDxfLayer(entity.layer);
    if (!role || !stats[role]) {
      return;
    }

    stats[role].entityCount += 1;
    stats[role].layers.add(entity.layer);
    if (dxfLineworkTypes.has(entity.type)) {
      stats[role].lineworkCount += 1;
    }
    if (dxfTextTypes.has(entity.type) && entity.text) {
      stats[role].textCount += 1;
    }
    if (dxfPolylineTypes.has(entity.type) && entity.closed) {
      stats[role].closedPolylineCount += 1;
    }
  });

  return stats;
}

function buildFloorValidationResult(report) {
  const errors = [];
  const warnings = [];

  if (!report.hasSection || !report.hasEntitiesSection || !report.hasEof) {
    errors.push("DXF 基本结构不完整，需要包含 SECTION、ENTITIES 和 EOF。");
  }

  if (report.modelspaceEntities.length === 0) {
    errors.push("模型空间没有可用实体，请确认图纸不是只放在布局空间。");
  }

  requiredFloorLayerRules.forEach((rule) => {
    const stats = report.roleStats[rule.key];
    if (!stats || stats.entityCount === 0) {
      errors.push(`缺少${rule.label}：需要 ${rule.expected}。`);
      return;
    }

    if (rule.key === "room_boundary" && stats.closedPolylineCount === 0) {
      errors.push("ROOM-BOUNDARY 需要至少包含一个闭合多段线房间边界。");
    }

    if (rule.key === "room_text" && stats.textCount === 0) {
      errors.push("ROOM-TEXT 需要包含可读取的 TEXT 或 MTEXT 房间名称。");
    }

    if (!["room_text", "room_boundary"].includes(rule.key) && stats.lineworkCount === 0) {
      errors.push(`${rule.label}存在，但没有可读取的线、块或多段线实体。`);
    }
  });

  if (report.insunits && report.insunits !== dxfMillimeterInsunits) {
    warnings.push("DXF 的 INSUNITS 不是毫米，请确认图纸按 mm、1:1 绘制。");
  } else if (!report.insunits) {
    warnings.push("未读取到 DXF 单位声明，请人工确认图纸单位为 mm 且 1:1 绘制。");
  }

  const zeroLayerEntityCount = report.modelspaceEntities.filter((entity) => normalizeDxfLayer(entity.layer) === "0").length;
  if (zeroLayerEntityCount > report.modelspaceEntities.length * 0.45) {
    warnings.push("0 图层实体占比较高，核心墙体、门窗和房间信息不要混在 0 图层。");
  }

  const missingOptionalLayers = optionalFloorLayerRules
    .filter((rule) => report.roleStats[rule.key]?.entityCount === 0)
    .map((rule) => rule.label);
  if (missingOptionalLayers.length > 0) {
    warnings.push(`未发现可选图层：${missingOptionalLayers.join("、")}；如项目包含对应内容，建议单独分层。`);
  }

  if (errors.length > 0) {
    return {
      status: "invalid",
      title: "户型文件未通过检查",
      messages: errors,
    };
  }

  return {
    status: "valid",
    title: "户型文件已通过基础检查",
    messages: [
      `已识别 ${report.modelspaceEntities.length} 个模型空间实体，必需图层齐全。`,
      ...warnings,
    ],
  };
}

function setFloorValidation(result) {
  floorValidationState = result;
  renderFloorValidation();
}

function renderFloorValidation() {
  if (!floorValidationPanel) {
    return;
  }

  floorValidationPanel.replaceChildren();
  floorValidationPanel.className = "file-validation";
  if (floorValidationState.status === "empty") {
    return;
  }

  floorValidationPanel.classList.add(`is-${floorValidationState.status}`);

  const title = document.createElement("strong");
  title.textContent = floorValidationState.title;
  floorValidationPanel.append(title);

  if (floorValidationState.messages.length === 0) {
    return;
  }

  const list = document.createElement("ul");
  floorValidationState.messages.forEach((message) => {
    const item = document.createElement("li");
    item.textContent = message;
    list.append(item);
  });

  floorValidationPanel.append(list);
}

function getFileExtension(fileName) {
  const dotIndex = fileName.lastIndexOf(".");
  return dotIndex >= 0 ? fileName.slice(dotIndex).toLowerCase() : "";
}

function hasDxfToken(lines, token) {
  return lines.some((line) => line.trim().toUpperCase() === token);
}

function classifyDxfLayer(layer) {
  const normalizedLayer = normalizeDxfLayer(layer);
  const rule = allFloorLayerRules.find((item) =>
    item.aliases.some((alias) => normalizeDxfLayer(alias) === normalizedLayer)
  );
  return rule?.key ?? null;
}

function normalizeDxfLayer(layer) {
  return String(layer || "")
    .replace(/\s+/g, "")
    .replace(/_/g, "-")
    .toUpperCase();
}

function updateGenerateState() {
  const completedCount = importSteps.filter((step) => importState[step]).length;
  const isReady = completedCount === importSteps.length;

  document.querySelectorAll("[data-step-card]").forEach((card) => {
    const isFloorCard = card.dataset.stepCard === "floor";
    card.classList.toggle("is-complete", Boolean(importState[card.dataset.stepCard]));
    card.classList.toggle("is-checking", isFloorCard && floorValidationState.status === "checking");
    card.classList.toggle("is-invalid", isFloorCard && floorValidationState.status === "invalid");
  });

  if (generateButton) {
    const isDisabled = !isReady || isGeneratingPlan;
    generateButton.disabled = isDisabled;
    generateButton.setAttribute("aria-disabled", String(isDisabled));
  }
}

function setTab(tab) {
  if (!canUseDesignerWorkspace && isDesignerTab(tab)) {
    return;
  }

  activeTab = tab;

  panels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.panel === tab);
  });

  navButtons.forEach((button) => {
    const isActive = button.dataset.goTab === tab || (tab === "scheme-detail" && button.dataset.goTab === "samples");
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-current", isActive ? "page" : "false");
  });

  window.scrollTo({ top: 0, left: 0 });
}

function setSchemePane(pane) {
  schemeTabButtons.forEach((button) => {
    const isActive = button.dataset.schemeTab === pane;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  schemePanes.forEach((item) => {
    item.classList.toggle("is-active", item.dataset.schemePane === pane);
  });
}

function isDesignerTab(tab) {
  const panel = panels.find((item) => item.dataset.panel === tab);
  return Boolean(panel?.hasAttribute("data-designer-panel"));
}

function renderSampleList() {
  const cards = [];

  if (canUseDesignerWorkspace) {
    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "project-card add-project-card";
    addButton.innerHTML = `
      <span class="project-thumb add-project-thumb">
        <img src="./assets/showcase/new-plan-cover.jpg" alt="新建方案图纸与材质工作台" loading="lazy" />
      </span>
      <span class="project-body new-plan-body">
        <span class="project-eyebrow">开始</span>
        <span class="project-title-line">
          <strong>新建方案</strong>
          <small>导入图纸</small>
        </span>
        <span class="project-meta" aria-label="创建流程">
          <span>DXF / DWG</span>
          <span>选择风格</span>
        </span>
      </span>
    `;
    addButton.addEventListener("click", () => setTab("platform"));
    cards.push(addButton);
  }

  cards.push(
    ...availableSamples.map((sample) => {
      const room = sample.rooms[0];
      const button = document.createElement("button");
      button.type = "button";
      button.className = sample.id === activeSampleId ? "project-card is-active" : "project-card";
      button.innerHTML = `
        <span class="project-thumb">
          <img src="${room.image}" alt="${room.alt}" loading="lazy" />
          <span class="status-pill">${sample.status}</span>
        </span>
        <span class="project-body">
          <span class="project-eyebrow">${sample.delivery}</span>
          <span class="project-title-line">
            <strong>${sample.name}</strong>
            <small>${sample.title}</small>
          </span>
          <span class="project-meta" aria-label="方案参数">
            <span>${sample.area}</span>
            <span>${sample.style}</span>
            <span>${sample.rooms.length} 空间</span>
          </span>
        </span>
      `;
      button.addEventListener("click", () => {
        activeSampleId = sample.id;
        activeRoomId = sample.rooms[0].id;
        renderSampleList();
        renderScheme();
        setSchemePane("preview");
        setTab("scheme-detail");
      });
      return button;
    })
  );

  sampleList.replaceChildren(
    ...cards
  );
}

function renderScheme() {
  const sample = availableSamples.find((item) => item.id === activeSampleId) ?? availableSamples[0];
  const room = sample.rooms.find((item) => item.id === activeRoomId) ?? sample.rooms[0];

  detailStatus.textContent = sample.status;
  detailTitle.textContent = `${sample.name} · ${sample.title}`;
  detailImage.src = room.image;
  detailImage.alt = room.alt;
  detailRoomName.textContent = room.name;
  detailSummary.textContent = sample.summary;
  detailArea.textContent = sample.area;
  detailStyle.textContent = sample.style;
  detailDelivery.textContent = sample.delivery;

  detailRoomTabs.replaceChildren(
    ...sample.rooms.map((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = item.id === room.id ? "is-active" : "";
      button.textContent = item.name;
      button.addEventListener("click", () => {
        activeRoomId = item.id;
        renderScheme();
      });
      return button;
    })
  );
}
