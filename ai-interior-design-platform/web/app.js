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
availableSamples = availableSamples.map(normalizeSampleState);

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
const adjustImage = document.querySelector("#adjustImage");
const adjustSceneTabs = document.querySelector("#adjustSceneTabs");
const adjustScope = document.querySelector("[data-adjust-scope]");
const adjustActionsPanel = document.querySelector("[data-adjust-actions]");
const styleLockButton = document.querySelector("[data-style-lock]");
const renderStatusPanel = document.querySelector("[data-render-status]");
const renderFinalButton = document.querySelector("[data-render-final]");
const clearAdjustmentsButton = document.querySelector("[data-clear-adjustments]");
const deliveryContent = document.querySelector("[data-delivery-content]");
const versionList = document.querySelector("[data-version-list]");
const navButtons = [...document.querySelectorAll("[data-go-tab]")];
const schemeTabButtons = [...document.querySelectorAll("[data-scheme-tab]")];
const schemePanes = [...document.querySelectorAll("[data-scheme-pane]")];
const importStepInputs = [...document.querySelectorAll("[data-import-step]")];
const styleOptionButtons = [...document.querySelectorAll("[data-style-option]")];
const designIdeaInput = document.querySelector("[data-design-idea]");
const generateButton = document.querySelector("[data-generate-plan]");
const generationStatusPanel = document.querySelector("[data-generation-status]");
const floorValidationPanel = document.querySelector("[data-floor-validation]");
const floorPreviewPanel = document.querySelector("[data-floor-preview]");
const effectBriefInput = document.querySelector("[data-effect-brief-upload]");
const effectBriefLabel = document.querySelector("[data-effect-brief-label]");
const effectBriefSummary = document.querySelector("[data-effect-brief-summary]");
const effectBriefViewAction = document.querySelector("[data-effect-brief-view-action]");
const effectBriefViewer = document.querySelector("[data-effect-brief-viewer]");
const effectBriefTitle = document.querySelector("[data-effect-brief-title]");
const effectBriefMeta = document.querySelector("[data-effect-brief-meta]");
const effectBriefContent = document.querySelector("[data-effect-brief-content]");
const effectBriefEditor = document.querySelector("[data-effect-brief-editor]");
const effectBriefEditButton = document.querySelector("[data-effect-brief-edit]");
const effectBriefReuploadButton = document.querySelector("[data-effect-brief-reupload]");
const effectBriefCloseButton = document.querySelector("[data-effect-brief-close]");
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
const effectBriefStyleAliases = {
  vintage: ["中古风", "中古", "复古", "mid-century", "mid century", "vintage"],
  cream: ["奶油风", "奶油", "cream"],
  modern: ["现代简约", "现代", "简约", "modern", "minimal"],
  wood: ["原木风", "原木", "日式原木", "wood"],
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
const acceptedEffectBriefExtensions = [".txt", ".md", ".markdown", ".docx"];
const dxfMillimeterInsunits = "4";
const floorPreviewWidth = 1600;
const floorPreviewHeight = 1000;
const floorPreviewPadding = 34;
const svgNamespace = "http://www.w3.org/2000/svg";
const floorPlanGeometryRoles = new Set(["wall", "room_boundary", "door", "window", "column", "beam"]);

let activeTab = "samples";
let activeSampleId = availableSamples[0].id;
let activeRoomId = availableSamples[0].rooms[0].id;
let activeAdjustSceneId = "";
let floorValidationState = { status: "empty", title: "", messages: [] };
let floorValidationRunId = 0;
let selectedFloorFile = null;
let selectedStyleId = "";
let effectBriefDocument = null;
let isEditingEffectBrief = false;
let isGeneratingPlan = false;
let isRenderingFinal = false;
let currentRenderJobId = "";
let isStoppingRender = false;
let generationStatusProgressTimer = null;
let renderStatusProgressTimer = null;
const generateButtonDefaultText = generateButton?.textContent.trim() || "生成空间方案";
const adjustmentLabels = {
  storage: "收纳加强",
  "warmer-light": "灯光更暖",
  brighter: "整体更亮",
  simpler: "更简洁",
  "layout-flow": "动线优化",
  "sofa-layout": "沙发布局",
  "tv-wall": "电视墙",
  dining: "餐桌椅",
  "bed-wall": "床头背景",
  wardrobe: "衣柜收纳",
  bedside: "床头灯",
  "countertop-flow": "台面动线",
  "cabinet-storage": "橱柜收纳",
  appliances: "电器位置",
  "dry-wet": "干湿分区",
  vanity: "浴室柜",
  shower: "淋浴区",
  "balcony-use": "阳台功能",
  privacy: "隐私遮挡",
};
const adjustmentPromptDeltas = {
  storage: "增加当前空间的封闭收纳和展示收纳，但不改变墙体、门窗和主要动线。",
  "warmer-light": "将当前空间灯光调整为更暖的色温，并增加柔和辅助光。",
  brighter: "提升当前空间整体亮度，墙面和顶面保持更干净明亮。",
  simpler: "减少非必要装饰和模型数量，让空间更简洁。",
  "layout-flow": "优化全屋动线，保留通行宽度，避免家具阻挡门窗和主要通道。",
  "sofa-layout": "优化沙发和茶几位置，让客餐厅核心视角更完整。",
  "tv-wall": "强化电视墙或背景墙设计，保持当前风格一致。",
  dining: "优化餐桌椅和餐边收纳关系，保留就餐和通行尺度。",
  "bed-wall": "强化床头背景墙和卧室主视觉。",
  wardrobe: "增强卧室衣柜和储物能力。",
  bedside: "增加床头灯和柔和卧室氛围光。",
  "countertop-flow": "优化厨房台面操作动线和连续操作面。",
  "cabinet-storage": "增强厨房上下柜收纳。",
  appliances: "优化厨房电器、灶台和水槽的布局关系。",
  "dry-wet": "强化卫生间干湿分区表达。",
  vanity: "优化浴室柜和镜柜收纳。",
  shower: "强化淋浴区表达。",
  "balcony-use": "明确阳台功能，避免仅作为空白空间。",
  privacy: "增加当前空间的隐私遮挡和柔和隔断感。",
};

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

function normalizeSampleState(sample) {
  if (sample.versions) {
    return sample;
  }

  const version = {
    id: `final-${sample.id}-v1`,
    number: 1,
    title: `${sample.style}终版 V1`,
    status: "终版 V1",
    createdAt: "已有方案",
    summary: sample.summary,
    adjustments: [],
    scenes: sample.rooms.map((room) => ({
      ...room,
      shot_type: room.id === "vr" ? "panorama" : "interior",
    })),
  };

  return {
    ...sample,
    phase: "final",
    status: sample.status || "终版 V1",
    delivery: sample.delivery || "3D效果图 + VR",
    initialScenes: sample.rooms,
    plannedScenes: sample.rooms,
    versions: [version],
    activeVersionId: version.id,
    adjustments: [],
  };
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

  if (effectBriefLabel) {
    effectBriefLabel.dataset.defaultLabel = effectBriefLabel.textContent.trim();
  }
  effectBriefInput?.addEventListener("change", () => handleEffectBriefUpload(effectBriefInput.files));
  effectBriefViewAction?.addEventListener("click", openEffectBriefViewer);
  effectBriefEditButton?.addEventListener("click", toggleEffectBriefEditing);
  effectBriefReuploadButton?.addEventListener("click", () => effectBriefInput?.click());
  effectBriefCloseButton?.addEventListener("click", closeEffectBriefViewer);
  effectBriefViewer?.addEventListener("click", (event) => {
    if (event.target === effectBriefViewer) {
      closeEffectBriefViewer();
    }
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !effectBriefViewer?.hidden) {
      closeEffectBriefViewer();
    }
  });

  generateButton?.addEventListener("click", handleGeneratePlan);
  renderFinalButton?.addEventListener("click", handleRenderFinalVersion);
  clearAdjustmentsButton?.addEventListener("click", clearCurrentAdjustments);
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

async function handleGeneratePlan() {
  if (!importState.floor || !importState.style || isGeneratingPlan) {
    return;
  }
  const effectBriefParseErrors = getEffectBriefParseErrors();
  if (effectBriefParseErrors.length > 0) {
    setGenerationStatus({
      status: "error",
      title: "效果说明解析失败",
      messages: effectBriefParseErrors,
    });
    updateGenerateState();
    return;
  }

  const stylePackage = stylePackages[selectedStyleId];
  const floorFile = selectedFloorFile || importStepInputs.find((input) => input.dataset.importStep === "floor")?.files?.[0];
  if (!stylePackage || !floorFile) {
    setGenerationStatus({
      status: "error",
      title: "方案生成失败",
      messages: ["请先上传并通过校验一份 DXF / DWG 户型图，再选择风格生成方案。"],
    });
    return;
  }

  isGeneratingPlan = true;
  generateButton.textContent = "生成中";
  setGenerationStatus({
    status: "running",
    title: "正在生成初版方案",
    messages: ["解析户型图", `套用${stylePackage.label}风格规则`, "生成材质、模型意图、灯光和镜头任务"],
  });
  updateGenerateState();

  try {
    const draft = await createProjectDraftFromBackend(floorFile, selectedStyleId, stylePackage);
    validateDraftAgainstEffectBrief(draft);
    const generatedStylePackage = stylePackages[draft?.design_plan?.style] || stylePackage;
    const sample = buildGeneratedSampleFromDraft(draft, generatedStylePackage, floorFile);
    availableSamples = [
      sample,
      ...availableSamples.filter((item) => item.id !== sample.id),
    ];
    activeSampleId = sample.id;
    activeRoomId = sample.rooms[0].id;
    activeAdjustSceneId = sample.plannedScenes[0]?.id || "";

    renderSampleList();
    renderScheme();
    setGenerationStatus({
      status: "complete",
      title: "已生成初版方案",
      messages: [`${sample.name} · ${sample.title}`, "已写入户型图、设计计划和渲染规格。"],
    });
    setSchemePane("preview");
    setTab("scheme-detail");
  } catch (error) {
    setGenerationStatus({
      status: "error",
      title: "方案生成失败",
      messages: [formatGenerationError(error)],
    });
  } finally {
    isGeneratingPlan = false;
    generateButton.textContent = generateButtonDefaultText;
    updateGenerateState();
  }
}

async function createProjectDraftFromBackend(file, styleId, stylePackage) {
  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) {
    throw new Error("未配置本地后端地址，无法生成初版方案。");
  }

  const formData = new FormData();
  const effectiveStyleId = effectBriefDocument?.parsed?.styleId || styleId;
  const effectiveStylePackage = stylePackages[effectiveStyleId] || stylePackage;
  formData.append("file", file);
  formData.append("style", effectiveStyleId);
  formData.append("brief_text", buildDesignBriefText(file, effectiveStylePackage));

  const response = await fetch(`${apiBaseUrl}/api/v1/projects/from-dxf`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return response.json();
}

async function renderFinalVersionWithBackend(sample, onProgress = () => {}) {
  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) {
    throw new Error("未配置本地后端地址，无法生成 3D 效果图。");
  }
  const renderSpec = getBaseRenderSpecForFinalGeneration(sample);
  if (!renderSpec) {
    throw new Error("当前方案没有可渲染的 RenderSpec，请重新从图纸生成初版方案。");
  }

  const response = await fetch(`${apiBaseUrl}/api/v1/render/preview/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      render_spec: renderSpec,
      adjustments: sample.adjustments || [],
      samples: 32,
      shot_ids: [],
    }),
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  const job = await response.json();
  currentRenderJobId = job.job_id || "";
  return pollRenderJob(apiBaseUrl, job.job_id, onProgress);
}

function getBaseRenderSpecForFinalGeneration(sample) {
  const activeVersion = getActiveVersion(sample);
  return activeVersion?.renderSpec || sample?.draft?.render_spec || null;
}

async function pollRenderJob(apiBaseUrl, jobId, onProgress) {
  if (!jobId) {
    throw new Error("后端没有返回渲染任务编号。");
  }

  while (true) {
    await wait(1000);
    const response = await fetch(`${apiBaseUrl}/api/v1/render/preview/jobs/${encodeURIComponent(jobId)}`);
    if (!response.ok) {
      throw new Error(await readApiError(response));
    }

    const job = await response.json();
    onProgress(job);

    if (job.status === "complete") {
      return {
        status: "complete",
        version_id: job.version_id,
        scenes: job.scenes || [],
        render_spec: job.render_spec,
        messages: job.messages || [],
      };
    }

    if (job.status === "error") {
      throw new Error(job.error || job.messages?.[0] || "3D 渲染失败。");
    }

    if (job.status === "cancelled") {
      const error = new Error("已停止当前 3D 效果图生成。");
      error.name = "RenderCancelledError";
      throw error;
    }
  }
}

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function buildDesignBriefText(file, stylePackage) {
  const projectName = normalizeProjectName(file.name);
  const idea = designIdeaInput?.value.trim();
  const effectBriefText = effectBriefDocument?.content?.trim();
  const ideaDuplicatesBrief = effectBriefText && normalizeEffectBriefText(idea) === normalizeEffectBriefText(effectBriefText);
  const wholeHomeBrief = ideaDuplicatesBrief
    ? "以效果说明文档为主生成初版方案。"
    : idea || "根据户型自动生成初版动线、材质、家具、灯光和镜头策略。";

  return [
    `项目名称：${projectName}`,
    effectBriefText ? "效果说明文档：" : "",
    effectBriefText || "",
    `设计风格：${stylePackage.label}`,
    "重点空间：",
    `1. 整体：${wholeHomeBrief}`,
    "效果图要求：",
    "1. 生成 2D 户型图、关键空间镜头、材质策略和渲染规格。",
  ].filter((line) => line !== "").join("\n");
}

function buildGeneratedSampleFromDraft(draft, stylePackage, file) {
  const name = normalizeProjectName(file.name);
  const stats = buildDraftStats(draft);
  const idea = designIdeaInput?.value.trim();
  const styleLabel = stylePackage.label || draft?.design_plan?.style_label || "已选风格";
  const rooms = buildDraftRooms(draft, styleLabel, name, file.name, stats);
  const plannedScenes = buildPlannedScenes(draft, styleLabel, name);
  const floorPlanScene = rooms[0];

  return {
    id: `ai-${slugifyProjectId(name)}-${draft?.design_plan?.style || selectedStyleId || "style"}`,
    name,
    title: `${styleLabel}初版`,
    phase: "initial",
    status: "初版 · 待生成3D",
    area: formatDraftArea(draft),
    style: styleLabel,
    delivery: "初版预览",
    summary: buildDraftSummary(file.name, styleLabel, stats, idea),
    designerOnly: true,
    rooms: [floorPlanScene],
    initialScenes: [floorPlanScene],
    plannedScenes,
    adjustments: [],
    versions: [],
    activeVersionId: "",
    draft,
  };
}

function normalizeProjectName(fileName) {
  const baseName = fileName.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").replace(/[<>"'&]/g, "").trim();
  return baseName || "新导入方案";
}

function slugifyProjectId(value) {
  const normalized = String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  return normalized || "new-plan";
}

function buildDraftStats(draft) {
  const floorPlan = draft?.floor_plan || {};
  const designPlan = draft?.design_plan || {};
  const renderSpec = draft?.render_spec || {};
  const metadata = renderSpec.metadata || {};

  return {
    wallCount: Number(metadata.wall_count ?? floorPlan.walls?.length ?? 0),
    openingCount: Number(metadata.opening_count ?? ((floorPlan.doors?.length ?? 0) + (floorPlan.windows?.length ?? 0))),
    roomCount: Number(metadata.room_boundary_count ?? floorPlan.room_boundaries?.length ?? 0),
    materialCount: Object.keys(designPlan.materials || {}).length,
    materialStrategyCount: (designPlan.material_strategy || metadata.material_strategy || []).length,
    assetCount: (designPlan.asset_intents || metadata.asset_intents || []).length,
    hardFinishCount: (designPlan.hard_finish_intents || metadata.hard_finish_intents || []).length,
    lightingCount: (designPlan.lighting_intents || metadata.lighting_intents || []).length,
    cameraCount: (designPlan.camera_shots || renderSpec.camera_shots || []).length,
  };
}

function formatDraftArea(draftOrFloorPlan) {
  const briefArea = formatBriefArea(draftOrFloorPlan?.design_brief?.area);
  if (briefArea) {
    return briefArea;
  }

  const floorPlan = draftOrFloorPlan?.floor_plan || draftOrFloorPlan;
  const roomArea = (floorPlan?.room_boundaries || []).reduce((sum, room) => {
    const area = Number(room.area);
    return Number.isFinite(area) && area > 0 ? sum + area : sum;
  }, 0);

  if (roomArea > 0) {
    return `${formatSquareMeters(roomArea / 1_000_000)} m²`;
  }

  return "待识别";
}

function formatBriefArea(area) {
  const text = String(area || "").trim();
  if (!text) {
    return "";
  }

  const match = text.match(/(\d+(?:\.\d+)?)/);
  if (!match) {
    return text;
  }

  const value = Number(match[1]);
  return Number.isFinite(value) && value > 0 ? `${formatSquareMeters(value)} m²` : text;
}

function formatSquareMeters(value) {
  return new Intl.NumberFormat("zh-CN", {
    maximumFractionDigits: value >= 100 ? 0 : 1,
  }).format(value);
}

function buildDraftSummary(fileName, styleLabel, stats, idea) {
  const ideaText = idea ? `设计想法：${idea}` : "按所选风格自动生成。";
  return `已基于 ${fileName} 和 ${styleLabel} 生成初版方案：识别 ${stats.roomCount} 个空间、${stats.wallCount} 段墙体、${stats.openingCount} 个门窗，输出 ${stats.materialCount} 类材质、${stats.assetCount} 个模型意图、${stats.cameraCount} 个镜头任务。${ideaText}`;
}

function buildDraftRooms(draft, styleLabel, projectName, fileName, stats) {
  const floorPlanImage = createFloorPlanImage(draft?.floor_plan, fileName);
  const designPlan = draft?.design_plan || {};
  const palette = normalizePalette(designPlan);

  return [
    {
      id: "floor-plan",
      name: "2D 户型图",
      image: floorPlanImage,
      alt: `${projectName} 2D 户型图`,
      adjustable: false,
      fit: "contain",
    },
    ...buildPlannedScenes(draft, styleLabel, projectName, stats, palette),
  ];
}

function buildPlannedScenes(draft, styleLabel, projectName, stats = buildDraftStats(draft), palette = normalizePalette(draft?.design_plan || {})) {
  const floorPlan = draft?.floor_plan || {};
  const roomScenes = (floorPlan.room_boundaries || []).map((room, index) => {
    const roomName = room.name || `区域${index + 1}`;
    return {
      id: `adjust-${room.id || index}`,
      name: `${roomName}调整`,
      sceneType: "room",
      roomName,
      target_room_id: room.id,
      image: createAdjustmentSceneImage({
        title: `${roomName}调整`,
        subtitle: `${projectName} · ${styleLabel}`,
        lines: [
          "状态：待调整对象，未生成效果图",
          `风格锁定：${styleLabel}`,
          `绑定区域：${roomName}`,
          `面积：${formatSquareMeters((Number(room.area) || 0) / 1_000_000)} m²`,
        ],
      }),
      alt: `${projectName} ${roomName} 调整对象`,
      fit: "contain",
    };
  });

  return [
    {
      id: "adjust-whole-home",
      name: "全屋调整",
      sceneType: "whole",
      roomName: "全屋",
      image: createAdjustmentSceneImage({
        title: "全屋调整",
        subtitle: `${projectName} · ${styleLabel}`,
        lines: [
          "状态：待调整对象，未生成效果图",
          `风格锁定：${styleLabel}`,
          `户型拆解：${stats.roomCount} 个区域`,
          `基础数据：${stats.wallCount} 段墙体 / ${stats.openingCount} 个门窗`,
        ],
      }),
      alt: `${projectName} 全屋调整对象`,
      fit: "contain",
    },
    ...roomScenes,
  ];
}

function normalizePalette(designPlan) {
  const materialColors = Object.values(designPlan.materials || {})
    .map((material) => material.color)
    .filter(isValidHexColor);
  return materialColors.length > 0 ? materialColors : ["#5e9a87", "#f1ece2", "#a16f43", "#7b8068"];
}

function translateShotLabel(label) {
  const normalized = String(label || "").toLowerCase();
  if (normalized.includes("living")) {
    return "客餐厅";
  }
  if (normalized.includes("master") || normalized.includes("bedroom")) {
    return "主卧";
  }
  if (normalized.includes("kitchen")) {
    return "厨房";
  }
  if (normalized.includes("bird")) {
    return "全屋鸟瞰";
  }
  return String(label || "场景").replace(/_/g, " ");
}

function addSceneAdjustment(action) {
  const sample = getActiveSample();
  if (!sample || !adjustmentLabels[action]) {
    return;
  }

  const scene = getActiveAdjustScene(sample);
  const adjustments = sample.adjustments || [];
  const existing = adjustments.find((item) => item.sceneId === scene?.id && item.action === action);
  if (existing) {
    sample.adjustments = adjustments.filter((item) => item.id !== existing.id);
    renderScheme();
    return;
  }

  const adjustment = {
    id: `adj-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    action,
    label: adjustmentLabels[action],
    sceneId: scene?.id || "",
    sceneName: scene?.name || "当前场景",
    targetRoomId: scene?.target_room_id || "",
    promptDelta: adjustmentPromptDeltas[action] || "",
    style: sample.style,
    createdAt: new Date().toLocaleString("zh-CN", { hour12: false }),
  };

  sample.adjustments = [...adjustments, adjustment];
  renderScheme();
}

function clearCurrentAdjustments() {
  const sample = getActiveSample();
  if (!sample) {
    return;
  }

  sample.adjustments = [];
  clearRenderStatus();
  renderScheme();
}

async function handleRenderFinalVersion() {
  const sample = getActiveSample();
  if (isRenderingFinal) {
    await confirmAndStopRender();
    return;
  }
  if (!sample) {
    return;
  }

  isRenderingFinal = true;
  isStoppingRender = false;
  currentRenderJobId = "";
  setRenderStatus({
    status: "running",
    title: "正在生成3D效果图",
    messages: ["读取当前户型和风格规则", "应用本次调整", "调用 Blender 生成终版场景图和 VR 全景"],
  });
  renderScheme();

  try {
    const result = await renderFinalVersionWithBackend(sample, setRenderJobProgressStatus);
    const version = buildFinalVersion(sample, result);
    sample.phase = "final";
    if (result.render_spec) {
      sample.draft = {
        ...(sample.draft || {}),
        render_spec: result.render_spec,
      };
    }
    sample.versions = [...(sample.versions || []), version];
    sample.activeVersionId = version.id;
    sample.status = `${version.title} · 已生成`;
    sample.delivery = "3D效果图 + VR";
    sample.rooms = version.scenes;
    sample.adjustments = [];
    activeRoomId = version.scenes[0]?.id || activeRoomId;

    setRenderStatus({
      status: "complete",
      title: "终版已生成",
      messages: [`${version.title} 已记录到版本。`, "现在可以查看交付、VR 全景和版本切换。"],
    });
    renderSampleList();
    renderScheme();
    setSchemePane("preview");
  } catch (error) {
    if (error?.name === "RenderCancelledError") {
      setRenderStatus({
        status: "error",
        title: "已停止生成",
        messages: [error.message],
      });
      renderScheme();
      return;
    }
    setRenderStatus({
      status: "error",
      title: "3D生成失败",
      messages: [formatGenerationError(error)],
    });
    renderScheme();
  } finally {
    isRenderingFinal = false;
    isStoppingRender = false;
    currentRenderJobId = "";
    renderScheme();
  }
}

async function confirmAndStopRender() {
  if (!currentRenderJobId || isStoppingRender) {
    return;
  }

  const shouldStop = window.confirm("确定停止当前 3D 效果图生成吗？已完成但尚未写入终版的渲染结果不会保存。");
  if (!shouldStop) {
    return;
  }

  isStoppingRender = true;
  renderScheme();
  setRenderStatus({
    status: "running",
    title: "正在停止生成",
    messages: ["正在通知后端终止 Blender 渲染任务"],
  });

  try {
    const apiBaseUrl = getApiBaseUrl();
    const response = await fetch(`${apiBaseUrl}/api/v1/render/preview/jobs/${encodeURIComponent(currentRenderJobId)}/cancel`, {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error(await readApiError(response));
    }
  } catch (error) {
    isStoppingRender = false;
    setRenderStatus({
      status: "error",
      title: "停止失败",
      messages: [formatGenerationError(error)],
    });
    renderScheme();
  }
}

function setRenderJobProgressStatus(job) {
  if (!job || !["queued", "running"].includes(job.status)) {
    return;
  }

  const percent = Math.max(0, Math.min(Math.round((Number(job.progress) || 0) * 100), 99));
  const scene = formatRenderJobScene(job);
  const step = job.current_step || "正在处理渲染任务";
  setRenderStatus({
    status: "running",
    title: `正在生成3D效果图 · ${percent}%`,
    messages: [`${scene}${scene ? " · " : ""}${step}`],
  });
}

function formatRenderJobScene(job) {
  const total = Number(job.total_shots) || 0;
  const index = Number(job.current_shot_index) || 0;
  if (!total || !index) {
    return "";
  }

  const label = job.current_shot_label ? translateShotLabel(job.current_shot_label) : "当前场景";
  return `第 ${index}/${total} 个场景：${label}`;
}

function buildFinalVersion(sample, result) {
  const versionNumber = (sample.versions || []).length + 1;
  const scenes = (result.scenes || []).map((scene) => ({
    id: scene.id,
    name: scene.shot_type === "panorama" ? `${scene.label} VR` : formatFinalSceneName(scene),
    image: scene.image,
    alt: `${sample.name} ${scene.label} ${sample.style}终版`,
    shot_type: scene.shot_type,
  }));

  return {
    id: result.version_id || `final-${Date.now()}`,
    number: versionNumber,
    title: `终版 V${versionNumber}`,
    status: `终版 V${versionNumber}`,
    createdAt: new Date().toLocaleString("zh-CN", { hour12: false }),
    summary: buildFinalVersionSummary(sample, scenes, versionNumber),
    adjustments: [...(sample.adjustments || [])],
    renderSpec: result.render_spec || getBaseRenderSpecForFinalGeneration(sample),
    scenes,
  };
}

function formatFinalSceneName(scene) {
  if (scene.shot_type === "bird_view") {
    return "全屋鸟瞰3D";
  }
  return `${translateShotLabel(scene.label || scene.id)}3D效果图`;
}

function buildFinalVersionSummary(sample, scenes, versionNumber) {
  const adjustmentCount = sample.adjustments?.length || 0;
  const vrCount = scenes.filter((scene) => scene.shot_type === "panorama").length;
  return `${sample.style}终版 V${versionNumber} 已生成 ${scenes.length} 个 3D 场景${vrCount ? `，包含 ${vrCount} 个 VR 全景` : ""}。${adjustmentCount ? `本版应用 ${adjustmentCount} 条调整。` : "本版未额外调整。"}风格保持为 ${sample.style}。`;
}

function setGenerationStatus({ status, title, messages }) {
  if (!generationStatusPanel) {
    return;
  }

  generationStatusProgressTimer = renderStatusSteps(generationStatusPanel, {
    status,
    title,
    messages,
    timer: generationStatusProgressTimer,
  });
}

function setRenderStatus({ status, title, messages }) {
  if (!renderStatusPanel) {
    return;
  }

  renderStatusProgressTimer = renderStatusSteps(renderStatusPanel, {
    status,
    title,
    messages,
    timer: renderStatusProgressTimer,
    extraClass: "render-status",
  });
}

function renderStatusSteps(panel, { status, title, messages, timer, extraClass = "" }) {
  const canUpdateInPlace = panel.dataset.statusKind === status && panel.querySelector(".status-current-step");
  if (canUpdateInPlace && messages.length <= 1) {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
    const heading = panel.querySelector("strong");
    if (heading) {
      heading.textContent = title;
    }
    updateCurrentStatusStep(panel.querySelector(".status-current-step"), messages[0] || title, status);
    return timer;
  }

  if (timer) {
    window.clearInterval(timer);
  }

  panel.replaceChildren();
  panel.className = ["generation-status", extraClass, `is-${status}`].filter(Boolean).join(" ");
  panel.dataset.statusKind = status;

  const heading = document.createElement("strong");
  heading.textContent = title;
  panel.append(heading);

  const step = document.createElement("div");
  step.className = "status-current-step";
  panel.append(step);

  if (status !== "running") {
    updateCurrentStatusStep(step, messages[0] || title, status);
    return null;
  }

  let activeIndex = 0;
  updateCurrentStatusStep(step, messages[activeIndex] || title, status);

  return window.setInterval(() => {
    activeIndex = Math.min(activeIndex + 1, Math.max(messages.length - 1, 0));
    updateCurrentStatusStep(step, messages[activeIndex] || title, status);
  }, 1300);
}

function updateCurrentStatusStep(step, message, status) {
  const nextClassName = `status-current-step is-${status}`;
  if (step.className !== nextClassName) {
    step.className = nextClassName;
  }

  let icon = step.querySelector(".status-step-icon");
  if (!icon) {
    icon = document.createElement("span");
    icon.className = "status-step-icon";
    icon.setAttribute("aria-hidden", "true");
    step.append(icon);
  }
  icon.textContent = getStatusStepIcon(status);

  let text = step.querySelector(".status-step-text");
  if (!text) {
    text = document.createElement("span");
    text.className = "status-step-text";
    step.append(text);
  }
  if (text.textContent !== message) {
    text.textContent = message;
  }
}

function getStatusStepIcon(status) {
  if (status === "running") {
    return "";
  }
  if (status === "complete") {
    return "✓";
  }
  if (status === "error") {
    return "!";
  }
  return "⏳";
}

function clearRenderStatus() {
  if (!renderStatusPanel || renderStatusPanel.classList.contains("is-running")) {
    return;
  }
  if (renderStatusProgressTimer) {
    window.clearInterval(renderStatusProgressTimer);
    renderStatusProgressTimer = null;
  }

  renderStatusPanel.replaceChildren();
  renderStatusPanel.className = "generation-status render-status";
  delete renderStatusPanel.dataset.statusKind;
}

function clearGenerationStatus() {
  if (!generationStatusPanel || generationStatusPanel.classList.contains("is-running")) {
    return;
  }
  if (generationStatusProgressTimer) {
    window.clearInterval(generationStatusProgressTimer);
    generationStatusProgressTimer = null;
  }

  generationStatusPanel.replaceChildren();
  generationStatusPanel.className = "generation-status";
  delete generationStatusPanel.dataset.statusKind;
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
  const zone = input.closest(".upload-panel") || input.closest(".upload-zone");
  if (!zone) {
    return;
  }

  ["dragenter", "dragover"].forEach((eventName) => {
    zone.addEventListener(eventName, (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
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
    event.preventDefault();
    zone.classList.remove("is-drag-over");

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

  if (input.dataset.importStep === "floor") {
    label.textContent = "重新上传图纸";
    return;
  }

  label.textContent = files.length === 1 ? files[0].name : `已选择 ${files.length} 个文件`;
}

async function handleEffectBriefUpload(files = effectBriefInput?.files) {
  const file = files?.[0];
  if (!file) {
    return;
  }

  setEffectBriefUploadLabel("读取中");
  try {
    const formatError = validateEffectBriefFileFormat(file);
    if (formatError) {
      throw new Error(formatError);
    }

    const result = await extractEffectBriefContent(file);
    const content = normalizeEffectBriefText(result.content);
    if (!content) {
      throw new Error("说明文档没有可读取内容，请检查文件后重新上传。");
    }

    const parsed = parseEffectBriefDocument(content, result.design_brief);
    effectBriefDocument = {
      fileName: file.name,
      fileSize: file.size,
      content,
      backendDesignBrief: result.design_brief || null,
      parsed,
      messages: result.messages || [],
      uploadedAt: new Date(),
    };
    applyEffectBriefToInputs(content);
    isEditingEffectBrief = false;
    renderEffectBriefStrip();
    renderEffectBriefViewer();
    reportEffectBriefParseState();
  } catch (error) {
    setGenerationStatus({
      status: "error",
      title: "效果说明读取失败",
      messages: [formatEffectBriefError(error)],
    });
  } finally {
    if (effectBriefInput) {
      effectBriefInput.value = "";
    }
    setEffectBriefUploadLabel(effectBriefDocument ? "重传" : "上传效果说明");
  }
}

function validateEffectBriefFileFormat(file) {
  if (file.size === 0) {
    return "说明文档为空，请重新上传。";
  }

  const extension = getFileExtension(file.name);
  if (acceptedEffectBriefExtensions.includes(extension)) {
    return "";
  }

  return "仅支持 TXT / MD / DOCX 效果说明文档。";
}

async function extractEffectBriefContent(file) {
  const apiBaseUrl = getApiBaseUrl();
  if (apiBaseUrl) {
    try {
      return await extractEffectBriefWithApi(file, apiBaseUrl);
    } catch (error) {
      if (!isTextEffectBriefFile(file)) {
        throw error;
      }
    }
  }

  if (!isTextEffectBriefFile(file)) {
    throw new Error("当前仅支持 TXT / MD / DOCX 效果说明文档。");
  }

  return { content: await file.text(), messages: [] };
}

async function extractEffectBriefWithApi(file, apiBaseUrl) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${apiBaseUrl}/api/v1/import/effect-brief/extract`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return response.json();
}

function isTextEffectBriefFile(file) {
  const extension = getFileExtension(file?.name || "");
  return file?.type?.startsWith("text/") || [".txt", ".md", ".markdown"].includes(extension);
}

function renderEffectBriefStrip() {
  if (!effectBriefSummary) {
    return;
  }

  effectBriefSummary.closest(".upload-panel")?.classList.toggle("has-effect-brief", Boolean(effectBriefDocument));
  effectBriefSummary.replaceChildren();
  effectBriefSummary.hidden = !effectBriefDocument;
  if (effectBriefViewAction) {
    effectBriefViewAction.hidden = !effectBriefDocument;
  }
  if (!effectBriefDocument) {
    return;
  }

  const label = document.createElement("span");
  label.className = "effect-brief-strip-label";
  label.textContent = "效果说明";

  const title = document.createElement("strong");
  title.textContent = effectBriefDocument.fileName;

  const preview = document.createElement("small");
  preview.textContent = getEffectBriefPreview(effectBriefDocument.content);

  effectBriefSummary.append(label, title, preview);
}

function openEffectBriefViewer() {
  if (!effectBriefDocument || !effectBriefViewer) {
    return;
  }

  isEditingEffectBrief = true;
  renderEffectBriefViewer();
  effectBriefViewer.hidden = false;
  effectBriefEditor?.focus();
}

function closeEffectBriefViewer() {
  if (!effectBriefViewer) {
    return;
  }

  isEditingEffectBrief = false;
  effectBriefViewer.hidden = true;
  renderEffectBriefViewer();
}

function toggleEffectBriefEditing() {
  if (!effectBriefDocument) {
    return;
  }

  if (isEditingEffectBrief) {
    const content = normalizeEffectBriefText(effectBriefEditor?.value || "");
    const parsed = parseEffectBriefDocument(content);
    effectBriefDocument = {
      ...effectBriefDocument,
      content,
      backendDesignBrief: null,
      parsed,
      editedAt: new Date(),
    };
    applyEffectBriefToInputs(content);
    isEditingEffectBrief = false;
    renderEffectBriefStrip();
    renderEffectBriefViewer();
    reportEffectBriefParseState();
    return;
  }

  isEditingEffectBrief = true;
  renderEffectBriefViewer();
  effectBriefEditor?.focus();
}

function renderEffectBriefViewer() {
  if (!effectBriefViewer || !effectBriefDocument) {
    return;
  }

  if (effectBriefTitle) {
    effectBriefTitle.textContent = effectBriefDocument.fileName;
  }
  if (effectBriefMeta) {
    const date = effectBriefDocument.editedAt || effectBriefDocument.uploadedAt;
    effectBriefMeta.textContent = `${formatFileSize(effectBriefDocument.fileSize)} · ${date.toLocaleString("zh-CN", { hour12: false })}`;
  }
  if (effectBriefContent) {
    effectBriefContent.textContent = effectBriefDocument.content;
    effectBriefContent.hidden = isEditingEffectBrief;
  }
  if (effectBriefEditor) {
    effectBriefEditor.value = effectBriefDocument.content;
    effectBriefEditor.hidden = !isEditingEffectBrief;
  }
  if (effectBriefEditButton) {
    effectBriefEditButton.textContent = isEditingEffectBrief ? "保存" : "编辑";
  }
}

function setEffectBriefUploadLabel(text) {
  if (effectBriefLabel) {
    effectBriefLabel.textContent = text || effectBriefLabel.dataset.defaultLabel || "上传效果说明";
  }
}

function normalizeEffectBriefText(content) {
  return String(content || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
}

function parseEffectBriefDocument(content, backendDesignBrief = null) {
  const normalizedContent = normalizeEffectBriefText(content);
  const styleMatch = normalizedContent.match(/(?:设计风格|装修风格|风格)\s*[:：]\s*([^\n，,。；;]+)/);
  const styleText = styleMatch?.[1]?.trim() || "";
  const styleId = findStyleIdInText(styleText) || findStyleIdInText(normalizedContent);
  const areaText = extractEffectBriefAreaText(normalizedContent);
  const areaM2 = parseEffectBriefArea(areaText);
  const floorHeightText = extractEffectBriefFloorHeightText(normalizedContent);
  const floorHeight = parseEffectBriefHeight(floorHeightText);
  const errors = [];

  if (styleText && !styleId) {
    errors.push(`效果说明中的风格“${styleText}”未匹配到当前可选风格。`);
  }
  if (areaText && !areaM2) {
    errors.push(`效果说明中的户型面积“${areaText}”无法解析。`);
  }
  if (floorHeightText && !floorHeight) {
    errors.push(`效果说明中的层高“${floorHeightText}”无法解析。`);
  }

  errors.push(...compareEffectBriefParserResults({ styleId, areaM2, floorHeight }, backendDesignBrief));

  return {
    styleText,
    styleId,
    areaText,
    areaM2,
    floorHeightText,
    floorHeight,
    errors,
  };
}

function extractEffectBriefAreaText(content) {
  const match = content.match(/(?:户型面积|建筑面积|套内面积)\s*[:：]\s*(\d+(?:\.\d+)?\s*(?:m²|㎡|m2|平米|平方米)?)/i);
  return match?.[1]?.replace(/\s+/g, "") || "";
}

function parseEffectBriefArea(value) {
  const match = String(value || "").match(/(\d+(?:\.\d+)?)/);
  if (!match) {
    return null;
  }

  const area = Number(match[1]);
  return Number.isFinite(area) && area > 0 ? area : null;
}

function extractEffectBriefFloorHeightText(content) {
  const match = content.match(/层高\s*[:：]\s*(\d+(?:\.\d+)?\s*(?:mm|毫米|cm|厘米|m|米)?)/i);
  return match?.[1]?.replace(/\s+/g, "") || "";
}

function parseEffectBriefHeight(value) {
  const match = String(value || "").match(/(\d+(?:\.\d+)?)/);
  if (!match) {
    return null;
  }

  const height = Number(match[1]);
  const normalized = String(value || "").toLowerCase().replace(/\s+/g, "");
  if (!Number.isFinite(height) || height <= 0) {
    return null;
  }
  if (normalized.includes("cm") || normalized.includes("厘米")) {
    return height * 10;
  }
  if (normalized.includes("mm") || normalized.includes("毫米")) {
    return height >= 100 && height < 1000 ? height * 10 : height;
  }
  if ((normalized.includes("m") || normalized.includes("米")) && !normalized.includes("m²")) {
    return height * 1000;
  }
  if (height < 10) {
    return height * 1000;
  }
  if (height >= 100 && height < 1000) {
    return height * 10;
  }
  return height;
}

function compareEffectBriefParserResults(parsed, backendDesignBrief) {
  if (!backendDesignBrief) {
    return [];
  }

  const errors = [];
  if (parsed.styleId) {
    const backendStyleId = findStyleIdInText(backendDesignBrief.design_style);
    if (!backendStyleId) {
      errors.push("后端未能解析出效果说明中的设计风格。");
    } else if (backendStyleId !== parsed.styleId) {
      errors.push(`前后端风格解析不一致：前端为 ${stylePackages[parsed.styleId]?.label || parsed.styleId}，后端为 ${backendDesignBrief.design_style}。`);
    }
  }

  if (parsed.areaM2) {
    const backendArea = parseEffectBriefArea(backendDesignBrief.area);
    if (!backendArea) {
      errors.push("后端未能解析出效果说明中的户型面积。");
    } else if (!isCloseNumber(backendArea, parsed.areaM2, 0.05)) {
      errors.push(`前后端户型面积解析不一致：前端为 ${parsed.areaM2}㎡，后端为 ${backendArea}㎡。`);
    }
  }

  if (parsed.floorHeight) {
    const backendHeight = Number(backendDesignBrief.floor_height);
    if (!Number.isFinite(backendHeight)) {
      errors.push("后端未能解析出效果说明中的层高。");
    } else if (!isCloseNumber(backendHeight, parsed.floorHeight, 1)) {
      errors.push(`前后端层高解析不一致：前端为 ${formatMillimeters(parsed.floorHeight)}，后端为 ${formatMillimeters(backendHeight)}。`);
    }
  }

  return errors;
}

function reportEffectBriefParseState() {
  const errors = getEffectBriefParseErrors();
  if (errors.length > 0) {
    setGenerationStatus({
      status: "error",
      title: "效果说明解析失败",
      messages: errors,
    });
  } else {
    clearGenerationStatus();
  }
  updateGenerateState();
}

function getEffectBriefParseErrors() {
  return effectBriefDocument?.parsed?.errors || [];
}

function applyEffectBriefToInputs(content) {
  const normalizedContent = normalizeEffectBriefText(content);
  if (designIdeaInput) {
    designIdeaInput.value = normalizedContent;
  }

  const detectedStyleId = effectBriefDocument?.parsed?.styleId || detectStyleFromEffectBrief(normalizedContent);
  if (detectedStyleId) {
    selectStylePackage(detectedStyleId);
    return;
  }

  if (effectBriefDocument?.parsed?.styleText) {
    clearSelectedStylePackage();
    return;
  }

  clearGenerationStatus();
  updateGenerateState();
}

function clearSelectedStylePackage() {
  selectedStyleId = "";
  importState.style = false;
  styleOptionButtons.forEach((button) => {
    button.classList.remove("is-selected");
    button.setAttribute("aria-pressed", "false");
  });
  updateGenerateState();
}

function detectStyleFromEffectBrief(content) {
  const explicitStyle = content.match(/(?:设计风格|装修风格|风格)\s*[:：]\s*([^\n，,。；;]+)/);
  return findStyleIdInText(explicitStyle?.[1]) || findStyleIdInText(content);
}

function findStyleIdInText(text) {
  const haystack = String(text || "").toLowerCase();
  if (!haystack) {
    return "";
  }

  const matches = Object.entries(effectBriefStyleAliases)
    .flatMap(([styleId, aliases]) =>
      aliases.map((alias) => ({
        styleId,
        index: haystack.indexOf(alias.toLowerCase()),
        weight: alias.length,
      }))
    )
    .filter((match) => match.index >= 0)
    .sort((left, right) => left.index - right.index || right.weight - left.weight);

  return matches[0]?.styleId || "";
}

function getEffectBriefPreview(content) {
  const firstLine = normalizeEffectBriefText(content)
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);
  if (!firstLine) {
    return "点击查看完整说明";
  }
  return firstLine.length > 52 ? `${firstLine.slice(0, 52)}...` : firstLine;
}

function formatEffectBriefError(error) {
  const message = error instanceof Error ? error.message : "";
  return message || "无法读取效果说明文档，请重新上传 TXT / MD / DOCX 文件。";
}

function formatFileSize(size) {
  const bytes = Number(size) || 0;
  if (bytes >= 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }
  if (bytes >= 1024) {
    return `${Math.ceil(bytes / 1024)} KB`;
  }
  return `${bytes} B`;
}

function validateDraftAgainstEffectBrief(draft) {
  const parsed = effectBriefDocument?.parsed;
  if (!parsed) {
    return;
  }

  const errors = [];
  const designBrief = draft?.design_brief || {};
  if (parsed.styleId) {
    const generatedStyleId = String(draft?.design_plan?.style || "").toLowerCase();
    if (generatedStyleId !== parsed.styleId) {
      errors.push(`风格应为 ${stylePackages[parsed.styleId]?.label || parsed.styleId}，实际生成 ${draft?.design_plan?.style_label || generatedStyleId || "未识别"}。`);
    }
  }

  if (parsed.areaM2) {
    const parsedArea = parseEffectBriefArea(designBrief.area);
    if (!parsedArea) {
      errors.push("后端生成结果缺少效果说明中的户型面积。");
    } else if (!isCloseNumber(parsedArea, parsed.areaM2, 0.05)) {
      errors.push(`户型面积应为 ${parsed.areaM2}㎡，实际解析 ${parsedArea}㎡。`);
    }
  }

  if (parsed.floorHeight) {
    const briefHeight = Number(designBrief.floor_height);
    const floorPlanHeight = Number(draft?.floor_plan?.floor_height);
    const renderHeight = Number(draft?.render_spec?.floor_height);
    if (!Number.isFinite(briefHeight) || !isCloseNumber(briefHeight, parsed.floorHeight, 1)) {
      errors.push(`说明层高应为 ${formatMillimeters(parsed.floorHeight)}，后端说明解析为 ${Number.isFinite(briefHeight) ? formatMillimeters(briefHeight) : "未识别"}。`);
    }
    if (!Number.isFinite(floorPlanHeight) || !isCloseNumber(floorPlanHeight, parsed.floorHeight, 1)) {
      errors.push(`户型模型层高应为 ${formatMillimeters(parsed.floorHeight)}，实际为 ${Number.isFinite(floorPlanHeight) ? formatMillimeters(floorPlanHeight) : "未识别"}。`);
    }
    if (!Number.isFinite(renderHeight) || !isCloseNumber(renderHeight, parsed.floorHeight, 1)) {
      errors.push(`渲染规格层高应为 ${formatMillimeters(parsed.floorHeight)}，实际为 ${Number.isFinite(renderHeight) ? formatMillimeters(renderHeight) : "未识别"}。`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`效果说明解析结果不一致：${errors.join("；")}`);
  }
}

function isCloseNumber(left, right, tolerance) {
  return Number.isFinite(left) && Number.isFinite(right) && Math.abs(left - right) <= tolerance;
}

function formatMillimeters(value) {
  return `${Math.round(Number(value))}mm`;
}

async function validateFloorFile(input, files = input.files) {
  const file = files[0];
  if (!file && selectedFloorFile) {
    updateGenerateState();
    return;
  }

  const extension = getFileExtension(file?.name ?? "");
  const runId = ++floorValidationRunId;

  updateUploadLabel(input, files);
  importState.floor = false;

  if (!file) {
    selectedFloorFile = null;
    setFloorValidation({ status: "empty", title: "", messages: [] });
    clearFloorPreview();
    updateGenerateState();
    return;
  }

  setFloorPreviewMessage("正在读取图纸", ["上传后会解析 CAD 线段、房间边界和文字标注，并生成 2D 预览。"]);
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
    selectedFloorFile = null;
    setFloorValidation({
      status: "invalid",
      title: "户型文件未通过检查",
      messages: formatErrors,
    });
    clearFloorPreview();
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
      selectedFloorFile = result.status === "valid" ? file : null;
      setFloorValidation(result);
      if (result.status === "valid") {
        await renderApiFloorPreview(file, runId);
      } else {
        clearFloorPreview();
      }
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
        selectedFloorFile = null;
        setFloorPreviewMessage("无法展示 DWG", ["DWG 需要本地后端完成转换后才能展示图纸预览。"]);
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
    selectedFloorFile = null;
    clearFloorPreview();
    updateGenerateState();
    return;
  }

  if (runId !== floorValidationRunId) {
    return;
  }

  const report = inspectDxfContent(content);
  renderFloorPreview(report.drawing, file.name);
  const result = buildFloorValidationResult(report);
  importState.floor = result.status === "valid";
  selectedFloorFile = result.status === "valid" ? file : null;
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

async function renderDxfPreviewFromFile(file, runId) {
  try {
    const content = await file.text();
    if (runId !== floorValidationRunId) {
      return;
    }

    const report = inspectDxfContent(content);
    renderFloorPreview(report.drawing, file.name);
  } catch (error) {
    if (runId !== floorValidationRunId) {
      return;
    }
    setFloorPreviewMessage("图纸预览失败", ["DXF 文件已完成校验，但浏览器无法读取可绘制的图形内容。"]);
  }
}

async function renderApiFloorPreview(file, runId) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("style", selectedStyleId || "cream");

    const response = await fetch(`${getApiBaseUrl()}/api/v1/projects/from-dxf`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(await readApiError(response));
    }

    const draft = await response.json();
    if (runId !== floorValidationRunId) {
      return;
    }

    renderFloorPreview(buildDrawingFromFloorPlan(draft.floor_plan), file.name);
  } catch (error) {
    if (runId !== floorValidationRunId) {
      return;
    }
    if (getFileExtension(file.name) === ".dxf") {
      await renderDxfPreviewFromFile(file, runId);
      return;
    }
    setFloorPreviewMessage("图纸预览失败", [formatBackendValidationError(error)]);
  }
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
    if (Array.isArray(payload.detail)) {
      return payload.detail
        .map((item) => item.msg || item.message || JSON.stringify(item))
        .join("；");
    }
    if (payload.detail) {
      return JSON.stringify(payload.detail);
    }
  } catch (error) {
    return response.statusText || "后端校验失败。";
  }
  return response.statusText || "后端校验失败。";
}

function formatGenerationError(error) {
  const message = error instanceof Error ? error.message : "";
  if (/failed to fetch|load failed|networkerror/i.test(message)) {
    return "无法连接本地后端生成服务，请先启动 backend：uvicorn app.main:app --reload --port 8010。";
  }
  return message || "方案生成失败，请检查图纸文件和本地后端服务。";
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

      currentEntity = dxfEntityTypes.has(value) ? createDxfEntity(value) : null;
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
    readDxfEntityGeometry(currentEntity, code, value);
  }

  if (currentEntity) {
    entities.push(currentEntity);
  }

  const modelspaceEntities = entities.filter((entity) => !entity.paperSpace);
  const roleStats = buildRoleStats(modelspaceEntities);
  const drawing = buildDrawingFromDxfEntities(modelspaceEntities);

  return {
    hasSection: hasDxfToken(lines, "SECTION"),
    hasEntitiesSection: hasDxfToken(lines, "ENTITIES"),
    hasEof: hasDxfToken(lines, "EOF"),
    insunits,
    entities,
    modelspaceEntities,
    roleStats,
    drawing,
  };
}

function createDxfEntity(type) {
  return {
    type,
    layer: "0",
    paperSpace: false,
    closed: false,
    text: "",
    points: [],
    start: {},
    end: {},
    center: {},
    position: {},
    radius: null,
    startAngle: null,
    endAngle: null,
    pendingPoint: null,
  };
}

function readDxfEntityGeometry(entity, code, value) {
  const number = Number.parseFloat(value);
  if (!Number.isFinite(number)) {
    return;
  }

  if (entity.type === "LINE") {
    assignCoordinate(entity.start, code, number, { x: "10", y: "20" });
    assignCoordinate(entity.end, code, number, { x: "11", y: "21" });
  } else if (entity.type === "LWPOLYLINE") {
    if (code === "10") {
      entity.pendingPoint = { x: number };
    } else if (code === "20" && entity.pendingPoint) {
      entity.pendingPoint.y = number;
      entity.points.push(entity.pendingPoint);
      entity.pendingPoint = null;
    }
  } else if (entity.type === "CIRCLE" || entity.type === "ARC") {
    assignCoordinate(entity.center, code, number, { x: "10", y: "20" });
    if (code === "40") {
      entity.radius = number;
    } else if (code === "50") {
      entity.startAngle = number;
    } else if (code === "51") {
      entity.endAngle = number;
    }
  } else if (entity.type === "TEXT" || entity.type === "MTEXT" || entity.type === "INSERT") {
    assignCoordinate(entity.position, code, number, { x: "10", y: "20" });
  }
}

function assignCoordinate(target, code, value, mapping) {
  if (code === mapping.x) {
    target.x = value;
  } else if (code === mapping.y) {
    target.y = value;
  }
}

function buildDrawingFromDxfEntities(entities) {
  const drawing = createEmptyDrawing();

  entities.forEach((entity) => {
    const role = classifyDxfLayer(entity.layer) || "other";
    if (entity.type === "LINE" && isPoint(entity.start) && isPoint(entity.end)) {
      addDrawingLine(drawing, entity.start, entity.end, role, entity.layer);
    } else if (entity.type === "LWPOLYLINE" && entity.points.length > 1) {
      addDrawingPolyline(drawing, entity.points, entity.closed, role, entity.layer);
    } else if (entity.type === "CIRCLE" && isPoint(entity.center) && Number.isFinite(entity.radius)) {
      addDrawingCircle(drawing, entity.center, entity.radius, role, entity.layer);
    } else if (entity.type === "ARC" && isPoint(entity.center) && Number.isFinite(entity.radius)) {
      addDrawingPolyline(drawing, sampleArcPoints(entity), false, role, entity.layer);
    } else if (dxfTextTypes.has(entity.type) && isPoint(entity.position) && entity.text) {
      addDrawingText(drawing, entity.position, entity.text, role, entity.layer);
    } else if (entity.type === "INSERT" && isPoint(entity.position)) {
      addDrawingPoint(drawing, entity.position, role, entity.layer);
    }
  });

  return finalizeDrawing(drawing);
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
  syncPostUploadRegionWidth();
}

function clearFloorPreview() {
  if (!floorPreviewPanel) {
    return;
  }
  floorPreviewPanel.replaceChildren();
  const uploadPanel = floorPreviewPanel.closest(".upload-panel");
  uploadPanel?.classList.remove("has-floor-preview");
  uploadPanel?.style.removeProperty("--post-upload-region-width");
}

function setFloorPreviewMessage(title, messages = []) {
  if (!floorPreviewPanel) {
    return;
  }

  floorPreviewPanel.closest(".upload-panel")?.classList.add("has-floor-preview");
  floorPreviewPanel.replaceChildren();
  const heading = document.createElement("strong");
  heading.textContent = title;
  floorPreviewPanel.append(heading);

  messages.forEach((message) => {
    const item = document.createElement("p");
    item.textContent = message;
    floorPreviewPanel.append(item);
  });
}

function renderFloorPreview(drawing, fileName) {
  if (!floorPreviewPanel) {
    return;
  }

  if (!drawing?.bounds || drawing.stats.drawableCount === 0) {
    setFloorPreviewMessage("暂无可展示图形", ["已读取文件，但没有找到可绘制的模型空间线段或房间边界。"]);
    return;
  }

  floorPreviewPanel.replaceChildren();
  floorPreviewPanel.closest(".upload-panel")?.classList.add("has-floor-preview");

  const title = document.createElement("strong");
  title.textContent = "图纸预览";
  const summary = document.createElement("p");
  summary.textContent = `${fileName} · ${drawing.stats.drawableCount} 个图形对象 · ${drawing.stats.layerCount} 个图层`;

  const svg = createSvgElement("svg", {
    width: "100%",
    height: "100%",
    viewBox: `0 0 ${floorPreviewWidth} ${floorPreviewHeight}`,
    role: "img",
    "aria-label": `${fileName} 图纸预览`,
  });
  svg.append(createSvgElement("rect", {
    x: 0,
    y: 0,
    width: floorPreviewWidth,
    height: floorPreviewHeight,
    fill: "#fbfbf6",
  }));

  drawing.polylines.forEach((polyline) => {
    const points = polyline.points.map((point) => projectFloorPoint(point, drawing.bounds)).join(" ");
    svg.append(createSvgElement(polyline.closed ? "polygon" : "polyline", {
      points,
      fill: polyline.closed && polyline.role === "room_boundary" ? "rgb(94 154 135 / 0.08)" : "none",
      stroke: floorPreviewColor(polyline.role),
      "stroke-width": floorPreviewStrokeWidth(polyline.role),
      "stroke-linejoin": "round",
      "stroke-linecap": "round",
      "vector-effect": "non-scaling-stroke",
    }));
  });

  drawing.circles.forEach((circle) => {
    const center = projectFloorPointObject(circle.center, drawing.bounds);
    svg.append(createSvgElement("circle", {
      cx: center.x,
      cy: center.y,
      r: Math.max(2, circle.radius * drawing.bounds.scale),
      fill: "none",
      stroke: floorPreviewColor(circle.role),
      "stroke-width": floorPreviewStrokeWidth(circle.role),
      "vector-effect": "non-scaling-stroke",
    }));
  });

  drawing.lines.forEach((line) => {
    const start = projectFloorPointObject(line.start, drawing.bounds);
    const end = projectFloorPointObject(line.end, drawing.bounds);
    svg.append(createSvgElement("line", {
      x1: start.x,
      y1: start.y,
      x2: end.x,
      y2: end.y,
      stroke: floorPreviewColor(line.role),
      "stroke-width": floorPreviewStrokeWidth(line.role),
      "stroke-linecap": "round",
      "vector-effect": "non-scaling-stroke",
    }));
  });

  drawing.points.forEach((point) => {
    const projected = projectFloorPointObject(point.position, drawing.bounds);
    svg.append(createSvgElement("circle", {
      cx: projected.x,
      cy: projected.y,
      r: 4,
      fill: floorPreviewColor(point.role),
    }));
  });

  drawing.texts.slice(0, 80).forEach((text) => {
    const projected = projectFloorPointObject(text.position, drawing.bounds);
    const label = createSvgElement("text", {
      x: projected.x,
      y: projected.y,
      fill: floorPreviewColor(text.role),
      "font-size": "14",
      "font-weight": "700",
    });
    label.textContent = text.text;
    svg.append(label);
  });

  floorPreviewPanel.append(title, summary, svg);
  syncPostUploadRegionWidth();
}

function syncPostUploadRegionWidth() {
  const uploadPanel = floorPreviewPanel?.closest(".upload-panel");
  if (!uploadPanel?.classList.contains("has-floor-preview") || !floorValidationPanel) {
    return;
  }

  window.requestAnimationFrame(() => {
    const validationWidth = Math.round(floorValidationPanel.getBoundingClientRect().width);
    if (validationWidth > 0) {
      uploadPanel.style.setProperty("--post-upload-region-width", `${validationWidth}px`);
    }
  });
}

function createSvgElement(tagName, attributes = {}) {
  const element = document.createElementNS(svgNamespace, tagName);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, String(value));
  });
  return element;
}

function projectFloorPoint(point, bounds) {
  const projected = projectFloorPointObject(point, bounds);
  return `${projected.x},${projected.y}`;
}

function projectFloorPointObject(point, bounds) {
  return {
    x: floorPreviewPadding + (point.x - bounds.minX) * bounds.scale + bounds.offsetX,
    y: floorPreviewHeight - floorPreviewPadding - (point.y - bounds.minY) * bounds.scale - bounds.offsetY,
  };
}

function floorPreviewColor(role) {
  const colors = {
    wall: "#202821",
    room_boundary: "#5e9a87",
    room_text: "#43524b",
    door: "#b98255",
    window: "#4f7fa8",
    column: "#6f6658",
    beam: "#8a785f",
    other: "#9aa39d",
  };
  return colors[role] || colors.other;
}

function floorPreviewStrokeWidth(role) {
  if (role === "wall") {
    return 3;
  }
  if (role === "room_boundary") {
    return 2;
  }
  return 1.5;
}

function createFloorPlanImage(floorPlan, fileName) {
  const drawing = buildDrawingFromFloorPlan(floorPlan);
  if (!drawing?.bounds || drawing.stats.drawableCount === 0) {
    return createGeneratedSchemeImage({
      title: "2D 户型图",
      subtitle: fileName,
      lines: ["后端已生成方案数据，但没有返回可绘制的户型线段。"],
      palette: ["#5e9a87", "#f1ece2", "#a16f43"],
    });
  }

  const parts = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${floorPreviewWidth} ${floorPreviewHeight}" role="img">`,
    `<title>${escapeSvgText(fileName)} 2D 户型图</title>`,
    `<rect width="${floorPreviewWidth}" height="${floorPreviewHeight}" fill="#fbfbf6"/>`,
  ];

  drawing.polylines.forEach((polyline) => {
    const points = polyline.points.map((point) => projectFloorPoint(point, drawing.bounds)).join(" ");
    const tagName = polyline.closed ? "polygon" : "polyline";
    const fill = polyline.closed && polyline.role === "room_boundary" ? "rgb(94 154 135 / 0.08)" : "none";
    parts.push(`<${tagName} points="${points}" fill="${fill}" stroke="${floorPreviewColor(polyline.role)}" stroke-width="${floorPreviewStrokeWidth(polyline.role)}" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`);
  });

  drawing.circles.forEach((circle) => {
    const center = projectFloorPointObject(circle.center, drawing.bounds);
    const radius = Math.max(2, circle.radius * drawing.bounds.scale);
    parts.push(`<circle cx="${center.x}" cy="${center.y}" r="${radius}" fill="none" stroke="${floorPreviewColor(circle.role)}" stroke-width="${floorPreviewStrokeWidth(circle.role)}" vector-effect="non-scaling-stroke"/>`);
  });

  drawing.lines.forEach((line) => {
    const start = projectFloorPointObject(line.start, drawing.bounds);
    const end = projectFloorPointObject(line.end, drawing.bounds);
    parts.push(`<line x1="${start.x}" y1="${start.y}" x2="${end.x}" y2="${end.y}" stroke="${floorPreviewColor(line.role)}" stroke-width="${floorPreviewStrokeWidth(line.role)}" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`);
  });

  drawing.points.forEach((point) => {
    const projected = projectFloorPointObject(point.position, drawing.bounds);
    parts.push(`<circle cx="${projected.x}" cy="${projected.y}" r="5" fill="${floorPreviewColor(point.role)}"/>`);
  });

  drawing.texts.slice(0, 80).forEach((text) => {
    const projected = projectFloorPointObject(text.position, drawing.bounds);
    parts.push(`<text x="${projected.x}" y="${projected.y}" fill="${floorPreviewColor(text.role)}" font-size="18" font-weight="700">${escapeSvgText(text.text)}</text>`);
  });

  parts.push("</svg>");
  return svgToDataUrl(parts.join(""));
}

function createGeneratedSchemeImage({ title, subtitle, lines, palette }) {
  const safePalette = (palette || []).filter(isValidHexColor).slice(0, 5);
  const swatches = safePalette.map((color, index) => {
    const x = 112 + index * 62;
    return `<circle cx="${x}" cy="780" r="22" fill="${color}"/><circle cx="${x}" cy="780" r="22" fill="none" stroke="rgb(32 40 33 / 0.12)" stroke-width="2"/>`;
  }).join("");
  const lineMarkup = lines.slice(0, 5).map((line, index) => {
    const y = 350 + index * 78;
    return `<text x="132" y="${y}" fill="#43524b" font-size="34" font-weight="600">${escapeSvgText(truncateSvgLine(line, 42))}</text>`;
  }).join("");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" role="img">
      <rect width="1600" height="1000" fill="#fbfbf6"/>
      <rect x="68" y="72" width="1464" height="856" rx="30" fill="#f4f7f2" stroke="#d7e5dc" stroke-width="2"/>
      <text x="112" y="180" fill="#202821" font-size="74" font-weight="800">${escapeSvgText(title)}</text>
      <text x="116" y="248" fill="#6f7f76" font-size="30" font-weight="600">${escapeSvgText(truncateSvgLine(subtitle, 52))}</text>
      ${lineMarkup}
      <text x="112" y="730" fill="#6f7f76" font-size="24" font-weight="700">MATERIAL PALETTE</text>
      ${swatches}
    </svg>
  `;
  return svgToDataUrl(svg);
}

function createAdjustmentSceneImage({ title, subtitle, lines }) {
  const lineMarkup = lines.slice(0, 5).map((line, index) => {
    const y = 332 + index * 76;
    return `<text x="112" y="${y}" fill="#43524b" font-size="34" font-weight="600">${escapeSvgText(truncateSvgLine(line, 46))}</text>`;
  }).join("");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" role="img">
      <rect width="1600" height="1000" fill="#fbfbf6"/>
      <text x="112" y="164" fill="#202821" font-size="74" font-weight="800">${escapeSvgText(title)}</text>
      <text x="116" y="232" fill="#6f7f76" font-size="30" font-weight="600">${escapeSvgText(truncateSvgLine(subtitle, 52))}</text>
      ${lineMarkup}
    </svg>
  `;
  return svgToDataUrl(svg);
}

function svgToDataUrl(svg) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function escapeSvgText(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function truncateSvgLine(value, maxLength) {
  const text = String(value ?? "");
  return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
}

function isValidHexColor(value) {
  return /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(String(value || ""));
}

function createEmptyDrawing() {
  return {
    lines: [],
    polylines: [],
    circles: [],
    points: [],
    texts: [],
    bounds: null,
    stats: {
      drawableCount: 0,
      layerCount: 0,
    },
  };
}

function buildDrawingFromFloorPlan(floorPlan) {
  const drawing = createEmptyDrawing();
  if (!floorPlan) {
    return finalizeDrawing(drawing);
  }

  (floorPlan.room_boundaries || []).forEach((boundary) => {
    addDrawingPolyline(drawing, boundary.polygon || [], true, "room_boundary", boundary.layer);
  });
  (floorPlan.walls || []).forEach((wall) => addDrawingLine(drawing, wall.start, wall.end, "wall", wall.layer));
  (floorPlan.columns || []).forEach((column) => addDrawingLine(drawing, column.start, column.end, "column", column.layer));
  (floorPlan.beams || []).forEach((beam) => addDrawingLine(drawing, beam.start, beam.end, "beam", beam.layer));
  (floorPlan.doors || []).forEach((door) => addDrawingPoint(drawing, door.center, "door", door.layer));
  (floorPlan.windows || []).forEach((window) => addDrawingPoint(drawing, window.center, "window", window.layer));
  (floorPlan.room_labels || []).forEach((label) => {
    addDrawingText(drawing, label.position, label.name, "room_text", label.layer);
  });

  return finalizeDrawing(drawing);
}

function addDrawingLine(drawing, start, end, role, layer) {
  if (!isPoint(start) || !isPoint(end)) {
    return;
  }
  drawing.lines.push({ start: normalizePoint(start), end: normalizePoint(end), role, layer });
}

function addDrawingPolyline(drawing, points, closed, role, layer) {
  const validPoints = points.filter(isPoint).map(normalizePoint);
  if (validPoints.length < 2) {
    return;
  }
  drawing.polylines.push({ points: validPoints, closed, role, layer });
}

function addDrawingCircle(drawing, center, radius, role, layer) {
  if (!isPoint(center) || !Number.isFinite(radius) || radius <= 0) {
    return;
  }
  drawing.circles.push({ center: normalizePoint(center), radius, role, layer });
}

function addDrawingPoint(drawing, position, role, layer) {
  if (!isPoint(position)) {
    return;
  }
  drawing.points.push({ position: normalizePoint(position), role, layer });
}

function addDrawingText(drawing, position, text, role, layer) {
  if (!isPoint(position) || !text) {
    return;
  }
  drawing.texts.push({ position: normalizePoint(position), text, role, layer });
}

function finalizeDrawing(drawing) {
  drawing.stats.drawableCount =
    drawing.lines.length + drawing.polylines.length + drawing.circles.length + drawing.points.length + drawing.texts.length;
  drawing.stats.layerCount = new Set([
    ...drawing.lines.map((item) => item.layer),
    ...drawing.polylines.map((item) => item.layer),
    ...drawing.circles.map((item) => item.layer),
    ...drawing.points.map((item) => item.layer),
    ...drawing.texts.map((item) => item.layer),
  ].filter(Boolean)).size;

  const points = getDrawingBoundsPoints(drawing);
  if (points.length === 0) {
    drawing.bounds = null;
    return drawing;
  }

  const minX = Math.min(...points.map((point) => point.x));
  const maxX = Math.max(...points.map((point) => point.x));
  const minY = Math.min(...points.map((point) => point.y));
  const maxY = Math.max(...points.map((point) => point.y));
  const width = Math.max(maxX - minX, 1);
  const height = Math.max(maxY - minY, 1);
  const drawableWidth = floorPreviewWidth - floorPreviewPadding * 2;
  const drawableHeight = floorPreviewHeight - floorPreviewPadding * 2;
  const scale = Math.min(drawableWidth / width, drawableHeight / height);

  drawing.bounds = {
    minX,
    minY,
    maxX,
    maxY,
    scale,
    offsetX: (drawableWidth - width * scale) / 2,
    offsetY: (drawableHeight - height * scale) / 2,
  };
  return drawing;
}

function getDrawingBoundsPoints(drawing) {
  const primaryGeometry = collectDrawingGeometryPoints(drawing, (role) => floorPlanGeometryRoles.has(role));
  if (primaryGeometry.length > 0) {
    return primaryGeometry;
  }

  const lineworkGeometry = collectDrawingGeometryPoints(drawing);
  if (lineworkGeometry.length > 0) {
    return lineworkGeometry;
  }

  return [
    ...drawing.points.map((point) => point.position),
    ...drawing.texts.map((text) => text.position),
  ];
}

function collectDrawingGeometryPoints(drawing, roleFilter = null) {
  const shouldUse = (item) => !roleFilter || roleFilter(item.role);
  return [
    ...drawing.lines.filter(shouldUse).flatMap((line) => [line.start, line.end]),
    ...drawing.polylines.filter(shouldUse).flatMap((polyline) => polyline.points),
    ...drawing.circles.filter(shouldUse).flatMap((circle) => [
      { x: circle.center.x - circle.radius, y: circle.center.y - circle.radius },
      { x: circle.center.x + circle.radius, y: circle.center.y + circle.radius },
    ]),
  ];
}

function sampleArcPoints(entity) {
  const startAngle = Number.isFinite(entity.startAngle) ? entity.startAngle : 0;
  let endAngle = Number.isFinite(entity.endAngle) ? entity.endAngle : startAngle + 360;
  while (endAngle < startAngle) {
    endAngle += 360;
  }

  const points = [];
  const steps = Math.max(8, Math.ceil((endAngle - startAngle) / 12));
  for (let index = 0; index <= steps; index += 1) {
    const angle = ((startAngle + ((endAngle - startAngle) * index) / steps) * Math.PI) / 180;
    points.push({
      x: entity.center.x + Math.cos(angle) * entity.radius,
      y: entity.center.y + Math.sin(angle) * entity.radius,
    });
  }
  return points;
}

function isPoint(point) {
  return Number.isFinite(point?.x) && Number.isFinite(point?.y);
}

function normalizePoint(point) {
  return {
    x: Number(point.x),
    y: Number(point.y),
  };
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
  const hasEffectBriefParseErrors = getEffectBriefParseErrors().length > 0;

  document.querySelectorAll("[data-step-card]").forEach((card) => {
    const isFloorCard = card.dataset.stepCard === "floor";
    card.classList.toggle("is-complete", Boolean(importState[card.dataset.stepCard]));
    card.classList.toggle("is-checking", isFloorCard && floorValidationState.status === "checking");
    card.classList.toggle("is-invalid", isFloorCard && floorValidationState.status === "invalid");
  });

  if (generateButton) {
    const isDisabled = !isReady || isGeneratingPlan || hasEffectBriefParseErrors;
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
  const sample = getActiveSample();
  const targetPane = isFinalOnlyPane(pane) && sample && !hasFinalVersion(sample) ? "adjust" : pane;

  schemeTabButtons.forEach((button) => {
    const isFinalOnly = button.hasAttribute("data-final-only");
    const isLocked = isFinalOnly && sample && !hasFinalVersion(sample);
    const isActive = button.dataset.schemeTab === targetPane;
    button.hidden = isLocked;
    button.disabled = isLocked;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  schemePanes.forEach((item) => {
    item.classList.toggle("is-active", item.dataset.schemePane === targetPane);
  });
}

function isFinalOnlyPane(pane) {
  return pane === "delivery" || pane === "versions";
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
      const room = getSampleCoverScene(sample);
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
            <span>${getPreviewScenes(sample).length} 场景</span>
          </span>
        </span>
      `;
      button.addEventListener("click", () => {
        activeSampleId = sample.id;
        activeRoomId = getPreviewScenes(sample)[0]?.id || sample.rooms[0]?.id;
        activeAdjustSceneId = getAdjustableScenes(sample)[0]?.id || "";
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
  const sample = getActiveSample();
  if (!sample) {
    return;
  }

  const scenes = getPreviewScenes(sample);
  const room = scenes.find((item) => item.id === activeRoomId) ?? scenes[0];
  if (room && room.id !== activeRoomId) {
    activeRoomId = room.id;
  }
  const activeVersion = getActiveVersion(sample);

  detailStatus.textContent = getSchemeStatus(sample);
  detailTitle.textContent = `${sample.name} · ${activeVersion ? `${sample.style}${activeVersion.title}` : sample.title}`;
  detailImage.src = room.image;
  detailImage.alt = room.alt;
  detailImage.style.objectFit = room.fit || "cover";
  detailRoomName.textContent = room.name;
  detailSummary.textContent = activeVersion?.summary || sample.summary;
  detailArea.textContent = sample.area;
  detailStyle.textContent = sample.style;
  detailDelivery.textContent = hasFinalVersion(sample) ? "3D效果图 + VR" : "初版预览";

  renderSceneTabs(detailRoomTabs, scenes, activeRoomId, (sceneId) => {
    activeRoomId = sceneId;
    renderScheme();
  });
  renderAdjustPanel(sample);
  renderDeliveryPane(sample);
  renderVersionPane(sample);
  setSchemePane(getActiveSchemePane());
}

function getActiveSample() {
  return availableSamples.find((item) => item.id === activeSampleId) ?? availableSamples[0];
}

function getActiveVersion(sample) {
  if (!sample?.versions?.length) {
    return null;
  }
  return sample.versions.find((version) => version.id === sample.activeVersionId) ?? sample.versions[sample.versions.length - 1];
}

function hasFinalVersion(sample) {
  return Boolean(sample?.versions?.length);
}

function getPreviewScenes(sample) {
  const activeVersion = getActiveVersion(sample);
  if (activeVersion?.scenes?.length) {
    return activeVersion.scenes;
  }
  return sample.initialScenes?.length ? sample.initialScenes : sample.rooms;
}

function getAdjustableScenes(sample) {
  const source = sample.plannedScenes?.length ? sample.plannedScenes : getPreviewScenes(sample);
  return source.filter((scene) => scene.adjustable !== false);
}

function getActiveAdjustScene(sample) {
  const scenes = getAdjustableScenes(sample);
  return scenes.find((scene) => scene.id === activeAdjustSceneId) ?? scenes[0];
}

function getSampleCoverScene(sample) {
  return getPreviewScenes(sample)[0] ?? {
    image: "./assets/showcase/new-plan-cover.jpg",
    alt: "方案预览",
  };
}

function getSchemeStatus(sample) {
  const activeVersion = getActiveVersion(sample);
  if (activeVersion) {
    return `${activeVersion.title} · 已生成`;
  }
  return sample.status || "初版 · 待生成3D";
}

function getActiveSchemePane() {
  return schemePanes.find((pane) => pane.classList.contains("is-active"))?.dataset.schemePane || "preview";
}

function renderSceneTabs(container, scenes, activeId, onSelect) {
  if (!container) {
    return;
  }

  container.hidden = scenes.length <= 1;
  container.replaceChildren(
    ...scenes.map((scene) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = scene.id === activeId ? "is-active" : "";
      button.textContent = scene.name;
      button.addEventListener("click", () => onSelect(scene.id));
      return button;
    })
  );
}

function renderAdjustPanel(sample) {
  const scenes = getAdjustableScenes(sample);
  const scene = getActiveAdjustScene(sample);
  if (!scene || !adjustImage) {
    return;
  }

  activeAdjustSceneId = scene.id;
  adjustImage.src = scene.image;
  adjustImage.alt = scene.alt || `${scene.name} 调整预览`;
  adjustImage.style.objectFit = scene.fit || "contain";
  renderSceneTabs(adjustSceneTabs, scenes, activeAdjustSceneId, (sceneId) => {
    activeAdjustSceneId = sceneId;
    renderScheme();
  });

  if (styleLockButton) {
    styleLockButton.textContent = `${sample.style} · 风格锁定`;
  }
  if (adjustScope) {
    adjustScope.textContent = hasFinalVersion(sample)
      ? `正在基于当前终版继续调整 ${scene.name}，重新生成后会记录为下一版终版。`
      : `正在调整初版中的 ${scene.name}，生成后会成为第一版终版。`;
  }

  renderAdjustActions(sample, scene);

  if (renderFinalButton) {
    renderFinalButton.disabled = isStoppingRender || (!isRenderingFinal && !getBaseRenderSpecForFinalGeneration(sample));
    renderFinalButton.classList.toggle("is-danger", isRenderingFinal);
    renderFinalButton.textContent = isRenderingFinal
      ? (isStoppingRender ? "正在停止生成" : "停止生成")
      : hasFinalVersion(sample)
        ? `生成第 ${(sample.versions?.length || 0) + 1} 版终版3D效果图`
        : "生成第一版终版3D效果图";
  }
  if (clearAdjustmentsButton) {
    clearAdjustmentsButton.disabled = isRenderingFinal || !(sample.adjustments || []).length;
  }
}

function renderAdjustActions(sample, scene) {
  if (!adjustActionsPanel) {
    return;
  }

  const actionIds = getAdjustmentActionIds(scene);
  adjustActionsPanel.replaceChildren(
    ...actionIds.map((action) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.adjustAction = action;
      button.className = (sample.adjustments || []).some((item) => item.sceneId === scene.id && item.action === action)
        ? "is-active"
        : "";
      button.textContent = adjustmentLabels[action] || action;
      button.addEventListener("click", () => addSceneAdjustment(action));
      return button;
    })
  );
}

function getAdjustmentActionIds(scene) {
  if (scene.sceneType === "whole") {
    return ["storage", "warmer-light", "brighter", "simpler", "layout-flow"];
  }

  const roomName = scene.roomName || scene.name || "";
  if (/客|餐|厅|起居|living/i.test(roomName)) {
    return ["sofa-layout", "tv-wall", "dining", "storage", "warmer-light", "brighter"];
  }
  if (/卧|bedroom|主卧|次卧|房/i.test(roomName)) {
    return ["bed-wall", "wardrobe", "bedside", "storage", "warmer-light", "privacy"];
  }
  if (/厨|kitchen/i.test(roomName)) {
    return ["countertop-flow", "cabinet-storage", "appliances", "brighter"];
  }
  if (/卫|浴|bath|toilet/i.test(roomName)) {
    return ["dry-wet", "vanity", "shower", "brighter", "storage"];
  }
  if (/阳台|balcony/i.test(roomName)) {
    return ["balcony-use", "storage", "brighter", "privacy"];
  }
  return ["storage", "layout-flow", "warmer-light", "brighter"];
}

function renderDeliveryPane(sample) {
  if (!deliveryContent) {
    return;
  }

  const activeVersion = getActiveVersion(sample);
  if (!activeVersion) {
    deliveryContent.replaceChildren(createEmptyState("生成终版后开放交付", "初版只提供预览和调整；生成3D效果图后才会出现交付图、VR 全景和终版入口。"));
    return;
  }

  const grid = document.createElement("div");
  grid.className = "delivery-grid";
  activeVersion.scenes.forEach((scene, index) => {
    const card = document.createElement("article");
    card.className = index === 0 ? "delivery-card large" : "delivery-card";
    const image = document.createElement("img");
    image.src = scene.image;
    image.alt = scene.alt || scene.name;
    const copy = document.createElement("div");
    const label = document.createElement("span");
    label.textContent = scene.shot_type === "panorama" ? "VR 全景" : "3D 效果图";
    const title = document.createElement("strong");
    title.textContent = scene.name;
    copy.append(label, title);
    card.append(image, copy);
    grid.append(card);
  });
  deliveryContent.replaceChildren(grid);
}

function renderVersionPane(sample) {
  if (!versionList) {
    return;
  }

  if (!hasFinalVersion(sample)) {
    versionList.replaceChildren(createEmptyState("暂无终版版本", "初版不会进入版本记录；每次生成3D效果图后，才会新增一个终版版本。"));
    return;
  }

  const grid = document.createElement("div");
  grid.className = "version-grid";
  sample.versions.forEach((version) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = version.id === sample.activeVersionId ? "version-card current" : "version-card";
    const label = document.createElement("span");
    label.textContent = version.title;
    const title = document.createElement("strong");
    title.textContent = version.createdAt;
    const summary = document.createElement("p");
    summary.textContent = version.adjustments?.length
      ? `应用 ${version.adjustments.length} 条调整，${version.scenes.length} 个场景。`
      : `未额外调整，${version.scenes.length} 个场景。`;
    card.append(label, title, summary);
    card.addEventListener("click", () => {
      sample.activeVersionId = version.id;
      activeRoomId = version.scenes[0]?.id || activeRoomId;
      renderScheme();
      setSchemePane("preview");
    });
    grid.append(card);
  });
  versionList.replaceChildren(grid);
}

function createEmptyState(title, message) {
  const wrapper = document.createElement("div");
  wrapper.className = "empty-state";
  const heading = document.createElement("strong");
  heading.textContent = title;
  const copy = document.createElement("p");
  copy.textContent = message;
  wrapper.append(heading, copy);
  return wrapper;
}
