import { APP_CONFIG } from "./config.js";

const samples = [
  {
    id: "guangyuan-shangju-modern-template",
    name: "广源尚居",
    title: "现代简约真实全景模板",
    status: "模板库 · 真实 2:1 全景",
    area: "模板案例",
    style: "现代简约",
    delivery: "真实全景模板",
    summary: "外部真实 2:1 全景资源已纳入模板库。当前作为风格、材质、灯光和局部修图底图使用，不直接代表任意用户户型的终版交付。",
    templateOnly: true,
    rooms: [
      {
        id: "living-dining",
        name: "客餐厅全景",
        image: "./assets/panoramas/guangyuan-shangju-modern-template/01_92279827.jpg",
        preview: "./assets/panoramas/guangyuan-shangju-modern-template/01_92279827.jpg",
        alt: "广源尚居现代简约客餐厅真实全景模板",
        fit: "cover",
        roomName: "客餐厅",
      },
      {
        id: "master-bedroom",
        name: "主卧全景",
        image: "./assets/panoramas/guangyuan-shangju-modern-template/02_100009674.jpg",
        preview: "./assets/panoramas/guangyuan-shangju-modern-template/02_100009674.jpg",
        alt: "广源尚居现代简约主卧真实全景模板",
        fit: "cover",
        roomName: "主卧",
      },
      {
        id: "kitchen",
        name: "厨房全景",
        image: "./assets/panoramas/guangyuan-shangju-modern-template/03_100009675.jpg",
        preview: "./assets/panoramas/guangyuan-shangju-modern-template/03_100009675.jpg",
        alt: "广源尚居现代简约厨房真实全景模板",
        fit: "cover",
        roomName: "厨房",
      },
      {
        id: "bathroom",
        name: "卫生间全景",
        image: "./assets/panoramas/guangyuan-shangju-modern-template/04_100009676.jpg",
        preview: "./assets/panoramas/guangyuan-shangju-modern-template/04_100009676.jpg",
        alt: "广源尚居现代简约卫生间真实全景模板",
        fit: "cover",
        roomName: "卫生间",
      },
    ],
    panoramaScenes: [
      {
        id: "guangyuan-living-dining",
        scene_id: "guangyuan-living-dining",
        name: "客餐厅全景",
        image: "./assets/panoramas/guangyuan-shangju-modern-template/01_92279827.jpg",
        preview: "./assets/panoramas/guangyuan-shangju-modern-template/01_92279827.jpg",
        width: 2048,
        height: 1024,
        roomId: "living-dining",
        source_provider: "provided_panorama_asset",
        quality_status: "production",
        deliverable: true,
        quality_notes: ["真实 2:1 全景模板资源，可用于案例浏览、风格参考和后续局部修图；未匹配用户户型，不能直接作为新增方案终版交付。"],
      },
      {
        id: "guangyuan-master-bedroom",
        scene_id: "guangyuan-master-bedroom",
        name: "主卧全景",
        image: "./assets/panoramas/guangyuan-shangju-modern-template/02_100009674.jpg",
        preview: "./assets/panoramas/guangyuan-shangju-modern-template/02_100009674.jpg",
        width: 2048,
        height: 1024,
        roomId: "master-bedroom",
        source_provider: "provided_panorama_asset",
        quality_status: "production",
        deliverable: true,
        quality_notes: ["真实 2:1 全景模板资源，可用于案例浏览、风格参考和后续局部修图；未匹配用户户型，不能直接作为新增方案终版交付。"],
      },
      {
        id: "guangyuan-kitchen",
        scene_id: "guangyuan-kitchen",
        name: "厨房全景",
        image: "./assets/panoramas/guangyuan-shangju-modern-template/03_100009675.jpg",
        preview: "./assets/panoramas/guangyuan-shangju-modern-template/03_100009675.jpg",
        width: 2048,
        height: 1024,
        roomId: "kitchen",
        source_provider: "provided_panorama_asset",
        quality_status: "production",
        deliverable: true,
        quality_notes: ["真实 2:1 全景模板资源，可用于案例浏览、风格参考和后续局部修图；未匹配用户户型，不能直接作为新增方案终版交付。"],
      },
      {
        id: "guangyuan-bathroom",
        scene_id: "guangyuan-bathroom",
        name: "卫生间全景",
        image: "./assets/panoramas/guangyuan-shangju-modern-template/04_100009676.jpg",
        preview: "./assets/panoramas/guangyuan-shangju-modern-template/04_100009676.jpg",
        width: 2048,
        height: 1024,
        roomId: "bathroom",
        source_provider: "provided_panorama_asset",
        quality_status: "production",
        deliverable: true,
        quality_notes: ["真实 2:1 全景模板资源，可用于案例浏览、风格参考和后续局部修图；未匹配用户户型，不能直接作为新增方案终版交付。"],
      },
    ],
  },
  {
    id: "guangyuan-shangju-full-vr-independent-review-v1",
    name: "广源尚居整屋",
    title: "AI整屋VR独立空间方案",
    status: "终版 V1 · 可交付 VR",
    area: "约 75 m2",
    style: "现代简约",
    delivery: "真实 2:1 VR全景",
    summary: "基于广源尚居户型与效果说明生成的 6 点位整屋 VR 方案，空间独立生成并通过统一材质提示保持连续性；可直接进入全屋 VR 预览；如不满意可选择区域重新生成并记录为新版本。",
    floorPlanImage: "./assets/floor-plans/guangyuan-shangju.svg",
    floorMapPoints: [
      { roomId: "living", name: "客厅", x: 56.4, y: 37.4 },
      { roomId: "dining", name: "餐厅", x: 54.6, y: 67.6 },
      { roomId: "kitchen", name: "厨房", x: 68.9, y: 64.0 },
      { roomId: "hall", name: "过道", x: 50.6, y: 86.9 },
      { roomId: "master-bedroom", name: "主卧", x: 35.5, y: 58.9 },
      { roomId: "balcony", name: "阳台", x: 56.4, y: 12.2 },
    ],
    rooms: [
      {
        id: "living",
        name: "客厅全景",
        image: "./assets/panoramas/guangyuan-shangju-full-vr-independent-review-v1/01_guangyuan_living.jpg",
        preview: "./assets/panoramas/guangyuan-shangju-full-vr-independent-review-v1/01_guangyuan_living.jpg",
        alt: "广源尚居 AI 生成客厅 VR 全景",
        fit: "cover",
        roomName: "客厅",
      },
      {
        id: "dining",
        name: "餐厅全景",
        image: "./assets/panoramas/guangyuan-shangju-full-vr-independent-review-v1/02_guangyuan_dining.jpg",
        preview: "./assets/panoramas/guangyuan-shangju-full-vr-independent-review-v1/02_guangyuan_dining.jpg",
        alt: "广源尚居 AI 生成餐厅 VR 全景",
        fit: "cover",
        roomName: "餐厅",
      },
      {
        id: "kitchen",
        name: "厨房全景",
        image: "./assets/panoramas/guangyuan-shangju-full-vr-independent-review-v1/03_guangyuan_kitchen.jpg",
        preview: "./assets/panoramas/guangyuan-shangju-full-vr-independent-review-v1/03_guangyuan_kitchen.jpg",
        alt: "广源尚居 AI 生成厨房 VR 全景",
        fit: "cover",
        roomName: "厨房",
      },
      {
        id: "hall",
        name: "过道全景",
        image: "./assets/panoramas/guangyuan-shangju-full-vr-independent-review-v1/04_guangyuan_hall.jpg",
        preview: "./assets/panoramas/guangyuan-shangju-full-vr-independent-review-v1/04_guangyuan_hall.jpg",
        alt: "广源尚居 AI 生成过道 VR 全景",
        fit: "cover",
        roomName: "过道",
      },
      {
        id: "master-bedroom",
        name: "主卧全景",
        image: "./assets/panoramas/guangyuan-shangju-full-vr-independent-review-v1/05_guangyuan_master_bedroom.jpg",
        preview: "./assets/panoramas/guangyuan-shangju-full-vr-independent-review-v1/05_guangyuan_master_bedroom.jpg",
        alt: "广源尚居 AI 生成主卧 VR 全景",
        fit: "cover",
        roomName: "主卧",
      },
      {
        id: "balcony",
        name: "阳台全景",
        image: "./assets/panoramas/guangyuan-shangju-full-vr-independent-review-v1/06_guangyuan_balcony.jpg",
        preview: "./assets/panoramas/guangyuan-shangju-full-vr-independent-review-v1/06_guangyuan_balcony.jpg",
        alt: "广源尚居 AI 生成阳台 VR 全景",
        fit: "cover",
        roomName: "阳台",
      },
    ],
    panoramaScenes: [
      {
        id: "guangyuan-full-living",
        scene_id: "01_guangyuan_living",
        name: "客厅全景",
        image: "./assets/panoramas/guangyuan-shangju-full-vr-independent-review-v1/01_guangyuan_living.jpg",
        preview: "./assets/panoramas/guangyuan-shangju-full-vr-independent-review-v1/01_guangyuan_living.jpg",
        width: 5792,
        height: 2896,
        roomId: "living",
        source_provider: "ai_panorama_renderer",
        quality_status: "production",
        deliverable: true,
      },
      {
        id: "guangyuan-full-dining",
        scene_id: "02_guangyuan_dining",
        name: "餐厅全景",
        image: "./assets/panoramas/guangyuan-shangju-full-vr-independent-review-v1/02_guangyuan_dining.jpg",
        preview: "./assets/panoramas/guangyuan-shangju-full-vr-independent-review-v1/02_guangyuan_dining.jpg",
        width: 5792,
        height: 2896,
        roomId: "dining",
        source_provider: "ai_panorama_renderer",
        quality_status: "production",
        deliverable: true,
      },
      {
        id: "guangyuan-full-kitchen",
        scene_id: "03_guangyuan_kitchen",
        name: "厨房全景",
        image: "./assets/panoramas/guangyuan-shangju-full-vr-independent-review-v1/03_guangyuan_kitchen.jpg",
        preview: "./assets/panoramas/guangyuan-shangju-full-vr-independent-review-v1/03_guangyuan_kitchen.jpg",
        width: 5792,
        height: 2896,
        roomId: "kitchen",
        source_provider: "ai_panorama_renderer",
        quality_status: "production",
        deliverable: true,
      },
      {
        id: "guangyuan-full-hall",
        scene_id: "04_guangyuan_hall",
        name: "过道全景",
        image: "./assets/panoramas/guangyuan-shangju-full-vr-independent-review-v1/04_guangyuan_hall.jpg",
        preview: "./assets/panoramas/guangyuan-shangju-full-vr-independent-review-v1/04_guangyuan_hall.jpg",
        width: 5792,
        height: 2896,
        roomId: "hall",
        source_provider: "ai_panorama_renderer",
        quality_status: "production",
        deliverable: true,
      },
      {
        id: "guangyuan-full-master-bedroom",
        scene_id: "05_guangyuan_master_bedroom",
        name: "主卧全景",
        image: "./assets/panoramas/guangyuan-shangju-full-vr-independent-review-v1/05_guangyuan_master_bedroom.jpg",
        preview: "./assets/panoramas/guangyuan-shangju-full-vr-independent-review-v1/05_guangyuan_master_bedroom.jpg",
        width: 5792,
        height: 2896,
        roomId: "master-bedroom",
        source_provider: "ai_panorama_renderer",
        quality_status: "production",
        deliverable: true,
      },
      {
        id: "guangyuan-full-balcony",
        scene_id: "06_guangyuan_balcony",
        name: "阳台全景",
        image: "./assets/panoramas/guangyuan-shangju-full-vr-independent-review-v1/06_guangyuan_balcony.jpg",
        preview: "./assets/panoramas/guangyuan-shangju-full-vr-independent-review-v1/06_guangyuan_balcony.jpg",
        width: 5792,
        height: 2896,
        roomId: "balcony",
        source_provider: "ai_panorama_renderer",
        quality_status: "production",
        deliverable: true,
      },
    ],
    externalPanoramaImport: {
      project: "guangyuan-shangju-full-vr-independent-review-v1",
      projectName: "广源尚居整屋",
      sourceProvider: "ai_panorama_renderer",
      style: "modern_minimal",
      maxScenes: 6,
      outputWidth: 3840,
      timeout: 1800,
    },
  },
  {
    id: "yixingyuan",
    name: "益兴园",
    title: "中古风整屋方案",
    status: "V2 · 业主确认版",
    area: "128 m²",
    style: "中古风",
    delivery: "VR全景方案",
    summary: "已完成客餐厅、餐厨、主卧和 VR 全景预览，适合进入客户评审。",
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
    panoramaScenes: [
      {
        id: "pano-living",
        name: "客厅全景",
        image: "./assets/panoramas/yixingyuan/living.jpg",
        preview: "./assets/panoramas/yixingyuan/thumbs/living.jpg",
        width: 16384,
        height: 8192,
        roomId: "living",
      },
      {
        id: "pano-dining",
        name: "餐厅全景",
        image: "./assets/panoramas/yixingyuan/dining.jpg",
        preview: "./assets/panoramas/yixingyuan/thumbs/dining.jpg",
        width: 16384,
        height: 8192,
        roomId: "dining",
      },
      {
        id: "pano-kitchen",
        name: "厨房全景",
        image: "./assets/panoramas/yixingyuan/kitchen.jpg",
        preview: "./assets/panoramas/yixingyuan/thumbs/kitchen.jpg",
        width: 16384,
        height: 8192,
        roomId: "kitchen",
      },
      {
        id: "pano-entry",
        name: "入户全景",
        image: "./assets/panoramas/yixingyuan/entry.jpg",
        preview: "./assets/panoramas/yixingyuan/thumbs/entry.jpg",
        width: 16384,
        height: 8192,
        roomId: "entry",
      },
      {
        id: "pano-master-bedroom",
        name: "主卧全景",
        image: "./assets/panoramas/yixingyuan/master-bedroom.jpg",
        preview: "./assets/panoramas/yixingyuan/thumbs/master-bedroom.jpg",
        width: 16384,
        height: 8192,
        roomId: "master-bedroom",
      },
      {
        id: "pano-second-bedroom",
        name: "次卧全景",
        image: "./assets/panoramas/yixingyuan/second-bedroom.jpg",
        preview: "./assets/panoramas/yixingyuan/thumbs/second-bedroom.jpg",
        width: 16384,
        height: 8192,
        roomId: "second-bedroom",
      },
      {
        id: "pano-bathroom",
        name: "卫生间全景",
        image: "./assets/panoramas/yixingyuan/bathroom.jpg",
        preview: "./assets/panoramas/yixingyuan/thumbs/bathroom.jpg",
        width: 8192,
        height: 4096,
        roomId: "bathroom",
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
    delivery: "VR全景方案",
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
    title: "现代奶油风全屋初版",
    status: "初版 · 待复核",
    area: "112 m²",
    style: "现代奶油风",
    delivery: "VR全景方案",
    summary: "现代奶油风方向，待复核收纳与灯光。",
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
    delivery: "VR全景方案",
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

const vrPreviewSamples = 8;
const vrPreviewPanoramaWidth = 4096;
const vrPreviewPanoramaHeight = 2048;
const showCreateCardInCaseLibrary = true;
const staticPanoramaTemplateManifests = [
  {
    sampleId: "generated-style-library-v1",
    name: "AI生成风格库",
    title: "AI生成真实全景风格参考",
    style: "多风格",
    area: "风格参考",
    manifestUrl: "./assets/panoramas/generated-style-library/manifest.json",
    assetBaseUrl: "./assets/panoramas/generated-style-library/",
  },
  {
    sampleId: "guangyuan-shangju-modern-template",
    name: "外部全景风格库",
    title: "真实全景模板",
    style: "现代简约",
    area: "风格参考",
    manifestUrl: "./assets/panoramas/guangyuan-shangju-modern-template/manifest.json",
    assetBaseUrl: "./assets/panoramas/guangyuan-shangju-modern-template/",
  },
];

const authStateStorageKey = "xspace-auth-state";
const picwishTokenStorageKey = "xspace-picwish-api-token";
const picwishAuthorizationStorageKey = "xspace-picwish-authorization";
const accountProfileStorageKey = "xspace-account-profile";

const role = resolveAccountRole();
const canUseDesignerWorkspace =
  role === "designer" || APP_CONFIG.featureFlags.designerWorkspace === true;
let isAccountLoggedIn = resolveAccountLoginState();
let accountProfile = resolveAccountProfile();
let availableSamples = samples
  .filter((sample) => !sample.templateOnly && (canUseDesignerWorkspace || !sample.designerOnly))
  .map(normalizeSampleState);
let availableStyleSamples = [];

const body = document.body;
const panels = [...document.querySelectorAll("[data-panel]")];
const sampleList = document.querySelector("#sampleList");
const styleList = document.querySelector("#styleList");
const styleCountLabel = document.querySelector("[data-style-count]");
const stylePanoCountLabel = document.querySelector("[data-style-pano-count]");
const styleSearchInput = document.querySelector("[data-style-search]");
const styleFilters = document.querySelector("[data-style-filters]");
const detailStatus = document.querySelector("#detailStatus");
const detailTitle = document.querySelector("#detailTitle");
const detailImage = document.querySelector("#detailImage");
const detailRoomName = document.querySelector("#detailRoomName");
const detailSummary = document.querySelector("#detailSummary");
const previewFloorPlan = document.querySelector("[data-preview-floor-plan]");
const detailArea = document.querySelector("#detailArea");
const detailStyle = document.querySelector("#detailStyle");
const detailDelivery = document.querySelector("#detailDelivery");
const detailRoomTabs = document.querySelector("#detailRoomTabs");
const inlineVrPreview = document.querySelector("[data-inline-vr-preview]");
const inlineVrStage = document.querySelector("[data-inline-vr-stage]");
const inlineVrCanvas = document.querySelector("[data-inline-vr-canvas]");
const inlineVrHotspots = document.querySelector("[data-inline-vr-hotspots]");
const inlineVrTabs = document.querySelector("[data-inline-vr-tabs]");
const inlineVrStatus = document.querySelector("[data-inline-vr-status]");
const inlineVrAutoButton = document.querySelector("[data-inline-vr-auto]");
const inlineVrResetButton = document.querySelector("[data-inline-vr-reset]");
const inlineVrFullscreenButton = document.querySelector("[data-inline-vr-fullscreen]");
const adjustImage = document.querySelector("#adjustImage");
const adjustSceneTabs = document.querySelector("#adjustSceneTabs");
const adjustScope = document.querySelector("[data-adjust-scope]");
const adjustActionsPanel = document.querySelector("[data-adjust-actions]");
const manualAdjustmentInput = document.querySelector("[data-manual-adjustment]");
const styleLockButton = document.querySelector("[data-style-lock]");
const renderStatusPanel = document.querySelector("[data-render-status]");
const renderFinalButton = document.querySelector("[data-render-final]");
const clearAdjustmentsButton = document.querySelector("[data-clear-adjustments]");
const versionList = document.querySelector("[data-version-list]");
const navButtons = [...document.querySelectorAll("[data-go-tab]")];
const navGroups = [...document.querySelectorAll("[data-nav-group]")];
const loginButton = document.querySelector("[data-login-action]");
const accountMenu = document.querySelector("[data-account-menu]");
const accountButton = document.querySelector("[data-account-action]");
const accountPanel = document.querySelector("[data-account-panel]");
const accountAvatar = document.querySelector("[data-account-avatar]");
const logoutButton = document.querySelector("[data-logout-action]");
const loginDialog = document.querySelector("[data-login-dialog]");
const loginCloseButton = document.querySelector("[data-login-close]");
const loginForm = document.querySelector("[data-login-form]");
const loginAccountInput = document.querySelector("[data-login-account]");
const loginPasswordInput = document.querySelector("[data-login-password]");
const loginStatus = document.querySelector("[data-login-status]");
const loginSubmitButton = document.querySelector("[data-login-submit]");
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
let panoramaViewer = null;
let panoramaViewerCanvas = null;
let panoramaViewerProject = null;
let panoramaViewerTitle = null;
let panoramaViewerSceneTabs = null;
let panoramaViewerHotspots = null;
let panoramaViewerMap = null;
let panoramaViewerStatus = null;
let panoramaViewerAutoButton = null;
let panoramaViewerScenesToggleButton = null;
let panoramaViewerMapToggleButton = null;
let panoramaPhotoSphereStage = null;
let panoramaPhotoSphereViewer = null;
let panoramaPhotoSphereRequestId = 0;
let photoSphereModulePromise = null;
let photoSphereStylePromise = null;
let panoramaViewerEngine = "legacy";
let panoramaViewerScenes = [];
let panoramaViewerMapPoints = [];
let panoramaViewerRenderSpec = null;
let panoramaViewerFloorPlan = null;
let panoramaViewerFloorPlanImage = "";
let activePanoramaSceneId = "";
let panoramaViewerScenesExpanded = false;
let panoramaDragState = null;
const vrMinFov = 50;
const vrDefaultFov = 90;
const vrMaxFov = 115;
const vrWheelFovStep = 5;
const panoramaMinimapWidth = 155;
const panoramaMinimapHeight = 100;
const panoramaMinimapPadding = 5;
let panoramaYaw = 0;
let panoramaPitch = 0;
let panoramaFov = vrDefaultFov;
let panoramaAutoRotate = false;
let panoramaFrameId = 0;
let panoramaLastFrameTime = 0;
let panoramaGlState = null;
let inlineVrScenes = [];
let activeInlineVrSceneId = "";
let inlineVrDragState = null;
let inlineVrYaw = 0;
let inlineVrPitch = 0;
let inlineVrFov = vrDefaultFov;
let inlineVrAutoRotate = true;
let inlineVrFrameId = 0;
let inlineVrLastFrameTime = 0;
let inlineVrGlState = null;
let manualAdjustmentNotes = {};
const importSteps = ["floor", "style"];
const importState = Object.fromEntries(importSteps.map((step) => [step, false]));
const stylePackages = {
  modern: {
    label: "现代简约",
    defaultTemplate: {
      id: "modern-clean-storage",
      label: "现代简洁收纳模板",
      adjustable: ["黑白灰比例", "电视柜收纳", "开放厨房程度", "墙面造型复杂度"],
    },
    defaultIdea: "整体按现代简约方向生成，强调黑白灰比例、干净收纳、简洁墙面和通透动线，避免复杂造型和过多装饰。",
    title: "现代简约整屋方案",
    summary: "现代简约方向，已准备空间全景和交付入口。",
    rooms: [
      { id: "living", name: "客厅效果图", image: "./assets/showcase/project-modern.jpg", alt: "现代简约客厅生成预览" },
      { id: "bathroom", name: "卫浴效果图", image: "./assets/showcase/detail-bathroom.jpg", alt: "现代简约卫浴生成预览" },
      { id: "materials", name: "材质板", image: "./assets/showcase/materials-moodboard.jpg", alt: "现代简约材质生成预览" },
      { id: "vr", name: "VR 全景", image: "./assets/showcase/vr-panorama.jpg", alt: "现代简约 VR 全景预览" },
    ],
  },
  cream: {
    label: "现代奶油风",
    defaultTemplate: {
      id: "cream-soft-light",
      label: "现代奶油柔光模板",
      adjustable: ["奶油色温", "圆润体块", "收纳容量", "软装密度"],
    },
    defaultIdea: "整体按现代奶油风生成，使用暖白浅木、圆润家具、柔和灯光和低对比材质，空间保持温柔明亮。",
    title: "现代奶油风整屋方案",
    summary: "现代奶油风方向，已准备空间全景和交付入口。",
    rooms: [
      { id: "living", name: "客厅效果图", image: "./assets/showcase/project-cream.jpg", alt: "现代奶油风客厅生成预览" },
      { id: "kitchen", name: "餐厨效果图", image: "./assets/showcase/detail-kitchen.jpg", alt: "现代奶油风餐厨生成预览" },
      { id: "materials", name: "材质板", image: "./assets/showcase/materials-moodboard.jpg", alt: "现代奶油风材质生成预览" },
      { id: "vr", name: "VR 全景", image: "./assets/showcase/vr-panorama.jpg", alt: "现代奶油风 VR 全景预览" },
    ],
  },
  vintage: {
    label: "中古风",
    defaultTemplate: {
      id: "vintage-walnut-warm",
      label: "中古胡桃暖调模板",
      adjustable: ["木色深浅", "复古陈列密度", "收纳容量", "灯光暖度"],
    },
    defaultIdea: "整体按中古风生成，强调胡桃木、复古家具、暖色灯光和低饱和软装，陈列有生活感但不过度堆满。",
    title: "中古风整屋方案",
    summary: "中古风方向，已准备空间全景和交付入口。",
    rooms: [
      { id: "living", name: "客餐厅效果图", image: "./assets/showcase/project-vintage.jpg", alt: "中古风客餐厅效果图" },
      { id: "kitchen", name: "餐厨效果图", image: "./assets/showcase/detail-kitchen.jpg", alt: "中古风餐厨效果图" },
      { id: "bedroom", name: "主卧效果图", image: "./assets/master-bedroom.jpg", alt: "中古风主卧效果图" },
      { id: "vr", name: "VR 全景", image: "./assets/showcase/vr-panorama.jpg", alt: "中古风 VR 全景预览" },
    ],
  },
  wood: {
    label: "原木风",
    defaultTemplate: {
      id: "wood-natural-calm",
      label: "自然原木通透模板",
      adjustable: ["木色暖度", "自然软装密度", "收纳容量", "空间通透感"],
    },
    defaultIdea: "整体按原木风生成，使用浅木、亚麻、纸灯和自然采光，空间保持通透、温和、低饱和。",
    title: "原木风整屋方案",
    summary: "原木风方向，已准备空间全景和交付入口。",
    rooms: [
      { id: "living", name: "客厅效果图", image: "./assets/showcase/project-wood.jpg", alt: "原木风客厅生成预览" },
      { id: "kitchen", name: "厨房效果图", image: "./assets/showcase/detail-kitchen.jpg", alt: "原木风厨房生成预览" },
      { id: "materials", name: "材质板", image: "./assets/showcase/materials-moodboard.jpg", alt: "原木风材质生成预览" },
      { id: "vr", name: "VR 全景", image: "./assets/showcase/vr-panorama.jpg", alt: "原木风 VR 全景预览" },
    ],
  },
  modern_luxury: {
    label: "现代轻奢",
    defaultTemplate: {
      id: "modern-luxury-stone-metal",
      label: "现代轻奢石材金属模板",
      adjustable: ["石材比例", "金属点缀", "灯带层次", "软装精致度"],
    },
    defaultIdea: "整体按现代轻奢生成，突出大板石材、克制金属、精致灯带和高级灰暖调，保持质感但不要过度奢华。",
    title: "现代轻奢整屋方案",
    summary: "现代轻奢方向，已准备空间全景和交付入口。",
    rooms: [
      { id: "living", name: "客厅效果图", image: "./assets/showcase/project-modern_luxury.jpg", alt: "现代轻奢客厅生成预览" },
      { id: "materials", name: "材质板", image: "./assets/showcase/materials-moodboard.jpg", alt: "现代轻奢材质生成预览" },
      { id: "vr", name: "VR 全景", image: "./assets/showcase/vr-panorama.jpg", alt: "现代轻奢 VR 全景预览" },
    ],
  },
  italian: {
    label: "现代意式",
    defaultTemplate: {
      id: "italian-minimal-stone",
      label: "现代意式极简模板",
      adjustable: ["深浅对比", "石材体量", "皮革软装", "线性灯光"],
    },
    defaultIdea: "整体按现代意式生成，使用深色木作、石材体块、皮革软装和线性灯光，空间克制、高级、低矮舒展。",
    title: "现代意式整屋方案",
    summary: "现代意式方向，已准备空间全景和交付入口。",
    rooms: [
      { id: "living", name: "客厅效果图", image: "./assets/showcase/project-italian.jpg", alt: "现代意式客厅生成预览" },
      { id: "materials", name: "材质板", image: "./assets/showcase/materials-moodboard.jpg", alt: "现代意式材质生成预览" },
      { id: "vr", name: "VR 全景", image: "./assets/showcase/vr-panorama.jpg", alt: "现代意式 VR 全景预览" },
    ],
  },
  wabi_sabi: {
    label: "侘寂风",
    defaultTemplate: {
      id: "wabi-sabi-earth-calm",
      label: "侘寂大地肌理模板",
      adjustable: ["肌理粗细", "留白比例", "木石比例", "灯光柔度"],
    },
    defaultIdea: "整体按侘寂风生成，强调大地色、微水泥肌理、自然木石和安静留白，避免亮面材质和复杂装饰。",
    title: "侘寂风整屋方案",
    summary: "侘寂风方向，已准备空间全景和交付入口。",
    rooms: [
      { id: "living", name: "客厅效果图", image: "./assets/showcase/project-wabi_sabi.jpg", alt: "侘寂风客厅生成预览" },
      { id: "materials", name: "材质板", image: "./assets/showcase/materials-moodboard.jpg", alt: "侘寂风材质生成预览" },
      { id: "vr", name: "VR 全景", image: "./assets/showcase/vr-panorama.jpg", alt: "侘寂风 VR 全景预览" },
    ],
  },
  new_chinese: {
    label: "新中式",
    defaultTemplate: {
      id: "new-chinese-modern-wood",
      label: "新中式现代木作模板",
      adjustable: ["木作比例", "中式符号密度", "留白比例", "暖光层次"],
    },
    defaultIdea: "整体按新中式生成，使用深色木作、格栅、东方留白和温润灯光，中式符号克制现代化。",
    title: "新中式整屋方案",
    summary: "新中式方向，已准备空间全景和交付入口。",
    rooms: [
      { id: "living", name: "客厅效果图", image: "./assets/showcase/project-new_chinese.jpg", alt: "新中式客厅生成预览" },
      { id: "materials", name: "材质板", image: "./assets/showcase/materials-moodboard.jpg", alt: "新中式材质生成预览" },
      { id: "vr", name: "VR 全景", image: "./assets/showcase/vr-panorama.jpg", alt: "新中式 VR 全景预览" },
    ],
  },
  french: {
    label: "轻法式",
    defaultTemplate: {
      id: "french-soft-molding",
      label: "轻法式柔和线条模板",
      adjustable: ["线条复杂度", "奶油色温", "金属点缀", "软装浪漫度"],
    },
    defaultIdea: "整体按轻法式生成，使用柔和石膏线、拱形、奶油墙面、黄铜壁灯和浪漫软装，保持轻盈不过度繁复。",
    title: "轻法式整屋方案",
    summary: "轻法式方向，已准备空间全景和交付入口。",
    rooms: [
      { id: "living", name: "客厅效果图", image: "./assets/showcase/project-french.jpg", alt: "轻法式客厅生成预览" },
      { id: "materials", name: "材质板", image: "./assets/showcase/materials-moodboard.jpg", alt: "轻法式材质生成预览" },
      { id: "vr", name: "VR 全景", image: "./assets/showcase/vr-panorama.jpg", alt: "轻法式 VR 全景预览" },
    ],
  },
  scandinavian: {
    label: "北欧风",
    defaultTemplate: {
      id: "scandinavian-bright-living",
      label: "北欧明亮生活模板",
      adjustable: ["浅木比例", "彩色软装", "收纳开放度", "自然光感"],
    },
    defaultIdea: "整体按北欧风生成，使用明亮白墙、浅木、自然光、绿植和低饱和彩色软装，强调生活感和实用收纳。",
    title: "北欧风整屋方案",
    summary: "北欧风方向，已准备空间全景和交付入口。",
    rooms: [
      { id: "living", name: "客厅效果图", image: "./assets/showcase/project-scandinavian.jpg", alt: "北欧风客厅生成预览" },
      { id: "materials", name: "材质板", image: "./assets/showcase/materials-moodboard.jpg", alt: "北欧风材质生成预览" },
      { id: "vr", name: "VR 全景", image: "./assets/showcase/vr-panorama.jpg", alt: "北欧风 VR 全景预览" },
    ],
  },
  industrial: {
    label: "工业风",
    defaultTemplate: {
      id: "industrial-dark-loft",
      label: "工业风暗色金属模板",
      adjustable: ["水泥肌理", "黑色金属比例", "裸露元素", "暖光层次"],
    },
    defaultIdea: "整体按工业风生成，使用水泥肌理、黑铁、深色木、皮革和轨道灯，保持 Loft 氛围但适合居住。",
    title: "工业风整屋方案",
    summary: "工业风方向，已准备空间全景和交付入口。",
    rooms: [
      { id: "living", name: "客厅效果图", image: "./assets/showcase/project-industrial.jpg", alt: "工业风客厅生成预览" },
      { id: "materials", name: "材质板", image: "./assets/showcase/materials-moodboard.jpg", alt: "工业风材质生成预览" },
      { id: "vr", name: "VR 全景", image: "./assets/showcase/vr-panorama.jpg", alt: "工业风 VR 全景预览" },
    ],
  },
  american: {
    label: "美式风",
    defaultTemplate: {
      id: "american-classic-soft",
      label: "美式轻经典模板",
      adjustable: ["护墙线条", "木色深浅", "软装厚度", "壁灯氛围"],
    },
    defaultIdea: "整体按美式风生成，使用护墙线条、壁炉或壁灯、温厚木色和舒适软装，经典但不要厚重老气。",
    title: "美式风整屋方案",
    summary: "美式风方向，已准备空间全景和交付入口。",
    rooms: [
      { id: "living", name: "客厅效果图", image: "./assets/showcase/project-american.jpg", alt: "美式风客厅生成预览" },
      { id: "materials", name: "材质板", image: "./assets/showcase/materials-moodboard.jpg", alt: "美式风材质生成预览" },
      { id: "vr", name: "VR 全景", image: "./assets/showcase/vr-panorama.jpg", alt: "美式风 VR 全景预览" },
    ],
  },
};
const effectBriefStyleAliases = {
  modern: ["现代风", "现代简约风", "现代简约", "现代", "简约", "modern", "minimal"],
  cream: ["现代奶油风", "奶油风", "奶油", "cream", "cream style", "modern cream", "modern_cream"],
  vintage: ["中古风", "中古", "复古", "mid-century", "mid century", "vintage"],
  wood: ["原木风", "原木", "日式原木", "wood"],
  modern_luxury: ["现代轻奢", "轻奢", "light luxury", "luxury"],
  italian: ["现代意式", "意式", "意式极简", "italian", "italian minimal"],
  wabi_sabi: ["侘寂风", "侘寂", "诧寂", "wabi sabi", "wabi-sabi"],
  new_chinese: ["新中式", "中式", "现代中式", "宋式", "chinese"],
  french: ["轻法式", "法式", "法式奶油", "french"],
  scandinavian: ["北欧风", "北欧", "scandinavian", "nordic"],
  industrial: ["工业风", "工业", "loft", "industrial"],
  american: ["美式风", "美式", "american"],
};
const effectBriefStyleSignals = {
  modern: ["黑白灰", "黑白", "简单", "简洁", "简约", "不做复杂", "不要复杂", "复杂造型", "复杂墙板", "满墙电视柜", "电视柜做满墙", "收纳", "浅灰", "黑色收边"],
  cream: ["暖白", "米杏", "象牙白", "圆润", "柔光", "浅木", "奶油色", "弧形", "软糯"],
  vintage: ["胡桃木", "藤编", "焦糖", "复古", "低饱和", "中古", "橄榄绿", "暖棕"],
  wood: ["原木", "自然", "浅木", "亚麻", "纸灯", "木色", "留白", "绿植"],
  modern_luxury: ["轻奢", "金属", "石材", "岩板", "高级灰", "精致"],
  italian: ["意式", "极简", "深色木", "皮革", "石材体块", "线性"],
  wabi_sabi: ["侘寂", "诧寂", "微水泥", "肌理", "大地色", "留白"],
  new_chinese: ["新中式", "中式", "木格栅", "山水", "宋式", "东方"],
  french: ["法式", "轻法", "石膏线", "拱形", "浪漫", "雕花"],
  scandinavian: ["北欧", "明亮", "浅木", "彩色软装", "生活感"],
  industrial: ["工业", "水泥", "黑铁", "裸露", "loft"],
  american: ["美式", "护墙板", "壁炉", "复古皮革", "壁灯"],
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
const floorPreviewBoundsRolePriority = [
  new Set(["room_boundary"]),
  new Set(["wall", "column", "beam"]),
  floorPlanGeometryRoles,
];
const floorPreviewFocusMinItemCount = 12;
const floorPreviewFocusMinPointCount = 36;
const floorPreviewFocusQuantile = 0.08;
const floorPreviewFocusPaddingRatio = 0.18;
const floorPreviewVisibleBoundsPaddingRatio = 0.08;

let activeTab = "samples";
let activeSampleId = availableSamples[0]?.id || "";
let activeRoomId = availableSamples[0]?.rooms?.[0]?.id || "";
let activeAdjustSceneId = "";
let activeStyleSampleId = "";
let activeStyleCategory = "all";
let styleSearchQuery = "";
let floorValidationState = { status: "empty", title: "", messages: [] };
let floorValidationRunId = 0;
let selectedFloorFile = null;
let selectedStyleId = "";
let effectBriefDocument = null;
let isEditingEffectBrief = false;
let pendingLoginTab = "";
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
applyAuthState();
configureLocalPreview();
bindNavigation();
bindStyleLibraryTools();
bindImportWorkflow();
renderSampleList();
renderStyleList();
renderScheme();
updateGenerateState();
setTab(activeTab);
loadPersistedProjectSamples();
loadStaticPanoramaTemplateSamples();

function resolveAccountRole() {
  const queryRole = new URLSearchParams(window.location.search).get("role");
  const accountRole = window.XSPACE_ACCOUNT?.role;
  const storedRole = window.localStorage.getItem("xspace-account-role");
  return queryRole || accountRole || storedRole || APP_CONFIG.account.role || "client";
}

function resolveAccountLoginState() {
  const queryAuth = new URLSearchParams(window.location.search).get("auth");
  const storedAuth = window.localStorage.getItem(authStateStorageKey);
  if (queryAuth === "logged-out") {
    return false;
  }
  if (queryAuth === "logged-in") {
    return true;
  }
  return Boolean(
      window.XSPACE_ACCOUNT?.isLoggedIn ||
      window.XSPACE_ACCOUNT?.id ||
      window.XSPACE_ACCOUNT?.name ||
      (storedAuth === "signed-in" && Boolean(window.localStorage.getItem(picwishAuthorizationStorageKey)))
  );
}

function resolveAccountProfile() {
  const storedProfile = window.localStorage.getItem(accountProfileStorageKey);
  if (storedProfile) {
    try {
      const parsed = JSON.parse(storedProfile);
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    } catch (error) {
      window.localStorage.removeItem(accountProfileStorageKey);
    }
  }
  return window.XSPACE_ACCOUNT || {};
}

function applyRole() {
  body.dataset.role = canUseDesignerWorkspace ? "designer" : "client";
}

function applyAuthState() {
  body.dataset.auth = isAccountLoggedIn ? "logged-in" : "logged-out";
  updateAccountAvatar();
  if (!isAccountLoggedIn) {
    closeAccountMenu();
  }
}

function handleLoginAction() {
  openLoginDialog();
}

function openLoginDialog(nextTab = "") {
  if (!loginDialog) {
    return;
  }
  pendingLoginTab = nextTab;
  loginDialog.hidden = false;
  body.classList.add("is-login-dialog-open");
  setLoginStatus("");
  window.setTimeout(() => loginAccountInput?.focus(), 0);
}

function closeLoginDialog() {
  if (!loginDialog) {
    return;
  }
  loginDialog.hidden = true;
  body.classList.remove("is-login-dialog-open");
  pendingLoginTab = "";
  setLoginSubmitting(false);
}

function setLoginStatus(message, state = "error") {
  if (!loginStatus) {
    return;
  }
  loginStatus.textContent = message;
  loginStatus.dataset.state = state;
}

function setLoginSubmitting(isSubmitting) {
  if (loginSubmitButton) {
    loginSubmitButton.disabled = isSubmitting;
    loginSubmitButton.textContent = isSubmitting ? "登录中" : "登录";
  }
}

function getLoginEndpoint() {
  return APP_CONFIG.account.loginEndpoint || window.XSPACE_LOGIN_ENDPOINT || "https://aw.aoscdn.com/base/passport/v2/login/telephone";
}

function getPicWishAuthorization() {
  return window.localStorage.getItem(picwishAuthorizationStorageKey) || "";
}

function buildPicWishAuthorization(token) {
  const trimmedToken = String(token || "").trim();
  if (!trimmedToken) {
    return "";
  }
  return trimmedToken.toLowerCase().startsWith("bearer ") ? trimmedToken : `Bearer ${trimmedToken}`;
}

function persistPicWishAccount(data) {
  const apiToken = String(data?.api_token || "").trim();
  if (!apiToken) {
    throw new Error("登录成功但没有返回 PicWish token。");
  }
  accountProfile = {
    nickname: data?.nickname || "",
    avatar: data?.avatar || "",
    telephone: data?.telephone || "",
    userId: data?.user_id || "",
  };
  const authorization = buildPicWishAuthorization(apiToken);
  window.localStorage.setItem(authStateStorageKey, "signed-in");
  window.localStorage.setItem(picwishTokenStorageKey, apiToken);
  window.localStorage.setItem(picwishAuthorizationStorageKey, authorization);
  window.localStorage.setItem(accountProfileStorageKey, JSON.stringify(accountProfile));
  window.XSPACE_PICWISH_API_TOKEN = apiToken;
  window.XSPACE_PICWISH_AUTHORIZATION = authorization;
}

function clearPicWishAccount() {
  isAccountLoggedIn = false;
  accountProfile = {};
  window.localStorage.removeItem(authStateStorageKey);
  window.localStorage.removeItem(picwishTokenStorageKey);
  window.localStorage.removeItem(picwishAuthorizationStorageKey);
  window.localStorage.removeItem(accountProfileStorageKey);
  delete window.XSPACE_PICWISH_API_TOKEN;
  delete window.XSPACE_PICWISH_AUTHORIZATION;
  applyAuthState();
  if (requiresLoginForTab(activeTab)) {
    setTab("samples");
  }
}

function updateAccountAvatar() {
  if (!accountAvatar) {
    return;
  }
  const label = accountProfile.nickname || accountProfile.telephone || "交换空间";
  accountAvatar.dataset.initial = String(label).trim().slice(0, 1).toUpperCase() || "交";
  if (accountButton) {
    accountButton.setAttribute("aria-label", `${label}账号菜单`);
  }
}

function toggleAccountMenu() {
  if (!accountPanel || !accountButton) {
    return;
  }
  const isOpen = accountPanel.hidden;
  accountPanel.hidden = !isOpen;
  accountButton.setAttribute("aria-expanded", String(isOpen));
}

function closeAccountMenu() {
  if (accountPanel) {
    accountPanel.hidden = true;
  }
  accountButton?.setAttribute("aria-expanded", "false");
}

async function handleLoginSubmit(event) {
  event.preventDefault();
  const telephone = loginAccountInput?.value.trim().replace(/\s+/g, "") || "";
  const password = loginPasswordInput?.value || "";
  if (!telephone || !password) {
    setLoginStatus("请输入账号和密码。");
    return;
  }

  const endpoint = getLoginEndpoint();
  if (!endpoint) {
    setLoginStatus("登录接口待接入，收到接口后会在这里提交账号密码。");
    return;
  }

  setLoginSubmitting(true);
  setLoginStatus("");
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        telephone,
        country_code: APP_CONFIG.account.countryCode || "+86",
        product_id: String(APP_CONFIG.account.productId || "482"),
        language: APP_CONFIG.account.language || "zh",
      }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || payload?.status !== 200 || !payload?.data?.api_token) {
      throw new Error(payload?.message || payload?.detail || "登录失败，请检查账号和密码。");
    }
    persistPicWishAccount(payload.data);
    isAccountLoggedIn = true;
    applyAuthState();
    const targetTab = pendingLoginTab;
    closeLoginDialog();
    if (targetTab) {
      setTab(targetTab);
    }
  } catch (error) {
    setLoginStatus(error.message || "登录失败，请稍后重试。");
  } finally {
    setLoginSubmitting(false);
  }
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

  const roomScenes = sample.rooms
    .filter((room) => !(sample.panoramaScenes?.length && room.id === "vr"))
    .map((room) => ({
      ...room,
      shot_type: room.id === "vr" ? "panorama" : "interior",
    }));
  const panoramaScenes = (sample.panoramaScenes || []).map((scene) => ({
    ...scene,
    shot_type: "panorama",
    projection: "equirectangular",
    source_provider: scene.source_provider || scene.sourceProvider || "provided_panorama_asset",
    quality_status: scene.quality_status || scene.qualityStatus || "production",
    deliverable: scene.deliverable ?? true,
  }));
  const realPanorama = panoramaScenes.some((scene) => isRealPanoramaProvider(scene.source_provider || scene.sourceProvider));
  const deliverable = realPanorama || (panoramaScenes.length
    ? panoramaScenes.every((scene) => scene.deliverable && normalizeQualityStatus(scene.quality_status) === "production")
    : true);
  const qualityStatus = deliverable ? "production" : "draft";
  const version = {
    id: `final-${sample.id}-v1`,
    number: 1,
    title: deliverable ? "终版 V1" : realPanorama ? "真实全景资源 V1" : "不可交付预览 V1",
    status: deliverable ? "终版 V1" : realPanorama ? "资源库 V1" : "草稿 V1",
    qualityStatus,
    deliverable,
    createdAt: "已有方案",
    summary: sample.summary,
    adjustments: [],
    scenes: roomScenes.length ? roomScenes : panoramaScenes,
  };
  version.vrPackage = buildVrPackageFromScenes(sample, panoramaScenes.length ? panoramaScenes : version.scenes, version.id);

  return {
    ...sample,
    phase: deliverable ? "final" : realPanorama ? "review" : "draft",
    status: sample.status || "终版 V1",
    delivery: sample.delivery || "VR全景方案",
    initialScenes: sample.rooms,
    plannedScenes: sample.rooms,
    versions: [version],
    activeVersionId: version.id,
    adjustments: [],
  };
}

async function loadPersistedProjectSamples() {
  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) {
    return;
  }
  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/projects`);
    if (!response.ok) {
      throw new Error(await readApiError(response));
    }
    const payload = await response.json();
    const persistedSamples = (payload.projects || [])
      .map(createSampleFromPersistedProject)
      .filter(Boolean);
    if (!persistedSamples.length) {
      return;
    }
    const persistedIds = new Set(persistedSamples.map((sample) => sample.id));
    availableSamples = [
      ...persistedSamples,
      ...availableSamples.filter((sample) => !persistedIds.has(sample.id)),
    ];
    if (!activeSampleId || persistedIds.has(activeSampleId)) {
      activeSampleId = persistedSamples[0].id;
      activeRoomId = getPreviewScenes(persistedSamples[0])[0]?.id || "";
      activeAdjustSceneId = getAdjustableScenes(persistedSamples[0])[0]?.id || "";
    }
    renderSampleList();
    renderScheme();
  } catch (error) {
    console.warn("Persisted project load failed:", error);
  }
}

function createSampleFromPersistedProject(record) {
  const sample = record?.sample && typeof record.sample === "object"
    ? record.sample
    : {
        id: record?.id,
        name: record?.name,
        title: record?.title,
        status: record?.status,
        area: record?.area,
        style: record?.style,
        delivery: record?.delivery,
        summary: record?.summary,
        phase: record?.phase,
      };
  if (!sample?.id) {
    return null;
  }
  const versions = (sample.versions || record.versions || []).map(normalizePersistedVersion);
  const activeVersionId = sample.activeVersionId || record.active_version_id || versions.at(-1)?.id || "";
  const activeVersion = versions.find((version) => version.id === activeVersionId) || versions.at(-1);
  const rooms = activeVersion?.scenes?.length ? activeVersion.scenes : sample.rooms || [];
  return {
    ...sample,
    id: sample.id || record.id,
    name: sample.name || record.name,
    title: sample.title || record.title,
    status: sample.status || record.status,
    area: sample.area || record.area,
    style: sample.style || record.style,
    delivery: sample.delivery || record.delivery || "真实 2:1 VR全景",
    summary: sample.summary || record.summary,
    phase: sample.phase || record.phase || "final",
    rooms,
    initialScenes: sample.initialScenes?.length ? sample.initialScenes : rooms,
    plannedScenes: sample.plannedScenes?.length ? sample.plannedScenes : rooms,
    panoramaScenes: activeVersion?.vrPackage?.scenes || sample.panoramaScenes || [],
    versions,
    activeVersionId,
    adjustments: [],
    draft: sample.draft || record.draft || null,
    externalPanoramaImport: sample.externalPanoramaImport || record.external_panorama_import || null,
    persisted: true,
  };
}

function normalizePersistedVersion(version) {
  if (version.vrPackage || version.createdAt) {
    return version;
  }
  return {
    id: version.id,
    number: version.number,
    title: version.title,
    status: version.status,
    qualityStatus: version.quality_status || "draft",
    deliverable: Boolean(version.deliverable),
    createdAt: version.created_at || "已保存",
    summary: version.summary || "",
    adjustments: version.adjustments || [],
    scenes: normalizePersistedScenes(version.scenes || []),
    assets: version.assets || [],
    vrPackage: normalizePersistedVrPackage(version.vr_package),
    renderSpec: version.render_spec || null,
    generationJobId: version.generation_job_id || "",
    qualityReport: version.quality_report || null,
  };
}

function normalizePersistedVrPackage(vrPackage) {
  if (!vrPackage) {
    return null;
  }
  return {
    ...vrPackage,
    projectId: vrPackage.projectId || vrPackage.project_id,
    projectName: vrPackage.projectName || vrPackage.project_name,
    versionId: vrPackage.versionId || vrPackage.version_id,
    floorMapPoints: vrPackage.floorMapPoints || vrPackage.floor_map_points || [],
    shareMeta: vrPackage.shareMeta || vrPackage.share_meta || {},
    sourceProvider: vrPackage.sourceProvider || vrPackage.source_provider,
    qualityStatus: vrPackage.qualityStatus || vrPackage.quality_status,
    productionBlockers: vrPackage.productionBlockers || vrPackage.production_blockers || [],
    scenes: normalizePersistedScenes(vrPackage.scenes || []),
  };
}

function normalizePersistedScenes(scenes) {
  return scenes.map((scene) => ({
    ...scene,
    id: scene.id || scene.scene_id || scene.sceneId,
    sceneId: scene.sceneId || scene.scene_id || scene.id,
    roomId: scene.roomId || scene.room_id || scene.target_room_id,
    image: scene.image || scene.panorama_url,
    preview: scene.preview || scene.thumb_url || scene.panorama_url || scene.image,
    sourceProvider: scene.sourceProvider || scene.source_provider,
    providerTaskId: scene.providerTaskId || scene.provider_task_id || "",
    sourceResourceIds: scene.sourceResourceIds || scene.source_resource_ids || [],
    hotspots: [],
    qualityStatus: scene.qualityStatus || scene.quality_status,
    qualityNotes: scene.qualityNotes || scene.quality_notes || [],
    shot_type: scene.shot_type || "panorama",
    projection: scene.projection || "equirectangular",
    adjustable: scene.adjustable ?? true,
  }));
}

async function loadStaticPanoramaTemplateSamples() {
  const results = await Promise.allSettled(
    staticPanoramaTemplateManifests.map(async (project) => {
      const response = await fetch(project.manifestUrl);
      if (!response.ok) {
        throw new Error(`无法读取模板 manifest：${project.manifestUrl}`);
      }
      return createSampleFromStaticPanoramaManifest(project, await response.json());
    })
  );

  let firstTemplate = null;
  const loadedStyleSamples = [];
  results.forEach((result) => {
    if (result.status !== "fulfilled") {
      console.warn("Static panorama template load failed:", result.reason);
      return;
    }
    const styleSamples = Array.isArray(result.value) ? result.value : [result.value];
    firstTemplate = firstTemplate || styleSamples[0];
    loadedStyleSamples.push(...styleSamples);
  });

  if (!firstTemplate) {
    return;
  }

  availableStyleSamples = loadedStyleSamples;
  activeStyleSampleId = firstTemplate.id;
  renderStyleList();
}

function createSampleFromStaticPanoramaManifest(project, manifest) {
  return (manifest.scenes || []).map((scene, index) => {
    const name = formatCompleteTemplateSceneName(scene, index);
    const image = `${project.assetBaseUrl}${scene.image}`;
    const category = String(scene.category || scene.case_category || "").trim() || inferTemplateCaseCategory(scene, name);
    const serial = String(index + 1).padStart(2, "0");
    const caseName = `${category} ${serial}`;
    const caseId = `${project.sampleId}-${scene.id || serial}`;
    const panoramaScene = {
      id: scene.id || `template-scene-${index + 1}`,
      scene_id: scene.id || `template-scene-${index + 1}`,
      name,
      roomName: name,
      image,
      preview: `${project.assetBaseUrl}${scene.thumb || scene.image}`,
      alt: `${caseName} ${name}`,
      fit: "cover",
      width: scene.width || 2048,
      height: scene.height || 1024,
      roomId: scene.room_type || `scene-${index + 1}`,
      source_provider: "provided_panorama_asset",
      sourceProvider: "provided_panorama_asset",
      quality_status: "production",
      qualityStatus: "production",
      deliverable: true,
      shot_type: "panorama",
      projection: "equirectangular",
      adjustable: true,
      quality_notes: ["完整真实 2:1 全景模板资源，可用于风格浏览、风格参考和后续局部修图；未匹配用户户型，不能直接作为新增方案终版交付。"],
    };
    const sampleBase = {
      id: caseId,
      name: caseName,
      style: category,
    };
    const vrPackage = normalizeVrPackage(
      {
        project_id: caseId,
        project_name: caseName,
        version_id: `template-${caseId}-v1`,
        scenes: [panoramaScene],
        floor_map_points: [{
          sceneId: panoramaScene.id,
          roomId: panoramaScene.roomId,
          name: panoramaScene.name,
          x: 50,
          y: 50,
        }],
        source_provider: "provided_panorama_asset",
        quality_status: "production",
        deliverable: true,
        production_blockers: ["当前是外部真实全景风格参考，尚未匹配用户户型，不能作为新增方案终版交付。"],
        share_meta: {
          title: `${caseName} · ${name}`,
          sceneCount: 1,
          templateOnly: true,
        },
      },
      sampleBase,
      1
    );
    const version = {
      id: vrPackage.versionId,
      number: 1,
      title: "真实全景风格 V1",
      status: "真实全景风格 V1",
      qualityStatus: "production",
      deliverable: true,
      productionBlockers: vrPackage.productionBlockers,
      createdAt: "模板库导入",
      summary: `${caseName} 已接入真实 2:1 全景图，可直接 VR 查看；当前用于风格浏览、分类检索和后续局部修改流程。`,
      adjustments: [],
      scenes: [panoramaScene],
      vrPackage,
    };
    return {
      id: caseId,
      name: caseName,
      title: name,
      status: "点击查看 VR",
      area: "风格参考",
      style: category,
      delivery: "真实 2:1 VR全景",
      summary: version.summary,
      templateOnly: true,
      caseCategory: category,
      sourceProject: project.name,
      sourceSceneName: String(scene?.name || ""),
      phase: "review",
      rooms: [panoramaScene],
      initialScenes: [panoramaScene],
      plannedScenes: [panoramaScene],
      panoramaScenes: [panoramaScene],
      versions: [version],
      activeVersionId: version.id,
      adjustments: [],
    };
  });
}

function formatCompleteTemplateSceneName(scene, index) {
  const rawName = String(scene?.name || "").replace(/\s*全景$/, "").trim();
  const serial = String(index + 1).padStart(2, "0");
  if (!rawName) {
    return `全景点位 ${serial}`;
  }
  return `${rawName} ${serial}`;
}

function inferTemplateCaseCategory(scene, fallbackName = "") {
  const text = `${scene?.name || ""} ${fallbackName}`;
  if (/现代奶油|奶油/.test(text)) return "现代奶油风";
  if (/现代意式|意式/.test(text)) return "现代意式";
  if (/现代轻奢|轻奢/.test(text)) return "现代轻奢";
  if (/侘寂|诧寂/.test(text)) return "侘寂风";
  if (/北欧/.test(text)) return "北欧风";
  if (/工业|loft/i.test(text)) return "工业风";
  if (/美式/.test(text)) return "美式风";
  if (/意式/.test(text)) return "现代意式";
  if (/极简/.test(text)) return "现代极简";
  if (/现代轻奢|轻奢/.test(text)) return "现代轻奢";
  if (/简约|简欧/.test(text)) return "现代简约";
  if (/中古/.test(text)) return "中古风";
  if (/新中式|中式|宋式|红木/.test(text)) return "新中式";
  if (/法式|轻法/.test(text)) return "轻法式";
  if (/复古/.test(text)) return "复古风";
  if (/原木/.test(text)) return "原木风";
  if (/欧式|美式|西班牙/.test(text)) return "欧式美式";
  if (/藏式|侘寂|诧寂/.test(text)) return "特色风格";
  return "现代简约";
}

function formatLibrarySceneName(scene, index) {
  const plannedNames = ["客餐厅全景", "主卧全景", "厨房全景", "卫生间全景", "入户全景", "次卧全景"];
  const rawName = String(scene?.name || "").trim();
  if (!rawName || /现代意式风全景|真实全景|风全景$/i.test(rawName)) {
    return plannedNames[index] || `真实全景 ${index + 1}`;
  }
  return rawName.endsWith("全景") ? rawName : `${rawName}全景`;
}

function bindNavigation() {
  document.querySelectorAll("[data-go-tab]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      if (requiresLoginForTab(button.dataset.goTab) && !isAccountLoggedIn) {
        openLoginDialog(button.dataset.goTab);
        return;
      }
      setTab(button.dataset.goTab);
    });
  });

  loginButton?.addEventListener("click", handleLoginAction);
  accountButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleAccountMenu();
  });
  accountMenu?.addEventListener("click", (event) => event.stopPropagation());
  logoutButton?.addEventListener("click", clearPicWishAccount);
  document.addEventListener("click", closeAccountMenu);
  loginCloseButton?.addEventListener("click", closeLoginDialog);
  loginForm?.addEventListener("submit", handleLoginSubmit);
  loginDialog?.addEventListener("click", (event) => {
    if (event.target === loginDialog) {
      closeLoginDialog();
    }
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && loginDialog && !loginDialog.hidden) {
      closeLoginDialog();
    }
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

function bindStyleLibraryTools() {
  styleSearchInput?.addEventListener("input", () => {
    styleSearchQuery = styleSearchInput.value.trim();
    renderStyleList();
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
  inlineVrStage?.addEventListener("pointerdown", handleInlineVrPointerDown);
  inlineVrStage?.addEventListener("pointermove", handleInlineVrPointerMove);
  inlineVrStage?.addEventListener("pointerup", handleInlineVrPointerUp);
  inlineVrStage?.addEventListener("pointercancel", handleInlineVrPointerUp);
  inlineVrStage?.addEventListener("wheel", handleInlineVrWheel, { passive: false });
  inlineVrAutoButton?.addEventListener("click", toggleInlineVrAutoRotate);
  inlineVrResetButton?.addEventListener("click", resetInlineVrView);
  inlineVrFullscreenButton?.addEventListener("click", openInlineVrFullscreen);
  manualAdjustmentInput?.addEventListener("input", handleManualAdjustmentInput);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !effectBriefViewer?.hidden) {
      closeEffectBriefViewer();
    }
    if (event.key === "Escape" && panoramaViewer && !panoramaViewer.hidden) {
      closePanoramaViewer();
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

  syncDesignIdeaForSelectedStyle();
  clearGenerationStatus();
  updateGenerateState();
}

function syncDesignIdeaForSelectedStyle() {
  if (!designIdeaInput || !selectedStyleId) {
    return;
  }

  designIdeaInput.value = getDesignIdeaForStyle(selectedStyleId);
}

function getDesignIdeaForStyle(styleId) {
  if (shouldUseEffectBriefAsDesignIdea(styleId)) {
    return normalizeEffectBriefText(effectBriefDocument.content);
  }

  return stylePackages[styleId]?.defaultIdea || "";
}

function shouldUseEffectBriefAsDesignIdea(styleId) {
  const briefStyleId = effectBriefDocument?.parsed?.styleId || "";
  return Boolean(styleId && briefStyleId && styleId === briefStyleId && effectBriefDocument?.content?.trim());
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
    title: "正在生成第一版方案",
    messages: [effectBriefDocument ? "解析户型图和效果说明" : "解析户型图和默认设计想法", `套用${stylePackage.label}风格规则`, "生成整屋设计状态和各区域全景任务"],
  });
  updateGenerateState();

  try {
    const draft = await createProjectDraftFromBackend(floorFile, selectedStyleId, stylePackage);
    validateDraftAgainstEffectBrief(draft);
    const generatedStylePackage = stylePackages[draft?.design_plan?.style] || stylePackage;
    const sample = buildGeneratedSampleFromDraft(draft, generatedStylePackage, floorFile);
    setGenerationStatus({
      status: "running",
      title: "正在生成第一版 VR 全景",
      messages: ["读取各区域真实全景任务", "生成 2:1 全景图", "组合第一版 VR package"],
    });
    const panoramaResult = await renderRealPanoramaVersionWithBackend(sample, setInitialPanoramaJobProgressStatus);
    const version = buildFinalVersion(sample, panoramaResult);
    applyVersionToSample(sample, version, panoramaResult);
    await persistProjectVersion(sample, version, panoramaResult);
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
      title: "已生成第一版方案",
      messages: [`${sample.name} · ${version.title}`, "已同步到方案库，所有用户都可以查看。"],
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
    throw new Error("未配置本地后端地址，无法生成第一版方案。");
  }

  const formData = new FormData();
  const effectiveStyleId = stylePackages[styleId] ? styleId : (effectBriefDocument?.parsed?.styleId || "cream");
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

async function renderRealPanoramaVersionWithBackend(sample, onProgress = () => {}, options = {}) {
  const apiBaseUrl = getApiBaseUrl();
  const config = sample.externalPanoramaImport;
  if (!apiBaseUrl) {
    throw new Error("未配置本地后端地址，无法生成真实全景图。");
  }
  if (!config?.sourceProvider || !config?.project) {
    throw new Error("当前方案没有配置真实全景生成来源。");
  }

  const response = await fetch(`${apiBaseUrl}/api/v1/panorama-generation/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source_provider: config.sourceProvider,
      project: options.project || config.project,
      project_name: config.projectName || sample.name,
      style: config.style || "modern_minimal",
      max_scenes: options.maxScenes || config.maxScenes || 4,
      level: config.level || 2,
      output_width: config.outputWidth || 2048,
      timeout: config.timeout || (config.sourceProvider === "ai_panorama_renderer" ? 1800 : 20),
      rooms: Array.isArray(options.rooms) ? options.rooms : (Array.isArray(config.rooms) ? config.rooms : undefined),
      render_spec: getBaseRenderSpecForFinalGeneration(sample),
      adjustments: Array.isArray(options.adjustments) ? options.adjustments : sample.adjustments || [],
      picwish_authorization: getPicWishAuthorization(),
    }),
  });
  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  const job = await response.json();
  currentRenderJobId = job.job_id || "";
  return pollPanoramaGenerationJob(apiBaseUrl, job.job_id, onProgress);
}

function setInitialPanoramaJobProgressStatus(job) {
  if (!job || !["queued", "running"].includes(job.status)) {
    return;
  }

  const percent = Math.max(0, Math.min(Math.round((Number(job.progress) || 0) * 100), 99));
  const total = Number(job.total_shots) || 0;
  const completed = Number(job.completed_shots) || 0;
  const scope = total ? `${completed}/${total} 个区域` : "各区域";
  const step = job.current_step || "正在生成第一版真实全景图";
  setGenerationStatus({
    status: "running",
    title: `正在生成第一版 VR 全景 · ${percent}%`,
    messages: [`${scope} · ${step}`],
  });
}

function getBaseRenderSpecForFinalGeneration(sample) {
  const activeVersion = getActiveVersion(sample);
  return activeVersion?.renderSpec || sample?.draft?.render_spec || null;
}

async function pollPanoramaGenerationJob(apiBaseUrl, jobId, onProgress) {
  if (!jobId) {
    throw new Error("后端没有返回真实全景生成任务编号。");
  }

  while (true) {
    await wait(1000);
    const response = await fetch(`${apiBaseUrl}/api/v1/panorama-generation/jobs/${encodeURIComponent(jobId)}`);
    if (!response.ok) {
      throw new Error(await readApiError(response));
    }

    const job = await response.json();
    onProgress(job);

    if (job.status === "complete") {
      return {
        status: "complete",
        version_id: job.version_id,
        scenes: [],
        vr_package: job.vr_package || null,
        render_spec: job.render_spec || getBaseRenderSpecForFinalGeneration(getActiveSample()),
        messages: job.messages || [],
      };
    }

    if (job.status === "error") {
      throw new Error(job.error || job.messages?.[0] || "真实全景图生成失败。");
    }

    if (job.status === "cancelled") {
      const error = new Error("已停止当前真实全景图生成。");
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
  const effectBriefText = shouldUseEffectBriefAsDesignIdea(selectedStyleId) ? effectBriefDocument?.content?.trim() : "";
  const ideaDuplicatesBrief = effectBriefText && normalizeEffectBriefText(idea) === normalizeEffectBriefText(effectBriefText);
  const wholeHomeBrief = ideaDuplicatesBrief
    ? "以效果说明文档为主生成第一版方案。"
    : idea || "根据户型自动生成第一版动线、材质、家具、灯光和镜头策略。";

  return [
    `项目名称：${projectName}`,
    effectBriefText ? "效果说明文档：" : "",
    effectBriefText || "",
    `设计风格：${stylePackage.label}`,
    stylePackage.defaultTemplate ? `风格模板：${stylePackage.defaultTemplate.label}` : "",
    stylePackage.defaultTemplate?.adjustable?.length ? `模板可调整项：${stylePackage.defaultTemplate.adjustable.join("、")}` : "",
    "重点空间：",
    `1. 整体：${wholeHomeBrief}`,
    "真实全景方案要求：",
    "1. 生成 2D 户型图、关键空间全景点位、材质策略、真实全景生成任务和 VR 交付任务。",
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
  const sampleId = `ai-${slugifyProjectId(name)}-${draft?.design_plan?.style || selectedStyleId || "style"}`;

  return {
    id: sampleId,
    name,
    title: `${styleLabel}第一版`,
    phase: "initial",
    status: "V1 · 正在生成VR全景",
    area: formatDraftArea(draft),
    style: styleLabel,
    delivery: "第一版 VR 全景",
    summary: buildDraftSummary(file.name, styleLabel, stats, idea),
    designerOnly: true,
    rooms: [floorPlanScene],
    initialScenes: [floorPlanScene],
    plannedScenes,
    externalPanoramaImport: buildGeneratedSamplePanoramaImport(sampleId, name, draft),
    adjustments: [],
    versions: [],
    activeVersionId: "",
    draft,
  };
}

function buildGeneratedSamplePanoramaImport(sampleId, projectName, draft) {
  const renderSpec = draft?.render_spec || {};
  const visualTaskCount = Array.isArray(renderSpec.panorama_visual_tasks)
    ? renderSpec.panorama_visual_tasks.length
    : 0;
  const panoramaShotCount = Array.isArray(renderSpec.camera_shots)
    ? renderSpec.camera_shots.filter((shot) => shot?.shot_type === "panorama").length
    : 0;
  return {
    project: sampleId,
    projectName,
    sourceProvider: "ai_panorama_renderer",
    style: draft?.design_plan?.style || selectedStyleId || "modern_minimal",
    maxScenes: Math.max(visualTaskCount || panoramaShotCount || 1, 1),
    outputWidth: 3840,
    timeout: 1800,
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
    visualTaskCount: (renderSpec.panorama_visual_tasks || metadata.panorama_visual_tasks || []).length,
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
  return `已基于 ${fileName} 和 ${styleLabel} 生成第一版方案：识别 ${stats.roomCount} 个空间、${stats.wallCount} 段墙体、${stats.openingCount} 个门窗，输出 ${stats.materialCount} 类材质、${stats.assetCount} 个设计意图、${stats.cameraCount} 个镜头任务和 ${stats.visualTaskCount} 个真实全景生成任务。${ideaText}`;
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
          "状态：待调整对象，未生成真实全景图",
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
          "状态：待调整对象，未生成真实全景图",
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
  if (normalized.includes("living") || normalized.includes("客厅") || normalized.includes("客餐厅")) {
    return "客餐厅";
  }
  if (normalized.includes("master") || normalized.includes("主卧")) {
    return "主卧";
  }
  if (normalized.includes("second") || normalized.includes("次卧")) {
    return "次卧";
  }
  if (normalized.includes("bedroom") || normalized.includes("卧")) {
    return "卧室";
  }
  if (normalized.includes("kitchen") || normalized.includes("厨房")) {
    return "厨房";
  }
  if (normalized.includes("dining") || normalized.includes("餐厅")) {
    return "餐厅";
  }
  if (normalized.includes("entry") || normalized.includes("玄关") || normalized.includes("入户")) {
    return "玄关";
  }
  if (normalized.includes("bath") || normalized.includes("卫生间") || normalized.includes("卫浴")) {
    return "卫生间";
  }
  if (normalized.includes("bird")) {
    return "全屋鸟瞰";
  }
  return String(label || "场景").replace(/panorama/gi, "").replace(/_/g, " ").trim();
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

function getManualAdjustmentNote(sceneId) {
  return String(manualAdjustmentNotes[sceneId] || "").trim();
}

function hasManualAdjustmentNote(sceneId) {
  return Boolean(getManualAdjustmentNote(sceneId));
}

function handleManualAdjustmentInput(event) {
  const sample = getActiveSample();
  const scene = sample ? getActiveAdjustScene(sample) : null;
  if (!scene) {
    return;
  }
  const value = event.currentTarget.value;
  if (value.trim()) {
    manualAdjustmentNotes[scene.id] = value;
  } else {
    delete manualAdjustmentNotes[scene.id];
  }
  updateRenderActionState(sample, scene);
}

function buildManualAdjustment(scene) {
  const note = getManualAdjustmentNote(scene?.id);
  if (!note) {
    return null;
  }
  return {
    id: `manual-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    action: "manual",
    label: "手动说明",
    sceneId: scene?.id || "",
    sceneName: scene?.name || "当前场景",
    targetRoomId: scene?.target_room_id || scene?.roomId || "",
    promptDelta: note,
    style: getActiveSample()?.style || "",
    createdAt: new Date().toLocaleString("zh-CN", { hour12: false }),
  };
}

function clearCurrentAdjustments() {
  const sample = getActiveSample();
  if (!sample) {
    return;
  }

  sample.adjustments = [];
  const scene = getActiveAdjustScene(sample);
  if (scene) {
    delete manualAdjustmentNotes[scene.id];
  }
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
  if (sample.templateOnly) {
    saveTemplateEditIntent(sample);
    return;
  }

  const activeScene = getActiveAdjustScene(sample);
  const runAdjustments = collectCurrentSceneAdjustments(sample, activeScene);
  if (!runAdjustments.length) {
    setRenderStatus({
      status: "error",
      title: "先填写调整内容",
      messages: ["选择一个调整项，或在补充说明里写清楚希望当前区域如何变化。"],
    });
    renderScheme();
    return;
  }
  const confirmed = window.confirm(`确定重新生成「${activeScene?.name || "当前区域"}」吗？系统会基于当前版本生成 V${(sample.versions || []).length + 1}，原版本会保留。`);
  if (!confirmed) {
    return;
  }
  if (!canGenerateRealPanoramas(sample)) {
    setRenderStatus({
      status: "error",
      title: "缺少真实全景生成来源",
      messages: ["当前方案没有可用的真实全景生成配置；请先从新建方案生成 V1，或接入真实 2:1 全景资源。"],
    });
    renderScheme();
    return;
  }

  const originalAdjustments = sample.adjustments || [];
  sample.adjustments = runAdjustments;
  isRenderingFinal = true;
  isStoppingRender = false;
  currentRenderJobId = "";
  setRenderStatus({
    status: "running",
    title: "正在重新生成当前全景图",
    messages: [`读取 ${activeScene?.name || "当前区域"} 的调整要求`, "生成新的 2:1 全景图", "合并为新的整屋 VR 版本"],
  });
  renderScheme();

  try {
    const rawResult = await renderRealPanoramaVersionWithBackend(sample, setRealPanoramaJobProgressStatus, buildRoomRegenerationOptions(sample, activeScene, runAdjustments));
    const result = mergeRoomRegenerationResult(sample, rawResult, activeScene);
    const version = buildFinalVersion(sample, result);
    applyVersionToSample(sample, version, result);
    await persistProjectVersion(sample, version, result);
    if (activeScene?.id) {
      delete manualAdjustmentNotes[activeScene.id];
    }

    setRenderStatus({
      status: "complete",
      title: "当前区域已重新生成",
      messages: [`${version.title} 已同步到方案库。`, "所有用户进入该案例时都会看到最新版本记录。"],
    });
    renderSampleList();
    renderScheme();
    setSchemePane("preview");
  } catch (error) {
    if (error?.name === "RenderCancelledError") {
      sample.adjustments = originalAdjustments;
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
      title: "当前区域重新生成失败",
      messages: [formatGenerationError(error)],
    });
    sample.adjustments = originalAdjustments;
    renderScheme();
  } finally {
    isRenderingFinal = false;
    isStoppingRender = false;
    currentRenderJobId = "";
    renderScheme();
  }
}

function collectCurrentSceneAdjustments(sample, scene) {
  if (!scene) {
    return [];
  }
  const selected = (sample.adjustments || []).filter((item) => item.sceneId === scene.id);
  const manual = buildManualAdjustment(scene);
  return manual ? [...selected, manual] : selected;
}

function buildRoomRegenerationOptions(sample, scene, adjustments) {
  const versionNumber = (sample.versions || []).length + 1;
  const room = buildRegenerationRoomTask(sample, scene, adjustments);
  return {
    project: `${sample.id}-v${versionNumber}-${slugifyProjectId(scene?.id || "room")}`,
    maxScenes: 1,
    rooms: [room],
    adjustments,
  };
}

function buildRegenerationRoomTask(sample, scene, adjustments) {
  const promptDeltas = adjustments.map((item) => item.promptDelta || item.label).filter(Boolean);
  const roomName = scene?.roomName || scene?.name || "当前区域";
  const sourceImageUrl = normalizePanoramaSourceImageUrl(scene?.image || scene?.panorama_url || "");
  return {
    id: scene?.id || slugifyProjectId(roomName),
    room_id: scene?.roomId || scene?.target_room_id || scene?.id || "",
    name: roomName.replace(/\s*调整$/, "").replace(/\s*全景$/, ""),
    prompt: [
      `重新生成${sample.name}的${roomName} 2:1 equirectangular 360 VR全景图。`,
      `保持${sample.style}，保持当前整屋地面、墙面、门套、灯光和黑白灰材质连续。`,
      promptDeltas.length ? `本次调整：${promptDeltas.join("；")}。` : "",
      "只改变当前区域，不改变整屋风格，不生成普通透视图。"
    ].filter(Boolean).join(""),
    negative_prompt: "不要普通透视图，不要竖图，不要人物文字水印，不要破坏相邻空间连续性。",
    source_resource_ids: scene?.sourceResourceIds || scene?.source_resource_ids || [],
    source_image_url: sourceImageUrl,
  };
}

function normalizePanoramaSourceImageUrl(value) {
  const url = String(value || "").trim();
  if (!url || url.startsWith("data:")) {
    return "";
  }
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  try {
    return new URL(url, window.location.href).href;
  } catch (error) {
    return "";
  }
}

function mergeRoomRegenerationResult(sample, result, targetScene) {
  const activeVersion = getActiveVersion(sample);
  const basePackage = activeVersion?.vrPackage || buildVrPackageFromScenes(sample, activeVersion?.scenes || [], activeVersion?.id || "");
  const generatedScene = result.vr_package?.scenes?.[0] || result.scenes?.[0];
  if (!basePackage?.scenes?.length || !generatedScene || !targetScene) {
    return result;
  }
  const targetId = targetScene.id || targetScene.sceneId;
  const targetRoomId = targetScene.roomId || targetScene.room_id || targetScene.target_room_id;
  const patchedScene = {
    ...generatedScene,
    id: targetId,
    scene_id: targetId,
    sceneId: targetId,
    room_id: targetRoomId || generatedScene.room_id || generatedScene.roomId,
    roomId: targetRoomId || generatedScene.roomId || generatedScene.room_id,
    name: targetScene.name || generatedScene.name,
  };
  const nextScenes = basePackage.scenes.map((scene) => {
    const sceneId = scene.id || scene.sceneId || scene.scene_id;
    const sceneRoomId = scene.roomId || scene.room_id;
    return sceneId === targetId || (targetRoomId && sceneRoomId === targetRoomId) ? patchedScene : scene;
  });
  return {
    ...result,
    vr_package: {
      ...basePackage,
      scenes: nextScenes,
      version_id: result.version_id || `final-${Date.now()}`,
      versionId: result.version_id || `final-${Date.now()}`,
      deliverable: true,
      quality_status: "production",
      qualityStatus: "production",
      production_blockers: [],
      productionBlockers: [],
    },
    render_spec: result.render_spec || getBaseRenderSpecForFinalGeneration(sample),
  };
}

async function confirmAndStopRender() {
  if (!currentRenderJobId || isStoppingRender) {
    return;
  }

  const shouldStop = window.confirm("确定停止当前重新生成任务吗？已完成但尚未写入版本的结果不会保存。");
  if (!shouldStop) {
    return;
  }

  isStoppingRender = true;
  renderScheme();
  setRenderStatus({
    status: "running",
    title: "正在停止生成",
    messages: ["正在通知后端终止当前重新生成任务"],
  });

  try {
    const apiBaseUrl = getApiBaseUrl();
    if (!currentRenderJobId.startsWith("pano-")) {
      throw new Error("当前任务不是生产级真实全景生成任务，无法执行停止操作。");
    }
    const response = await fetch(`${apiBaseUrl}/api/v1/panorama-generation/jobs/${encodeURIComponent(currentRenderJobId)}/cancel`, {
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

function saveTemplateEditIntent(sample) {
  if (!(sample.adjustments || []).length) {
    setRenderStatus({
      status: "error",
      title: "先选择局部修改项",
      messages: ["在左侧选择一个空间，再勾选需要修改的内容；当前阶段先记录修改意图，后续接入 AI 修图后再生成新图。"],
    });
    renderScheme();
    return;
  }

  const activeVersion = getActiveVersion(sample);
  const baseScenes = activeVersion?.scenes?.length ? activeVersion.scenes : getPreviewScenes(sample);
  const baseVrPackage = activeVersion?.vrPackage || buildVrPackageFromScenes(sample, baseScenes, activeVersion?.id || `template-${sample.id}-base`);
  const versionNumber = (sample.versions || []).length + 1;
  const versionId = `template-edit-${sample.id}-${Date.now()}`;
  const version = {
    id: versionId,
    number: versionNumber,
    title: `局部修改意图 V${versionNumber}`,
    status: `局部修改意图 V${versionNumber}`,
    qualityStatus: baseVrPackage.qualityStatus,
    deliverable: true,
    productionBlockers: ["当前仅保存局部修改意图，尚未接入 AI 修图生成新全景图。"],
    createdAt: new Date().toLocaleString("zh-CN", { hour12: false }),
    summary: buildTemplateEditSummary(sample),
    adjustments: [...sample.adjustments],
    scenes: baseScenes,
    vrPackage: {
      ...baseVrPackage,
      versionId,
      versionTitle: `局部修改意图 V${versionNumber}`,
      deliverable: true,
      productionBlockers: ["当前仅保存局部修改意图，尚未接入 AI 修图生成新全景图。"],
      shareMeta: {
        ...(baseVrPackage.shareMeta || {}),
        title: `${sample.name} 局部修改意图`,
        editIntentOnly: true,
      },
    },
  };

  sample.versions = [...(sample.versions || []), version];
  sample.activeVersionId = version.id;
  sample.status = "模板库 · 已记录修改意图";
  sample.adjustments = [];
  setRenderStatus({
    status: "complete",
    title: "已保存局部修改意图",
    messages: ["当前没有重新生成图片；下一步接入 AI 修图接口后，会把这些意图转成局部重绘任务。"],
  });
  renderSampleList();
  renderScheme();
  setSchemePane("versions");
}

function buildTemplateEditSummary(sample) {
  const grouped = (sample.adjustments || []).reduce((items, adjustment) => {
    const key = adjustment.sceneName || "当前场景";
    items[key] = [...(items[key] || []), adjustment.label];
    return items;
  }, {});
  const parts = Object.entries(grouped).map(([sceneName, labels]) => `${sceneName}：${labels.join("、")}`);
  return `已记录 ${parts.length} 个空间的局部修改意图。${parts.join("；")}。`;
}

function setRealPanoramaJobProgressStatus(job) {
  if (!job || !["queued", "running"].includes(job.status)) {
    return;
  }

  const percent = Math.max(0, Math.min(Math.round((Number(job.progress) || 0) * 100), 99));
  const total = Number(job.total_shots) || 0;
  const completed = Number(job.completed_shots) || 0;
  const scope = total ? `${completed}/${total} 个区域` : "各区域";
  const step = job.current_step || "正在生成真实全景图";
  setRenderStatus({
    status: "running",
    title: `正在生成真实全景图 · ${percent}%`,
    messages: [`${scope} · ${step}`],
  });
}

function buildFinalVersion(sample, result) {
  const versionNumber = (sample.versions || []).length + 1;
  const sourceScenes = result.vr_package?.scenes?.length ? result.vr_package.scenes : result.scenes || [];
  const scenes = sourceScenes.map((scene, index) => normalizeFinalScene({ ...scene, name: formatGeneratedSceneName(scene, index) }, sample));
  const vrPackage = result.vr_package?.scenes?.length
    ? normalizeVrPackage(result.vr_package, sample, versionNumber)
    : buildVrPackageFromScenes(sample, scenes, result.version_id || `final-${Date.now()}`);
  const deliverable = isDeliverableVrPackage(vrPackage);
  const realPanorama = isRealPanoramaPackage(vrPackage);
  const versionTitle = deliverable
    ? `终版 VR V${versionNumber}`
    : realPanorama
      ? `真实全景资源 V${versionNumber}`
      : `不可交付预览 V${versionNumber}`;

  return {
    id: result.version_id || `final-${Date.now()}`,
    number: versionNumber,
    title: versionTitle,
    status: versionTitle,
    qualityStatus: vrPackage.qualityStatus,
    deliverable,
    productionBlockers: vrPackage.productionBlockers || [],
    createdAt: new Date().toLocaleString("zh-CN", { hour12: false }),
    summary: buildFinalVersionSummary(sample, scenes, versionNumber, deliverable, realPanorama),
    adjustments: [...(sample.adjustments || [])],
    renderSpec: result.render_spec || getBaseRenderSpecForFinalGeneration(sample),
    scenes,
    vrPackage,
  };
}

function applyVersionToSample(sample, version, result = {}) {
  sample.phase = version.deliverable ? "final" : "review";
  if (result.render_spec) {
    sample.draft = {
      ...(sample.draft || {}),
      render_spec: result.render_spec,
    };
  }
  sample.versions = [...(sample.versions || []), version];
  sample.activeVersionId = version.id;
  sample.status = `${version.title} · 已生成`;
  sample.delivery = isRealPanoramaPackage(version.vrPackage) || version.deliverable ? "真实 2:1 VR全景" : "不可交付预览";
  sample.rooms = version.scenes;
  sample.initialScenes = sample.initialScenes?.length ? sample.initialScenes : version.scenes;
  sample.plannedScenes = version.scenes;
  sample.panoramaScenes = version.vrPackage?.scenes || version.scenes;
  sample.adjustments = [];
  activeRoomId = version.scenes[0]?.id || activeRoomId;
  activeAdjustSceneId = version.scenes[0]?.id || activeAdjustSceneId;
}

function formatGeneratedSceneName(scene, index) {
  return formatLibrarySceneName(scene, index);
}

function normalizeFinalScene(scene, sample) {
  const shotType = scene.shot_type || "panorama";
  const name = scene.name || (shotType === "panorama" ? formatVrPanoramaSceneName(scene) : formatReferenceSceneName(scene));
  return {
    id: scene.scene_id || scene.id,
    name,
    image: scene.panorama_url || scene.image,
    preview: scene.thumb_url || scene.preview || scene.panorama_url || scene.image,
    alt: `${sample.name} ${name} ${sample.style}`,
    shot_type: shotType,
    projection: scene.projection,
    width: scene.width,
    height: scene.height,
    roomId: scene.room_id || scene.target_room_id,
    hotspots: [],
    sourceProvider: scene.source_provider || scene.sourceProvider || "",
    qualityStatus: normalizeQualityStatus(scene.quality_status || scene.qualityStatus),
    deliverable: Boolean(scene.deliverable),
    qualityNotes: scene.quality_notes || scene.qualityNotes || [],
  };
}

function normalizeVrPackage(vrPackage, sample, versionNumber) {
  const qualityStatus = normalizeQualityStatus(vrPackage.quality_status || vrPackage.qualityStatus);
  const sourceProvider = vrPackage.source_provider || vrPackage.sourceProvider || vrPackage.share_meta?.sourceProvider || "";
  const realPanorama = isRealPanoramaProvider(sourceProvider);
  return {
    projectId: vrPackage.project_id || sample.id,
    projectName: vrPackage.project_name || sample.name,
    versionId: vrPackage.version_id || `final-${Date.now()}`,
    versionTitle: qualityStatus === "production"
      ? `终版 VR V${versionNumber}`
      : realPanorama
        ? `真实全景资源 V${versionNumber}`
        : `不可交付预览 V${versionNumber}`,
    scenes: (vrPackage.scenes || []).map((scene, index) => normalizeVrScene({ ...scene, name: formatGeneratedSceneName(scene, index) }, sample)),
    floorMapPoints: vrPackage.floor_map_points || [],
    shareMeta: vrPackage.share_meta || {},
    sourceProvider,
    qualityStatus,
    deliverable: realPanorama || (Boolean(vrPackage.deliverable || vrPackage.share_meta?.deliverable) && qualityStatus === "production"),
    productionBlockers: realPanorama ? [] : (vrPackage.production_blockers || vrPackage.productionBlockers || []),
  };
}

function buildVrPackageFromScenes(sample, scenes, versionId) {
  const panoramaScenes = scenes
    .filter((scene) => scene.shot_type === "panorama" && scene.image)
    .map((scene) => normalizeVrScene(scene, sample));
  const realPanorama = panoramaScenes.some((scene) => isRealPanoramaProvider(scene.sourceProvider));
  const deliverable = realPanorama || (panoramaScenes.length > 0 && panoramaScenes.every((scene) => scene.deliverable && scene.qualityStatus === "production"));
  const realProvider = panoramaScenes.find((scene) => isRealPanoramaProvider(scene.sourceProvider))?.sourceProvider || "provided_panorama_asset";
  const qualityStatus = deliverable ? "production" : "draft";
  return {
    projectId: sample.id,
    projectName: sample.name,
    versionId,
    versionTitle: "",
    scenes: panoramaScenes,
    floorMapPoints: panoramaScenes.map((scene, index) => ({
      sceneId: scene.id,
      roomId: scene.roomId,
      name: scene.name,
      ...resolveSampleFloorMapPoint(sample, scene, index, panoramaScenes.length),
    })),
    shareMeta: {
      title: deliverable ? `${sample.name} VR 全景方案` : realPanorama ? `${sample.name} 真实全景资源` : `${sample.name} 不可交付预览`,
      sceneCount: panoramaScenes.length,
      qualityStatus,
      deliverable,
    },
    sourceProvider: realPanorama || deliverable ? realProvider : "non_deliverable_preview",
    qualityStatus,
    deliverable,
    productionBlockers: deliverable
      ? []
      : ["当前结果不是真实 2:1 全景资产，不能作为客户终版交付。"],
  };
}

function resolveSampleFloorMapPoint(sample, scene, index, count) {
  const point = (sample?.floorMapPoints || sample?.floor_map_points || []).find((item) => {
    const sceneId = item.sceneId || item.scene_id;
    const roomId = item.roomId || item.room_id;
    return sceneId === scene.id || sceneId === scene.sceneId || roomId === scene.roomId || roomId === scene.room_id;
  });
  return point ? { x: point.x, y: point.y } : panoramaMapPoint(index, count);
}

function normalizeVrScene(scene, sample) {
  const id = scene.scene_id || scene.id;
  const name = scene.name || formatVrPanoramaSceneName(scene);
  const qualityStatus = normalizeQualityStatus(scene.quality_status || scene.qualityStatus);
  return {
    id,
    sceneId: id,
    roomId: scene.room_id || scene.roomId || scene.target_room_id,
    name,
    image: scene.panorama_url || scene.image,
    preview: scene.thumb_url || scene.preview || scene.panorama_url || scene.image,
    poster: scene.poster_url || scene.poster || scene.thumb_url || scene.preview || scene.panorama_url || scene.image,
    alt: `${sample.name} ${name} VR 全景`,
    shot_type: "panorama",
    projection: scene.projection || "equirectangular",
    width: scene.width || vrPreviewPanoramaWidth,
    height: scene.height || vrPreviewPanoramaHeight,
    hotspots: [],
    sourceProvider: scene.source_provider || scene.sourceProvider || "",
    providerTaskId: scene.provider_task_id || scene.providerTaskId || "",
    sourceResourceIds: scene.source_resource_ids || scene.sourceResourceIds || [],
    qualityStatus: isRealPanoramaProvider(scene.source_provider || scene.sourceProvider) ? "production" : qualityStatus,
    deliverable: isRealPanoramaProvider(scene.source_provider || scene.sourceProvider) || (Boolean(scene.deliverable) && qualityStatus === "production"),
    qualityNotes: scene.quality_notes || scene.qualityNotes || [],
  };
}

function formatVrPanoramaSceneName(scene) {
  const label = translateShotLabel(scene.label || scene.id).replace(/\s*全景$/, "");
  return `${label}全景`;
}

function formatReferenceSceneName(scene) {
  if (scene.shot_type === "bird_view") {
    return "全屋鸟瞰预览";
  }
  return `${translateShotLabel(scene.label || scene.id)}空间预览`;
}

function buildFinalVersionSummary(sample, scenes, versionNumber, deliverable = true, realPanorama = false) {
  const adjustmentCount = sample.adjustments?.length || 0;
  const vrCount = scenes.filter((scene) => scene.shot_type === "panorama").length;
  const versionType = deliverable ? "终版 VR" : realPanorama ? "真实全景资源" : "不可交付预览";
  const qualityNote = deliverable
    ? ""
    : "当前仅用于校验空间点位和 VR 交互，不能作为客户终版交付。";
  return `${sample.style}${versionType} V${versionNumber} 已生成 ${vrCount || scenes.length} 个空间全景。${adjustmentCount ? `本版应用 ${adjustmentCount} 条调整。` : "本版未额外调整。"}风格保持为 ${sample.style}。${qualityNote}`;
}

function normalizeQualityStatus(value) {
  return ["production", "review_required", "draft"].includes(value) ? value : "draft";
}

function isDeliverableVrPackage(vrPackage) {
  const locallyAcceptable = isVrPackageLocallyAcceptable(vrPackage);
  return locallyAcceptable && (isRealPanoramaPackage(vrPackage) || (Boolean(vrPackage?.deliverable) && vrPackage.qualityStatus === "production"));
}

function isVrPackageLocallyAcceptable(vrPackage) {
  const scenes = vrPackage?.scenes || [];
  if (!scenes.length) {
    return true;
  }
  return scenes.every((scene) => getSceneVrQualityReport(scene).status !== "review_required");
}

function isRealPanoramaPackage(vrPackage) {
  return isRealPanoramaProvider(vrPackage?.sourceProvider)
    || (vrPackage?.scenes || []).some((scene) => isRealPanoramaProvider(scene.sourceProvider));
}

function isRealPanoramaProvider(provider) {
  return ["provided_panorama_asset", "ai_panorama_renderer"].includes(provider);
}

function canGenerateRealPanoramas(sample) {
  return Boolean(sample?.externalPanoramaImport?.sourceProvider && sample?.externalPanoramaImport?.project);
}

function getVrQualityLabel(vrPackage) {
  if (isDeliverableVrPackage(vrPackage)) {
    return "可交付 VR 全景";
  }
  if (isRealPanoramaPackage(vrPackage)) {
    return "可交付 VR 全景";
  }
  if (vrPackage?.qualityStatus === "review_required") {
    return "可查看 VR 全景";
  }
  return "不可交付预览";
}

function getVrViewerConfig() {
  return APP_CONFIG.vrViewer || {};
}

function getRequestedVrViewerEngine() {
  return "photoSphere";
}

function loadStylesheetOnce(url, id) {
  if (!url) {
    return Promise.resolve();
  }
  if (document.getElementById(id)) {
    return Promise.resolve();
  }
  if (!photoSphereStylePromise) {
    photoSphereStylePromise = new Promise((resolve, reject) => {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = url;
      link.onload = resolve;
      link.onerror = () => reject(new Error(`Failed to load stylesheet: ${url}`));
      document.head.append(link);
    });
  }
  return photoSphereStylePromise;
}

function loadPhotoSphereModule() {
  const config = getVrViewerConfig().photoSphere || {};
  const moduleUrl = config.moduleUrl || "https://esm.sh/@photo-sphere-viewer/core@5?bundle";
  if (!photoSphereModulePromise) {
    photoSphereModulePromise = Promise.all([
      loadStylesheetOnce(config.stylesheetUrl, "photo-sphere-viewer-core-css"),
      import(moduleUrl),
    ]).then(([, module]) => module);
  }
  return photoSphereModulePromise;
}

function getSceneVrQualityReport(scene) {
  const width = Number(scene?.width) || 0;
  const height = Number(scene?.height) || 0;
  const ratio = width && height ? width / height : 0;
  const notes = [];
  if (!width || !height) {
    notes.push("缺少图片尺寸元数据");
  } else {
    if (Math.abs(ratio - 2) > 0.04) {
      notes.push("不是稳定 2:1 全景比例");
    }
    if (width < vrPreviewPanoramaWidth || height < vrPreviewPanoramaHeight) {
      notes.push(`低于本机演示 ${vrPreviewPanoramaWidth}x${vrPreviewPanoramaHeight}`);
    }
    if (width >= 8192 && height >= 4096) {
      notes.push("达到客户终版尺寸目标");
    }
  }
  const qualityNotes = scene?.qualityNotes || scene?.quality_notes || [];
  if (Array.isArray(qualityNotes)) {
    notes.push(...qualityNotes);
  }
  const status = notes.some((note) => note.includes("低于") || note.includes("不是稳定"))
    ? "review_required"
    : normalizeQualityStatus(scene?.qualityStatus || scene?.quality_status);
  return {
    width,
    height,
    ratio,
    status,
    label: width && height ? `${width}x${height}` : "尺寸待补",
    notes,
  };
}

function buildVrQualityReport(scenes) {
  return scenes.map((scene) => ({
    sceneId: scene.id,
    name: scene.name,
    sourceProvider: scene.sourceProvider || scene.source_provider || "",
    deliverable: Boolean(scene.deliverable),
    ...getSceneVrQualityReport(scene),
  }));
}

function updateWindowVrQualityReport(report) {
  window.__xspaceVrQualityReport = report;
  try {
    window.sessionStorage?.setItem("xspaceVrQualityReport", JSON.stringify(report));
  } catch {
    // Internal diagnostic only; VR viewing should not fail if storage is unavailable.
  }
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

  const title = document.createElement("strong");
  title.textContent = effectBriefDocument.fileName;

  const preview = document.createElement("small");
  preview.textContent = getEffectBriefPreview(effectBriefDocument.content);

  effectBriefSummary.append(title, preview);
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
  const styleId = inferStyleIdFromEffectBrief(normalizedContent, styleText);
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
    const backendStyleId = inferStyleIdFromEffectBrief(backendDesignBrief.raw_text || backendDesignBrief.design_style || "", backendDesignBrief.design_style);
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
  const detectedStyleId = effectBriefDocument?.parsed?.styleId || detectStyleFromEffectBrief(normalizedContent);
  if (detectedStyleId) {
    selectStylePackage(detectedStyleId);
    return;
  }

  if (designIdeaInput) {
    designIdeaInput.value = normalizedContent;
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
  return inferStyleIdFromEffectBrief(content, explicitStyle?.[1]);
}

function inferStyleIdFromEffectBrief(content, explicitStyleText = "") {
  const fullText = normalizeStyleMatchText(content);
  const explicitText = normalizeStyleMatchText(explicitStyleText);
  const scores = Object.fromEntries(Object.keys(stylePackages).map((styleId) => [styleId, 0]));

  Object.entries(effectBriefStyleAliases).forEach(([styleId, aliases]) => {
    aliases.forEach((alias) => {
      const normalizedAlias = normalizeStyleMatchText(alias);
      if (!normalizedAlias) {
        return;
      }
      if (explicitText === normalizedAlias) {
        scores[styleId] += 18 + normalizedAlias.length;
      } else if (explicitText && explicitText.includes(normalizedAlias)) {
        scores[styleId] += 12 + normalizedAlias.length;
      }
      if (fullText.includes(normalizedAlias)) {
        scores[styleId] += 4 + normalizedAlias.length;
      }
    });
  });

  Object.entries(effectBriefStyleSignals).forEach(([styleId, signals]) => {
    signals.forEach((signal) => {
      const normalizedSignal = normalizeStyleMatchText(signal);
      if (normalizedSignal && fullText.includes(normalizedSignal)) {
        scores[styleId] += 3;
      }
    });
  });

  const best = Object.entries(scores)
    .filter(([, score]) => score > 0)
    .sort((left, right) => right[1] - left[1])[0];
  return best?.[0] || "";
}

function findStyleIdInText(text) {
  const haystack = normalizeStyleMatchText(text);
  if (!haystack) {
    return "";
  }

  const matches = Object.entries(effectBriefStyleAliases)
    .flatMap(([styleId, aliases]) =>
      aliases.map((alias) => ({
        styleId,
        index: haystack.indexOf(normalizeStyleMatchText(alias)),
        weight: alias.length,
      }))
    )
    .filter((match) => match.index >= 0)
    .sort((left, right) => left.index - right.index || right.weight - left.weight);

  return matches[0]?.styleId || "";
}

function normalizeStyleMatchText(value) {
  return String(value || "").toLowerCase().replace(/\s+/g, "");
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
  const expectedStyleId = selectedStyleId || parsed.styleId || "";
  const shouldValidateBriefDetails = shouldUseEffectBriefAsDesignIdea(expectedStyleId);
  if (expectedStyleId) {
    const generatedStyleId = String(draft?.design_plan?.style || "").toLowerCase();
    if (generatedStyleId !== expectedStyleId) {
      errors.push(`风格应为 ${stylePackages[expectedStyleId]?.label || expectedStyleId}，实际生成 ${draft?.design_plan?.style_label || generatedStyleId || "未识别"}。`);
    }
  }

  if (shouldValidateBriefDetails && parsed.areaM2) {
    const parsedArea = parseEffectBriefArea(designBrief.area);
    if (!parsedArea) {
      errors.push("后端生成结果缺少效果说明中的户型面积。");
    } else if (!isCloseNumber(parsedArea, parsed.areaM2, 0.05)) {
      errors.push(`户型面积应为 ${parsed.areaM2}㎡，实际解析 ${parsedArea}㎡。`);
    }
  }

  if (shouldValidateBriefDetails && parsed.floorHeight) {
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

async function persistProjectVersion(sample, version, result = {}) {
  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl || !sample?.id || !version?.id) {
    throw new Error("方案已生成，但缺少后端地址或方案版本信息，无法同步到全局方案库。");
  }
  const response = await fetch(`${apiBaseUrl}/api/v1/projects/${encodeURIComponent(sample.id)}/versions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      project: serializeProjectForPersistence(sample),
      version: serializeVersionForPersistence(version),
      draft: sample.draft || null,
      generation_job_id: currentRenderJobId || result.job_id || result.generation_job_id || null,
      set_active: true,
    }),
  });
  if (!response.ok) {
    throw new Error(`方案已生成，但写入后端版本库失败：${await readApiError(response)}`);
  }
  const record = await response.json();
  const persistedSample = createSampleFromPersistedProject(record);
  if (persistedSample) {
    Object.assign(sample, persistedSample);
  }
  return record;
}

function serializeProjectForPersistence(sample) {
  return stripTransientProjectFields({
    ...sample,
    activeVersionId: sample.activeVersionId,
    versions: sample.versions || [],
    draft: sample.draft || null,
    externalPanoramaImport: sample.externalPanoramaImport || null,
  });
}

function serializeVersionForPersistence(version) {
  return stripTransientProjectFields(version);
}

function stripTransientProjectFields(value) {
  return JSON.parse(JSON.stringify(value, (key, item) => {
    if (key === "imageElement" || key === "texture" || key === "gl" || key === "buffer") {
      return undefined;
    }
    if (typeof File !== "undefined" && item instanceof File) {
      return undefined;
    }
    return item;
  }));
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

  const visibleBounds = getPreviewVisibleDataBounds(drawing.bounds);

  drawing.polylines.filter((polyline) => isDrawingPolylineVisible(polyline, visibleBounds)).forEach((polyline) => {
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

  drawing.circles.filter((circle) => isDrawingCircleVisible(circle, visibleBounds)).forEach((circle) => {
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

  drawing.lines.filter((line) => isDrawingLineVisible(line, visibleBounds)).forEach((line) => {
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

  drawing.points.filter((point) => isPointInsideBounds(point.position, visibleBounds)).forEach((point) => {
    const projected = projectFloorPointObject(point.position, drawing.bounds);
    svg.append(createSvgElement("circle", {
      cx: projected.x,
      cy: projected.y,
      r: 4,
      fill: floorPreviewColor(point.role),
    }));
  });

  drawing.texts.filter((text) => isPointInsideBounds(text.position, visibleBounds)).slice(0, 80).forEach((text) => {
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

function getPreviewVisibleDataBounds(bounds) {
  const width = Math.max(bounds.maxX - bounds.minX, 1);
  const height = Math.max(bounds.maxY - bounds.minY, 1);
  const padding = Math.max(width, height) * floorPreviewVisibleBoundsPaddingRatio;
  return {
    minX: bounds.minX - padding,
    minY: bounds.minY - padding,
    maxX: bounds.maxX + padding,
    maxY: bounds.maxY + padding,
  };
}

function isDrawingLineVisible(line, bounds) {
  return doBoundsIntersect(getPointBounds([line.start, line.end]), bounds);
}

function isDrawingPolylineVisible(polyline, bounds) {
  return doBoundsIntersect(getPointBounds(polyline.points), bounds);
}

function isDrawingCircleVisible(circle, bounds) {
  return doBoundsIntersect({
    minX: circle.center.x - circle.radius,
    minY: circle.center.y - circle.radius,
    maxX: circle.center.x + circle.radius,
    maxY: circle.center.y + circle.radius,
  }, bounds);
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

  const visibleBounds = getPreviewVisibleDataBounds(drawing.bounds);

  drawing.polylines.filter((polyline) => isDrawingPolylineVisible(polyline, visibleBounds)).forEach((polyline) => {
    const points = polyline.points.map((point) => projectFloorPoint(point, drawing.bounds)).join(" ");
    const tagName = polyline.closed ? "polygon" : "polyline";
    const fill = polyline.closed && polyline.role === "room_boundary" ? "rgb(94 154 135 / 0.08)" : "none";
    parts.push(`<${tagName} points="${points}" fill="${fill}" stroke="${floorPreviewColor(polyline.role)}" stroke-width="${floorPreviewStrokeWidth(polyline.role)}" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`);
  });

  drawing.circles.filter((circle) => isDrawingCircleVisible(circle, visibleBounds)).forEach((circle) => {
    const center = projectFloorPointObject(circle.center, drawing.bounds);
    const radius = Math.max(2, circle.radius * drawing.bounds.scale);
    parts.push(`<circle cx="${center.x}" cy="${center.y}" r="${radius}" fill="none" stroke="${floorPreviewColor(circle.role)}" stroke-width="${floorPreviewStrokeWidth(circle.role)}" vector-effect="non-scaling-stroke"/>`);
  });

  drawing.lines.filter((line) => isDrawingLineVisible(line, visibleBounds)).forEach((line) => {
    const start = projectFloorPointObject(line.start, drawing.bounds);
    const end = projectFloorPointObject(line.end, drawing.bounds);
    parts.push(`<line x1="${start.x}" y1="${start.y}" x2="${end.x}" y2="${end.y}" stroke="${floorPreviewColor(line.role)}" stroke-width="${floorPreviewStrokeWidth(line.role)}" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`);
  });

  drawing.points.filter((point) => isPointInsideBounds(point.position, visibleBounds)).forEach((point) => {
    const projected = projectFloorPointObject(point.position, drawing.bounds);
    parts.push(`<circle cx="${projected.x}" cy="${projected.y}" r="5" fill="${floorPreviewColor(point.role)}"/>`);
  });

  drawing.texts.filter((text) => isPointInsideBounds(text.position, visibleBounds)).slice(0, 80).forEach((text) => {
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
  if (!isPoint(position) || role !== "room_text") {
    return;
  }
  const label = cleanDxfRoomText(text);
  if (!label) {
    return;
  }
  drawing.texts.push({ position: normalizePoint(position), text: label, role, layer });
}

function cleanDxfRoomText(value) {
  return String(value ?? "")
    .replace(/\\P/g, " ")
    .replace(/\\~/g, " ")
    .replace(/\\[A-Za-z]+[^;]*;/g, "")
    .replace(/\\[A-Za-z]+/g, "")
    .replace(/[{}]/g, "")
    .replace(/;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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
  for (const roleSet of floorPreviewBoundsRolePriority) {
    const geometryItems = collectDrawingGeometryItems(drawing, (role) => roleSet.has(role));
    if (geometryItems.length > 0) {
      return focusDrawingBoundsPoints(geometryItems);
    }
  }

  const lineworkItems = collectDrawingGeometryItems(drawing);
  if (lineworkItems.length > 0) {
    return focusDrawingBoundsPoints(lineworkItems);
  }

  return [
    ...drawing.points.map((point) => point.position),
    ...drawing.texts.map((text) => text.position),
  ];
}

function collectDrawingGeometryPoints(drawing, roleFilter = null) {
  return collectDrawingGeometryItems(drawing, roleFilter).flatMap((item) => item.points);
}

function collectDrawingGeometryItems(drawing, roleFilter = null) {
  const shouldUse = (item) => !roleFilter || roleFilter(item.role);
  const items = [];

  drawing.lines.filter(shouldUse).forEach((line) => {
    items.push(createDrawingGeometryItem([line.start, line.end]));
  });

  drawing.polylines.filter(shouldUse).forEach((polyline) => {
    items.push(createDrawingGeometryItem(polyline.points));
  });

  drawing.circles.filter(shouldUse).forEach((circle) => {
    items.push(createDrawingGeometryItem([
      { x: circle.center.x - circle.radius, y: circle.center.y - circle.radius },
      { x: circle.center.x + circle.radius, y: circle.center.y + circle.radius },
    ]));
  });

  return items.filter(Boolean);
}

function createDrawingGeometryItem(points) {
  const validPoints = points.filter(isPoint);
  if (validPoints.length === 0) {
    return null;
  }

  const bounds = getPointBounds(validPoints);
  return {
    points: validPoints,
    bounds,
    center: {
      x: (bounds.minX + bounds.maxX) / 2,
      y: (bounds.minY + bounds.maxY) / 2,
    },
  };
}

function focusDrawingBoundsPoints(items) {
  const allPoints = items.flatMap((item) => item.points);
  if (items.length < floorPreviewFocusMinItemCount || allPoints.length < floorPreviewFocusMinPointCount) {
    return allPoints;
  }

  const overallBounds = getPointBounds(allPoints);
  const centerBounds = getExpandedCenterBounds(items);
  const focusedItems = items.filter((item) =>
    isPointInsideBounds(item.center, centerBounds) || doBoundsIntersect(item.bounds, centerBounds)
  );

  if (focusedItems.length < floorPreviewFocusMinItemCount) {
    return allPoints;
  }

  const focusedPoints = focusedItems.flatMap((item) => item.points);
  const focusedBounds = getPointBounds(focusedPoints);
  const overallArea = getBoundsArea(overallBounds);
  const focusedArea = getBoundsArea(focusedBounds);

  if (focusedArea <= 0 || overallArea <= 0 || focusedArea > overallArea * 0.72) {
    return allPoints;
  }

  return getBoundsCornerPoints(focusedBounds);
}

function getExpandedCenterBounds(items) {
  const centers = items.map((item) => item.center);
  const minX = getSortedQuantile(centers.map((point) => point.x), floorPreviewFocusQuantile);
  const maxX = getSortedQuantile(centers.map((point) => point.x), 1 - floorPreviewFocusQuantile);
  const minY = getSortedQuantile(centers.map((point) => point.y), floorPreviewFocusQuantile);
  const maxY = getSortedQuantile(centers.map((point) => point.y), 1 - floorPreviewFocusQuantile);
  const width = Math.max(maxX - minX, 1);
  const height = Math.max(maxY - minY, 1);
  const padding = Math.max(width, height) * floorPreviewFocusPaddingRatio;

  return [
    { x: minX - padding, y: minY - padding },
    { x: maxX + padding, y: maxY + padding },
  ].reduce((bounds, point) => expandPointBounds(bounds, point), null);
}

function getPointBounds(points) {
  return points.reduce((bounds, point) => expandPointBounds(bounds, point), null);
}

function expandPointBounds(bounds, point) {
  if (!bounds) {
    return { minX: point.x, minY: point.y, maxX: point.x, maxY: point.y };
  }
  return {
    minX: Math.min(bounds.minX, point.x),
    minY: Math.min(bounds.minY, point.y),
    maxX: Math.max(bounds.maxX, point.x),
    maxY: Math.max(bounds.maxY, point.y),
  };
}

function getSortedQuantile(values, quantile) {
  const sorted = values.filter(Number.isFinite).sort((left, right) => left - right);
  if (sorted.length === 0) {
    return 0;
  }
  const index = Math.min(sorted.length - 1, Math.max(0, Math.floor((sorted.length - 1) * quantile)));
  return sorted[index];
}

function isPointInsideBounds(point, bounds) {
  return bounds.minX <= point.x && point.x <= bounds.maxX && bounds.minY <= point.y && point.y <= bounds.maxY;
}

function doBoundsIntersect(left, right) {
  return left.minX <= right.maxX && left.maxX >= right.minX && left.minY <= right.maxY && left.maxY >= right.minY;
}

function getBoundsArea(bounds) {
  return Math.max(bounds.maxX - bounds.minX, 1) * Math.max(bounds.maxY - bounds.minY, 1);
}

function getBoundsCornerPoints(bounds) {
  return [
    { x: bounds.minX, y: bounds.minY },
    { x: bounds.maxX, y: bounds.maxY },
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

function requiresLoginForTab(tab) {
  return tab === "platform";
}

function setTab(tab) {
  if (!canUseDesignerWorkspace && isDesignerTab(tab)) {
    return;
  }
  if (requiresLoginForTab(tab) && !isAccountLoggedIn) {
    openLoginDialog(tab);
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

  navGroups.forEach((group) => {
    group.classList.toggle("is-active", Boolean(group.querySelector(".is-active")));
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
  return pane === "versions";
}

function isDesignerTab(tab) {
  const panel = panels.find((item) => item.dataset.panel === tab);
  return Boolean(panel?.hasAttribute("data-designer-panel"));
}

function renderSampleList() {
  const cards = [];

  if (showCreateCardInCaseLibrary && canUseDesignerWorkspace) {
    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "project-card add-project-card";
    addButton.innerHTML = `
      <span class="project-thumb add-project-thumb">
        <img src="./assets/showcase/new-plan-cover-cream.jpg" alt="新方案图纸与奶油风材质工作台" loading="lazy" />
      </span>
      <span class="project-body new-plan-body">
        <span class="project-eyebrow">开始</span>
        <span class="project-title-line">
          <strong>新方案</strong>
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
            <span>${getProjectSceneCount(sample)} 场景</span>
          </span>
        </span>
      `;
      button.addEventListener("click", () => {
        activeSampleId = sample.id;
        activeRoomId = getPreviewScenes(sample)[0]?.id || sample.rooms[0]?.id;
        activeAdjustSceneId = getAdjustableScenes(sample)[0]?.id || "";
        renderSampleList();
        renderScheme();
        setSchemePane(getPreferredSchemePaneForSample(sample));
        setTab("scheme-detail");
      });
      return button;
    })
  );

  if (!cards.length) {
    sampleList.replaceChildren(createLibraryEmptyState("暂无案例", "还没有可查看的原有案例。"));
    return;
  }
  sampleList.replaceChildren(...cards);
}

function renderStyleList() {
  if (!styleList) {
    return;
  }
  const visibleStyles = getVisibleStyleSamples();
  updateStyleLibraryStats(visibleStyles);
  renderStyleFilters();

  if (!visibleStyles.length) {
    styleList.replaceChildren(createLibraryEmptyState("没有匹配的风格", "换一个关键词，或切回全部分类。"));
    return;
  }

  styleList.replaceChildren(
    ...visibleStyles.map((sample) => {
      const room = getSampleCoverScene(sample);
      const button = document.createElement("button");
      button.type = "button";
      button.className = sample.id === activeStyleSampleId ? "style-card is-active" : "style-card";
      button.innerHTML = `
        <img src="${room.image}" alt="${room.alt}" loading="lazy" />
        <span class="style-card-copy">
          <strong>${getStyleCardTitle(sample)}</strong>
        </span>
      `;
      button.addEventListener("click", () => {
        activeStyleSampleId = sample.id;
        const activeVersion = getActiveVersion(sample);
        const sceneId = getPreviewScenes(sample)[0]?.id || sample.rooms[0]?.id || "";
        const vrPackage = activeVersion?.vrPackage || buildVrPackageFromScenes(sample, sample.panoramaScenes || getPreviewScenes(sample), activeVersion?.id || "");
        renderStyleList();
        openPanoramaViewer(vrPackage, sceneId, activeVersion?.renderSpec || sample?.draft?.render_spec || null);
      });
      return button;
    })
  );
}

function getVisibleStyleSamples() {
  const query = styleSearchQuery.trim().toLowerCase();
  return availableStyleSamples.filter((sample) => {
    const categoryMatched = activeStyleCategory === "all" || sample.caseCategory === activeStyleCategory || sample.style === activeStyleCategory;
    if (!categoryMatched) {
      return false;
    }
    if (!query) {
      return true;
    }
    const text = [
      sample.name,
      sample.title,
      sample.style,
      sample.caseCategory,
      sample.sourceProject,
      sample.sourceSceneName,
      sample.summary,
    ].join(" ").toLowerCase();
    return text.includes(query);
  });
}

function renderStyleFilters() {
  if (!styleFilters) {
    return;
  }
  const categories = buildStyleCategories();
  styleFilters.replaceChildren(
    ...categories.map((category) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = category.id === activeStyleCategory ? "is-active" : "";
      button.textContent = category.label;
      button.addEventListener("click", () => {
        activeStyleCategory = category.id;
        renderStyleList();
      });
      return button;
    })
  );
}

function buildStyleCategories() {
  const counts = availableStyleSamples.reduce((items, sample) => {
    const category = sample.caseCategory || sample.style || "未分类";
    items.set(category, (items.get(category) || 0) + 1);
    return items;
  }, new Map());
  return [
    { id: "all", label: "全部" },
    ...[...counts.entries()]
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0], "zh-CN"))
      .map(([category]) => ({ id: category, label: category })),
  ];
}

function getStyleCardTitle(sample) {
  return sample.caseCategory || sample.style || sample.name || "室内风格";
}

function createLibraryEmptyState(title, description) {
  const empty = document.createElement("div");
  empty.className = "case-library-empty";
  empty.innerHTML = `
    <strong>${title}</strong>
    <span>${description}</span>
  `;
  return empty;
}

function updateStyleLibraryStats(visibleSamples = availableStyleSamples) {
  if (styleCountLabel) {
    styleCountLabel.textContent = String(visibleSamples.length);
  }
  if (stylePanoCountLabel) {
    const count = visibleSamples.reduce((total, sample) => total + getProjectSceneCount(sample), 0);
    stylePanoCountLabel.textContent = String(count);
  }
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
  detailTitle.textContent = `${sample.name} · ${activeVersion ? `${sample.style} ${activeVersion.title}` : sample.title}`;
  const previewVrAvailable = isPreviewVrAvailable(activeVersion);
  renderPreviewVr(sample, activeVersion, room);
  detailRoomName.textContent = previewVrAvailable ? "全屋 VR" : room.name;
  detailSummary.textContent = activeVersion?.summary || sample.summary;
  detailArea.textContent = sample.area;
  detailStyle.textContent = sample.style;
  detailDelivery.textContent = hasFinalVersion(sample) ? "VR全景方案" : "第一版生成中";
  renderPreviewFloorPlan(sample, activeVersion);

  renderSceneTabs(detailRoomTabs, previewVrAvailable ? [] : scenes, activeRoomId, (sceneId) => {
    activeRoomId = sceneId;
    renderScheme();
  });
  renderAdjustPanel(sample);
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

function getProjectSceneCount(sample) {
  const activeVersion = getActiveVersion(sample);
  return activeVersion?.vrPackage?.scenes?.length || sample.panoramaScenes?.length || getPreviewScenes(sample).length;
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
    image: "./assets/showcase/new-plan-cover-cream.jpg",
    alt: "方案预览",
  };
}

function getSchemeStatus(sample) {
  const activeVersion = getActiveVersion(sample);
  if (activeVersion) {
    return `${activeVersion.title} · 已生成`;
  }
  return sample.status || "V1 · 待生成VR全景";
}

function getActiveSchemePane() {
  return schemePanes.find((pane) => pane.classList.contains("is-active"))?.dataset.schemePane || "preview";
}

function getPreferredSchemePaneForSample(sample) {
  return (sample?.versions || []).length > 1 ? "versions" : "preview";
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

function isPreviewVrAvailable(activeVersion) {
  return getInlineVrScenes(activeVersion).length > 0;
}

function getInlineVrScenes(activeVersion) {
  const scenes = activeVersion?.vrPackage?.scenes?.length
    ? activeVersion.vrPackage.scenes
    : activeVersion?.scenes || [];
  return scenes
    .filter((scene) => (scene.shot_type === "panorama" || scene.projection === "equirectangular") && (scene.image || scene.panorama_url))
    .map((scene) => ({
      ...scene,
      id: scene.sceneId || scene.scene_id || scene.id,
      image: scene.image || scene.panorama_url,
      preview: scene.preview || scene.thumb_url || scene.panorama_url || scene.image,
      name: scene.name || formatVrPanoramaSceneName(scene),
      shot_type: "panorama",
    }));
}

function renderPreviewVr(sample, activeVersion, fallbackRoom) {
  const scenes = getInlineVrScenes(activeVersion);
  if (!scenes.length || !inlineVrPreview || !inlineVrCanvas) {
    stopInlineVrRenderLoop();
    if (inlineVrPreview) {
      inlineVrPreview.hidden = true;
    }
    if (detailImage && fallbackRoom) {
      detailImage.hidden = false;
      detailImage.src = fallbackRoom.image;
      detailImage.alt = fallbackRoom.alt;
      detailImage.style.objectFit = fallbackRoom.fit || "cover";
    }
    return;
  }

  if (detailImage) {
    detailImage.hidden = true;
  }
  inlineVrPreview.hidden = false;
  inlineVrScenes = scenes;
  updateWindowVrQualityReport(buildVrQualityReport(inlineVrScenes));
  if (!inlineVrScenes.some((scene) => scene.id === activeInlineVrSceneId)) {
    activeInlineVrSceneId = inlineVrScenes[0].id;
    resetInlineVrViewState();
  }
  inlineVrPreview.classList.toggle("is-multi-scene", inlineVrScenes.length > 1);
  inlineVrAutoButton?.classList.toggle("is-active", inlineVrAutoRotate);
  renderInlineVrViewer(sample, activeVersion);
  startInlineVrRenderLoop();
}

function renderInlineVrViewer(sample, activeVersion) {
  const scene = inlineVrScenes.find((item) => item.id === activeInlineVrSceneId) || inlineVrScenes[0];
  if (!scene) {
    return;
  }

  const vrPackage = activeVersion?.vrPackage || buildVrPackageFromScenes(sample, activeVersion?.scenes || inlineVrScenes, activeVersion?.id || "");
  if (inlineVrStatus) {
    const qualityPrefix = isDeliverableVrPackage(vrPackage) ? "可交付全屋 VR" : isRealPanoramaPackage(vrPackage) ? "可查看全屋 VR" : "全景草稿";
    inlineVrStatus.textContent = `${qualityPrefix} · ${inlineVrScenes.length} 个空间 · ${getSceneVrQualityReport(scene).label}`;
  }
  loadInlineVrTexture(scene.image);
  renderInlineVrHotspots(scene);
  renderInlineVrTabs(scene);
}

function renderInlineVrTabs(activeScene) {
  if (!inlineVrTabs) {
    return;
  }
  inlineVrTabs.replaceChildren(
    ...inlineVrScenes.map((scene) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = scene.id === activeScene.id ? "is-active" : "";
      const thumb = document.createElement("img");
      thumb.src = scene.poster || scene.preview || scene.image;
      thumb.alt = "";
      const label = document.createElement("span");
      label.textContent = scene.name;
      button.append(thumb, label);
      button.addEventListener("click", () => switchInlineVrScene(scene.id));
      return button;
    })
  );
}

function renderInlineVrHotspots(activeScene) {
  if (!inlineVrHotspots) {
    return;
  }
  inlineVrHotspots.replaceChildren();
  updateInlineVrOverlayPositions();
}

function openInlineVrFullscreen() {
  const sample = getActiveSample();
  const activeVersion = sample ? getActiveVersion(sample) : null;
  const vrPackage = activeVersion?.vrPackage || buildVrPackageFromScenes(sample, activeVersion?.scenes || inlineVrScenes, activeVersion?.id || "");
  openPanoramaViewer(vrPackage, activeInlineVrSceneId || vrPackage.scenes?.[0]?.id, activeVersion?.renderSpec || sample?.draft?.render_spec || null);
}

function switchInlineVrScene(sceneId) {
  activeInlineVrSceneId = sceneId;
  resetInlineVrViewState();
  const sample = getActiveSample();
  renderInlineVrViewer(sample, getActiveVersion(sample));
}

function loadInlineVrTexture(src) {
  const glState = getInlineVrGlState();
  if (!glState) {
    return;
  }
  const image = new Image();
  image.onload = () => {
    const { gl, texture } = glState;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    glState.hasTexture = true;
    drawInlineVrFrame();
  };
  image.src = src;
}

function getInlineVrGlState() {
  if (inlineVrGlState || !inlineVrCanvas) {
    return inlineVrGlState;
  }
  const gl = inlineVrCanvas.getContext("webgl", { antialias: true, alpha: false });
  if (!gl) {
    if (inlineVrStatus) {
      inlineVrStatus.textContent = "当前浏览器不支持 WebGL 全景预览。";
    }
    return null;
  }
  const program = createPanoramaProgram(gl);
  const buffer = gl.createBuffer();
  const texture = gl.createTexture();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  inlineVrGlState = {
    gl,
    program,
    buffer,
    texture,
    position: gl.getAttribLocation(program, "a_position"),
    yaw: gl.getUniformLocation(program, "u_yaw"),
    pitch: gl.getUniformLocation(program, "u_pitch"),
    fov: gl.getUniformLocation(program, "u_fov"),
    aspect: gl.getUniformLocation(program, "u_aspect"),
    sampler: gl.getUniformLocation(program, "u_panorama"),
    hasTexture: false,
  };
  return inlineVrGlState;
}

function handleInlineVrPointerDown(event) {
  event.currentTarget.setPointerCapture?.(event.pointerId);
  inlineVrDragState = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    startYaw: inlineVrYaw,
    startPitch: inlineVrPitch,
  };
}

function handleInlineVrPointerMove(event) {
  if (!inlineVrDragState || inlineVrDragState.pointerId !== event.pointerId) {
    return;
  }
  const width = Math.max(event.currentTarget.clientWidth, 1);
  const height = Math.max(event.currentTarget.clientHeight, 1);
  inlineVrYaw = inlineVrDragState.startYaw - ((event.clientX - inlineVrDragState.startX) / width) * Math.PI * 1.7;
  inlineVrPitch = clampPanoramaPitch(inlineVrDragState.startPitch + ((event.clientY - inlineVrDragState.startY) / height) * Math.PI * 0.85);
  updateInlineVrOverlayPositions();
}

function handleInlineVrPointerUp(event) {
  event.currentTarget.releasePointerCapture?.(event.pointerId);
  inlineVrDragState = null;
}

function handleInlineVrWheel(event) {
  event.preventDefault();
  inlineVrFov = clampVrFov(inlineVrFov + Math.sign(event.deltaY) * vrWheelFovStep);
}

function resetInlineVrView() {
  resetInlineVrViewState();
  updateInlineVrOverlayPositions();
}

function resetInlineVrViewState() {
  inlineVrYaw = 0;
  inlineVrPitch = 0;
  inlineVrFov = vrDefaultFov;
}

function toggleInlineVrAutoRotate() {
  inlineVrAutoRotate = !inlineVrAutoRotate;
  inlineVrAutoButton?.classList.toggle("is-active", inlineVrAutoRotate);
}

function startInlineVrRenderLoop() {
  if (inlineVrFrameId) {
    return;
  }
  inlineVrLastFrameTime = performance.now();
  const tick = (time) => {
    const delta = Math.min((time - inlineVrLastFrameTime) / 1000, 0.05);
    inlineVrLastFrameTime = time;
    if (inlineVrAutoRotate && !inlineVrDragState) {
      inlineVrYaw += delta * 0.12;
      updateInlineVrOverlayPositions();
    }
    drawInlineVrFrame();
    inlineVrFrameId = window.requestAnimationFrame(tick);
  };
  inlineVrFrameId = window.requestAnimationFrame(tick);
}

function stopInlineVrRenderLoop() {
  if (inlineVrFrameId) {
    window.cancelAnimationFrame(inlineVrFrameId);
    inlineVrFrameId = 0;
  }
}

function drawInlineVrFrame() {
  const state = getInlineVrGlState();
  if (!state || !state.hasTexture || !inlineVrCanvas || inlineVrPreview?.hidden) {
    return;
  }
  const { gl, program, buffer, position, texture } = state;
  const rect = inlineVrCanvas.getBoundingClientRect();
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(Math.floor(rect.width * pixelRatio), 1);
  const height = Math.max(Math.floor(rect.height * pixelRatio), 1);
  if (inlineVrCanvas.width !== width || inlineVrCanvas.height !== height) {
    inlineVrCanvas.width = width;
    inlineVrCanvas.height = height;
  }
  gl.viewport(0, 0, width, height);
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(state.sampler, 0);
  gl.uniform1f(state.yaw, inlineVrYaw);
  gl.uniform1f(state.pitch, inlineVrPitch);
  gl.uniform1f(state.fov, horizontalFovToVerticalFov(inlineVrFov, width / height));
  gl.uniform1f(state.aspect, width / height);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function updateInlineVrOverlayPositions() {
  if (!inlineVrHotspots) {
    return;
  }
  inlineVrHotspots.querySelectorAll(".vr-hotspot").forEach((button) => {
    const targetYaw = Number(button.dataset.yaw) || 0;
    const diff = normalizePanoramaAngle(targetYaw - inlineVrYaw);
    const visibleLimit = Math.PI * 0.34;
    const visible = Math.abs(diff) < visibleLimit;
    const x = 50 + (diff / visibleLimit) * 42;
    const baseY = button.dataset.anchor === "door_floor" ? 74 : 56;
    const y = baseY + Math.sin(diff * 1.2) * 4 + inlineVrPitch * 18;
    button.style.left = `${Math.max(8, Math.min(92, x))}%`;
    button.style.top = `${Math.max(24, Math.min(86, y))}%`;
    button.style.opacity = visible ? "1" : "0";
    button.style.pointerEvents = visible ? "auto" : "none";
  });
}

function renderPreviewFloorPlan(sample, activeVersion) {
  if (!previewFloorPlan) {
    return;
  }
  const vrPackage = activeVersion?.vrPackage || buildVrPackageFromScenes(sample, activeVersion?.scenes || [], activeVersion?.id || "");
  const scenes = vrPackage.scenes || [];
  const floorPlanImage = getPreviewFloorPlanImage(sample, activeVersion);
  if (!floorPlanImage && !scenes.length) {
    previewFloorPlan.hidden = true;
    previewFloorPlan.replaceChildren();
    return;
  }
  previewFloorPlan.hidden = false;
  const title = document.createElement("strong");
  title.textContent = "户型图";
  if (floorPlanImage) {
    const image = document.createElement("img");
    image.className = "preview-floor-plan-image";
    image.src = floorPlanImage;
    image.alt = `${sample.name} 户型图`;
    previewFloorPlan.replaceChildren(title, image);
    return;
  }

  const empty = document.createElement("p");
  empty.className = "preview-floor-plan-empty";
  empty.textContent = "当前版本未关联上传户型图。";
  previewFloorPlan.replaceChildren(title, empty);
}

function getPreviewFloorPlanImage(sample, activeVersion) {
  const candidates = [
    ...(sample?.initialScenes || []),
    ...(sample?.rooms || []),
    ...(activeVersion?.scenes || []),
  ];
  const floorPlanScene = candidates.find(isFloorPlanScene);
  if (floorPlanScene?.image) {
    return floorPlanScene.image;
  }
  if (sample?.draft?.floor_plan) {
    return createFloorPlanImage(sample.draft.floor_plan, `${sample.name}户型图`);
  }
  return sample?.floorPlanImage || "";
}

function isFloorPlanScene(scene) {
  const text = String(`${scene?.id || ""} ${scene?.name || ""} ${scene?.sceneType || ""}`).toLowerCase();
  return text.includes("floor-plan") || text.includes("户型") || text.includes("2d");
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
  if (manualAdjustmentInput) {
    manualAdjustmentInput.value = manualAdjustmentNotes[scene.id] || "";
  }

  if (styleLockButton) {
    styleLockButton.textContent = `${sample.style} · 风格锁定`;
  }
  if (adjustScope) {
    const activeVersion = getActiveVersion(sample);
    if (sample.templateOnly) {
      adjustScope.textContent = `正在基于 ${scene.name} 记录局部修改意图；当前图片是风格参考，不匹配新户型，后续会交给 AI 修图生成新版本。`;
    } else if (canGenerateRealPanoramas(sample)) {
      adjustScope.textContent = activeVersion
        ? `正在基于当前版本的 ${scene.name} 做局部修图；系统会优先引用当前全景图保持连续性，并生成下一版方案。`
        : `正在为 ${scene.name} 生成真实 2:1 全景图；生成后会进入全屋 VR 预览，并支持区域场景切换。`;
    } else if (activeVersion?.deliverable) {
      adjustScope.textContent = `正在基于当前终版继续调整 ${scene.name}，重新生成后会记录为下一版 VR 全景方案。`;
    } else if (activeVersion) {
      adjustScope.textContent = `当前版本缺少真实 2:1 全景生成来源，不能继续生成客户可交付版本。`;
    } else {
      adjustScope.textContent = `正在调整第一版中的 ${scene.name}，生成后会记录为新的方案版本。`;
    }
  }

  renderAdjustActions(sample, scene);

  updateRenderActionState(sample, scene);
  if (clearAdjustmentsButton) {
    clearAdjustmentsButton.disabled = isRenderingFinal || (!hasSelectedAdjustments(sample, scene) && !hasManualAdjustmentNote(scene.id));
  }
}

function updateRenderActionState(sample, scene = getActiveAdjustScene(sample)) {
  if (!renderFinalButton || !sample || !scene) {
    return;
  }
  const realPanoramaMode = canGenerateRealPanoramas(sample);
  const hasAdjustments = hasSelectedAdjustments(sample, scene) || hasManualAdjustmentNote(scene.id);
  renderFinalButton.disabled = isStoppingRender || (
    !isRenderingFinal
    && !hasAdjustments
  ) || (!sample.templateOnly && !realPanoramaMode && !getBaseRenderSpecForFinalGeneration(sample));
  renderFinalButton.classList.toggle("is-danger", isRenderingFinal);
  renderFinalButton.textContent = isRenderingFinal
    ? (isStoppingRender ? "正在停止生成" : "停止生成")
    : "重新生成";
}

function hasSelectedAdjustments(sample, scene) {
  return Boolean((sample.adjustments || []).some((item) => item.sceneId === scene?.id));
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

function ensurePanoramaViewer() {
  if (panoramaViewer) {
    return;
  }

  panoramaViewer = document.createElement("div");
  panoramaViewer.className = "vr-viewer";
  panoramaViewer.hidden = true;
  panoramaViewer.innerHTML = `
    <section class="vr-viewer-sheet" aria-label="VR 全景查看">
      <header class="vr-viewer-meta" aria-label="项目信息">
        <span data-vr-viewer-project></span>
        <strong data-vr-viewer-title></strong>
        <small data-vr-viewer-status></small>
      </header>
      <div class="vr-viewer-stage" data-vr-viewer-stage>
        <canvas data-vr-viewer-canvas aria-label="VR 全景画面"></canvas>
        <div class="vr-photo-sphere-stage" data-vr-photo-sphere-stage hidden></div>
        <div class="vr-viewer-hotspots" data-vr-viewer-hotspots></div>
        <aside class="vr-viewer-map" data-vr-viewer-map aria-label="全屋地图"></aside>
      </div>
      <nav class="vr-viewer-actions" aria-label="VR 工具">
        <button type="button" data-vr-viewer-auto>旋转</button>
        <button type="button" data-vr-viewer-reset>复位</button>
        <button type="button" data-vr-viewer-map-toggle aria-pressed="true">地图</button>
        <button type="button" data-vr-viewer-close>退出</button>
      </nav>
      <button class="vr-viewer-scenes-toggle" type="button" data-vr-viewer-scenes-toggle aria-expanded="false">展开场景</button>
      <div class="vr-viewer-tabs" data-vr-viewer-tabs aria-label="空间全景切换"></div>
    </section>
  `;
  panoramaViewerProject = panoramaViewer.querySelector("[data-vr-viewer-project]");
  panoramaViewerTitle = panoramaViewer.querySelector("[data-vr-viewer-title]");
  panoramaViewerStatus = panoramaViewer.querySelector("[data-vr-viewer-status]");
  panoramaViewerCanvas = panoramaViewer.querySelector("[data-vr-viewer-canvas]");
  panoramaViewerSceneTabs = panoramaViewer.querySelector("[data-vr-viewer-tabs]");
  panoramaViewerHotspots = panoramaViewer.querySelector("[data-vr-viewer-hotspots]");
  panoramaViewerMap = panoramaViewer.querySelector("[data-vr-viewer-map]");
  panoramaViewerAutoButton = panoramaViewer.querySelector("[data-vr-viewer-auto]");
  panoramaViewerMapToggleButton = panoramaViewer.querySelector("[data-vr-viewer-map-toggle]");
  panoramaPhotoSphereStage = panoramaViewer.querySelector("[data-vr-photo-sphere-stage]");
  panoramaViewerScenesToggleButton = panoramaViewer.querySelector("[data-vr-viewer-scenes-toggle]");
  const stage = panoramaViewer.querySelector("[data-vr-viewer-stage]");

  panoramaViewer.addEventListener("click", (event) => {
    if (event.target === panoramaViewer) {
      closePanoramaViewer();
    }
  });
  panoramaViewer.querySelector("[data-vr-viewer-close]")?.addEventListener("click", closePanoramaViewer);
  panoramaViewer.querySelector("[data-vr-viewer-reset]")?.addEventListener("click", resetPanoramaView);
  panoramaViewer.querySelector("[data-vr-viewer-auto]")?.addEventListener("click", togglePanoramaAutoRotate);
  panoramaViewerMapToggleButton?.addEventListener("click", togglePanoramaMap);
  panoramaViewerScenesToggleButton?.addEventListener("click", togglePanoramaSceneStrip);
  stage?.addEventListener("pointerdown", handlePanoramaPointerDown);
  stage?.addEventListener("pointermove", handlePanoramaPointerMove);
  stage?.addEventListener("pointerup", handlePanoramaPointerUp);
  stage?.addEventListener("pointercancel", handlePanoramaPointerUp);
  stage?.addEventListener("wheel", handlePanoramaWheel, { passive: false });

  document.body.append(panoramaViewer);
}

function openPanoramaViewer(vrPackageOrScenes, sceneId, renderSpec = null) {
  ensurePanoramaViewer();
  const sample = getActiveSample();
  const activeVersion = sample ? getActiveVersion(sample) : null;
  const scenes = Array.isArray(vrPackageOrScenes)
    ? vrPackageOrScenes
    : vrPackageOrScenes?.scenes || [];
  panoramaViewerMapPoints = Array.isArray(vrPackageOrScenes)
    ? []
    : vrPackageOrScenes?.floorMapPoints || [];
  panoramaViewerRenderSpec = renderSpec || vrPackageOrScenes?.renderSpec || vrPackageOrScenes?.render_spec || activeVersion?.renderSpec || sample?.draft?.render_spec || null;
  panoramaViewerFloorPlan = vrPackageOrScenes?.floorPlan || vrPackageOrScenes?.floor_plan || activeVersion?.floorPlan || activeVersion?.floor_plan || sample?.draft?.floor_plan || null;
  panoramaViewerFloorPlanImage = getPreviewFloorPlanImage(sample, activeVersion);
  panoramaViewerScenes = scenes
    .filter((scene) => (scene.shot_type === "panorama" || scene.projection === "equirectangular") && (scene.image || scene.panorama_url))
    .map((scene) => ({
      ...scene,
      id: scene.sceneId || scene.scene_id || scene.id,
      image: scene.image || scene.panorama_url,
      preview: scene.preview || scene.thumb_url || scene.poster || scene.poster_url || scene.panorama_url || scene.image,
      poster: scene.poster || scene.poster_url || scene.preview || scene.thumb_url || scene.panorama_url || scene.image,
      name: scene.name || formatVrPanoramaSceneName(scene),
      shot_type: "panorama",
    }));
  if (!panoramaViewerScenes.length) {
    return;
  }
  updateWindowVrQualityReport(buildVrQualityReport(panoramaViewerScenes));
  panoramaViewerEngine = getRequestedVrViewerEngine();
  activePanoramaSceneId = panoramaViewerScenes.some((scene) => scene.id === sceneId)
    ? sceneId
    : panoramaViewerScenes[0].id;
  panoramaViewerScenesExpanded = false;
  resetPanoramaViewState();
  panoramaViewer.classList.toggle("is-photo-sphere", panoramaViewerEngine === "photoSphere");
  panoramaViewer.removeAttribute("data-vr-engine-error");
  panoramaViewer.classList.remove("is-map-hidden");
  panoramaViewerMapToggleButton?.setAttribute("aria-pressed", "true");
  panoramaViewerMapToggleButton?.classList.add("is-active");
  if (panoramaViewerMap) {
    panoramaViewerMap.hidden = false;
  }
  panoramaViewer.hidden = false;
  renderPanoramaViewer();
  panoramaViewer.classList.toggle("is-multi-scene", panoramaViewerScenes.length > 1);
  updatePanoramaSceneStripState();
  startPanoramaRenderLoop();
}

function closePanoramaViewer() {
  if (panoramaViewer) {
    panoramaViewer.hidden = true;
    panoramaViewer.classList.remove("is-multi-scene");
    panoramaViewerScenesExpanded = false;
    updatePanoramaSceneStripState();
  }
  panoramaDragState = null;
  panoramaPhotoSphereRequestId += 1;
  destroyPhotoSphereViewer();
  stopPanoramaRenderLoop();
}

function togglePanoramaSceneStrip() {
  panoramaViewerScenesExpanded = !panoramaViewerScenesExpanded;
  updatePanoramaSceneStripState();
}

function togglePanoramaMap() {
  const hidden = !panoramaViewer?.classList.contains("is-map-hidden");
  panoramaViewer?.classList.toggle("is-map-hidden", hidden);
  if (panoramaViewerMap) {
    panoramaViewerMap.hidden = hidden;
  }
  panoramaViewerMapToggleButton?.setAttribute("aria-pressed", String(!hidden));
  panoramaViewerMapToggleButton?.classList.toggle("is-active", !hidden);
}

function updatePanoramaSceneStripState() {
  panoramaViewer?.classList.toggle("is-scenes-expanded", panoramaViewerScenesExpanded);
  if (!panoramaViewerScenesToggleButton) {
    return;
  }
  const showToggle = panoramaViewerScenes.length > 1 && !panoramaViewer?.hidden;
  panoramaViewerScenesToggleButton.hidden = !showToggle;
  panoramaViewerScenesToggleButton.textContent = panoramaViewerScenesExpanded ? "收起场景" : "展开场景";
  panoramaViewerScenesToggleButton.setAttribute("aria-expanded", String(panoramaViewerScenesExpanded));
}

function renderPanoramaViewer() {
  const scene = panoramaViewerScenes.find((item) => item.id === activePanoramaSceneId) || panoramaViewerScenes[0];
  if (!scene || !panoramaViewerCanvas) {
    return;
  }
  const sample = getActiveSample();
  const activeVersion = getActiveVersion(sample);
  const vrPackage = activeVersion?.vrPackage || buildVrPackageFromScenes(sample, activeVersion?.scenes || panoramaViewerScenes, activeVersion?.id || "");
  const packageDeliverable = isDeliverableVrPackage(vrPackage);
  if (panoramaViewerProject) {
    panoramaViewerProject.textContent = "";
  }
  if (panoramaViewerTitle) {
    panoramaViewerTitle.textContent = "";
  }
  const qualityPrefix = packageDeliverable ? "可交付" : isRealPanoramaPackage(vrPackage) ? "可查看" : "草稿校验";
  const sceneQuality = getSceneVrQualityReport(scene);
  if (panoramaViewerStatus) {
    panoramaViewerStatus.textContent = panoramaViewerScenes.length > 1
      ? `${qualityPrefix} · ${panoramaViewerScenes.length} 个空间 · ${sceneQuality.label}`
      : `${qualityPrefix} · ${sceneQuality.label}`;
  }
  renderPanoramaSceneImage(scene);
  renderPanoramaHotspots(scene);
  renderPanoramaMap(scene);
  if (!panoramaViewerSceneTabs) {
    return;
  }
  panoramaViewerSceneTabs.replaceChildren(
    ...panoramaViewerScenes.map((item) => {
      const button = document.createElement("button");
      button.type = "button";
      const quality = getSceneVrQualityReport(item);
      button.className = [
        item.id === scene.id ? "is-active" : "",
        quality.status === "review_required" ? "is-low-quality" : "",
      ].filter(Boolean).join(" ");
      const thumb = document.createElement("img");
      thumb.src = item.poster || item.preview || item.image;
      thumb.alt = "";
      const label = document.createElement("span");
      label.textContent = item.name;
      button.append(thumb, label);
      button.addEventListener("click", () => {
        activePanoramaSceneId = item.id;
        resetPanoramaViewState();
        renderPanoramaViewer();
      });
      return button;
    })
  );
}

function renderPanoramaSceneImage(scene) {
  if (panoramaViewerEngine === "photoSphere") {
    renderPhotoSphereScene(scene);
    return;
  }
  panoramaPhotoSphereRequestId += 1;
  destroyPhotoSphereViewer();
  panoramaViewer?.classList.remove("is-photo-sphere");
  if (panoramaPhotoSphereStage) {
    panoramaPhotoSphereStage.hidden = true;
  }
  if (panoramaViewerCanvas) {
    panoramaViewerCanvas.hidden = false;
  }
  loadPanoramaTexture(scene.image);
}

async function renderPhotoSphereScene(scene) {
  if (!panoramaPhotoSphereStage || !panoramaViewerCanvas) {
    loadPanoramaTexture(scene.image);
    return;
  }
  const requestId = panoramaPhotoSphereRequestId + 1;
  panoramaPhotoSphereRequestId = requestId;
  panoramaViewer?.classList.add("is-photo-sphere");
  panoramaPhotoSphereStage.hidden = false;
  panoramaViewerCanvas.hidden = true;
  try {
    const module = await loadPhotoSphereModule();
    if (requestId !== panoramaPhotoSphereRequestId || panoramaViewer?.hidden) {
      return;
    }
    const Viewer = module.Viewer || module.PhotoSphereViewer;
    if (!Viewer) {
      throw new Error("Photo Sphere Viewer module does not export Viewer.");
    }
    destroyPhotoSphereViewer();
    panoramaPhotoSphereViewer = new Viewer({
      container: panoramaPhotoSphereStage,
      panorama: scene.image,
      caption: scene.name,
      navbar: false,
      mousewheel: true,
      touchmoveTwoFingers: false,
      defaultZoomLvl: 50,
      loadingImg: scene.poster || scene.preview || "",
    });
    if (panoramaAutoRotate) {
      syncPhotoSphereAutorotate();
    }
  } catch (error) {
    if (requestId !== panoramaPhotoSphereRequestId || panoramaViewer?.hidden) {
      return;
    }
    console.warn("Photo Sphere Viewer failed, falling back to legacy viewer.", error);
    panoramaViewer?.setAttribute("data-vr-engine-error", error?.message || "unknown");
    panoramaViewerEngine = "legacy";
    panoramaViewer?.classList.remove("is-photo-sphere");
    panoramaPhotoSphereStage.hidden = true;
    panoramaViewerCanvas.hidden = false;
    loadPanoramaTexture(scene.image);
    if (panoramaViewerStatus) {
      panoramaViewerStatus.textContent = "Photo Sphere 加载失败，已切回基础查看器。";
    }
  }
}

function destroyPhotoSphereViewer() {
  if (!panoramaPhotoSphereViewer) {
    return;
  }
  try {
    panoramaPhotoSphereViewer.destroy?.();
  } catch (error) {
    console.warn("Failed to destroy Photo Sphere Viewer.", error);
  }
  panoramaPhotoSphereViewer = null;
  if (panoramaPhotoSphereStage) {
    panoramaPhotoSphereStage.replaceChildren();
  }
}

function syncPhotoSphereAutorotate() {
  if (!panoramaPhotoSphereViewer) {
    return;
  }
  if (panoramaAutoRotate) {
    panoramaPhotoSphereViewer.startAutorotate?.();
  } else {
    panoramaPhotoSphereViewer.stopAutorotate?.();
  }
}

function tickPhotoSphereAutorotate(delta) {
  if (!panoramaPhotoSphereViewer || !panoramaAutoRotate || panoramaDragState) {
    return;
  }
  const currentPosition = panoramaPhotoSphereViewer.getPosition?.() || { yaw: panoramaYaw, pitch: panoramaPitch };
  const nextYaw = normalizePanoramaAngle((Number(currentPosition.yaw) || 0) + delta * 0.18);
  const nextPitch = Number(currentPosition.pitch) || 0;
  panoramaPhotoSphereViewer.rotate?.({ yaw: nextYaw, pitch: nextPitch });
  panoramaYaw = nextYaw;
  panoramaPitch = nextPitch;
}

function handlePanoramaPointerDown(event) {
  event.currentTarget.setPointerCapture?.(event.pointerId);
  panoramaDragState = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    startYaw: panoramaYaw,
    startPitch: panoramaPitch,
  };
}

function handlePanoramaPointerMove(event) {
  if (!panoramaDragState || panoramaDragState.pointerId !== event.pointerId) {
    return;
  }
  const width = Math.max(event.currentTarget.clientWidth, 1);
  const height = Math.max(event.currentTarget.clientHeight, 1);
  panoramaYaw = panoramaDragState.startYaw - ((event.clientX - panoramaDragState.startX) / width) * Math.PI * 1.7;
  panoramaPitch = clampPanoramaPitch(panoramaDragState.startPitch + ((event.clientY - panoramaDragState.startY) / height) * Math.PI * 0.85);
  updatePanoramaOverlayPositions();
}

function handlePanoramaPointerUp(event) {
  event.currentTarget.releasePointerCapture?.(event.pointerId);
  panoramaDragState = null;
}

function handlePanoramaWheel(event) {
  event.preventDefault();
  panoramaFov = clampVrFov(panoramaFov + Math.sign(event.deltaY) * vrWheelFovStep);
}

function resetPanoramaView() {
  resetPanoramaViewState();
  if (panoramaPhotoSphereViewer) {
    panoramaPhotoSphereViewer.rotate?.({ yaw: 0, pitch: 0 });
    panoramaPhotoSphereViewer.zoom?.(50);
  }
  updatePanoramaOverlayPositions();
}

function resetPanoramaViewState() {
  panoramaYaw = 0;
  panoramaPitch = 0;
  panoramaFov = vrDefaultFov;
}

function clampVrFov(value) {
  return Math.max(vrMinFov, Math.min(vrMaxFov, value));
}

function horizontalFovToVerticalFov(horizontalFov, aspect) {
  const safeAspect = Math.max(Number(aspect) || 1, 0.1);
  const horizontalRadians = degreesToRadians(clampVrFov(horizontalFov));
  const verticalRadians = 2 * Math.atan(Math.tan(horizontalRadians / 2) / safeAspect);
  return Math.max(1, Math.min(120, (verticalRadians * 180) / Math.PI));
}

function togglePanoramaAutoRotate(event) {
  panoramaAutoRotate = !panoramaAutoRotate;
  event.currentTarget.classList.toggle("is-active", panoramaAutoRotate);
  syncPhotoSphereAutorotate();
}

async function copyPanoramaShareLink() {
  const scene = panoramaViewerScenes.find((item) => item.id === activePanoramaSceneId) || panoramaViewerScenes[0];
  const sample = getActiveSample();
  const activeVersion = getActiveVersion(sample);
  const vrPackage = activeVersion?.vrPackage || buildVrPackageFromScenes(sample, activeVersion?.scenes || panoramaViewerScenes, activeVersion?.id || "");
  const packageDeliverable = isDeliverableVrPackage(vrPackage);
  const shareUrl = `${window.location.origin}${window.location.pathname}#vr=${encodeURIComponent(scene?.id || "")}`;
  try {
    await navigator.clipboard?.writeText(shareUrl);
    if (panoramaViewerStatus) {
      panoramaViewerStatus.textContent = packageDeliverable
        ? "交付链接已复制，可发送给客户查看。"
        : "草稿查看链接已复制，仅用于内部校验。";
    }
  } catch {
    if (panoramaViewerStatus) {
      panoramaViewerStatus.textContent = shareUrl;
    }
  }
}

function loadPanoramaTexture(src) {
  const glState = getPanoramaGlState();
  if (!glState) {
    return;
  }
  const image = new Image();
  image.onload = () => {
    const { gl, texture } = glState;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    glState.hasTexture = true;
    drawPanoramaFrame();
  };
  image.src = src;
}

function getPanoramaGlState() {
  if (panoramaGlState || !panoramaViewerCanvas) {
    return panoramaGlState;
  }
  const gl = panoramaViewerCanvas.getContext("webgl", { antialias: true, alpha: false });
  if (!gl) {
    panoramaViewerStatus.textContent = "当前浏览器不支持 WebGL 全景查看。";
    return null;
  }
  const program = createPanoramaProgram(gl);
  const buffer = gl.createBuffer();
  const texture = gl.createTexture();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  panoramaGlState = {
    gl,
    program,
    buffer,
    texture,
    position: gl.getAttribLocation(program, "a_position"),
    yaw: gl.getUniformLocation(program, "u_yaw"),
    pitch: gl.getUniformLocation(program, "u_pitch"),
    fov: gl.getUniformLocation(program, "u_fov"),
    aspect: gl.getUniformLocation(program, "u_aspect"),
    sampler: gl.getUniformLocation(program, "u_panorama"),
    hasTexture: false,
  };
  return panoramaGlState;
}

function createPanoramaProgram(gl) {
  const vertex = compilePanoramaShader(gl, gl.VERTEX_SHADER, `
    attribute vec2 a_position;
    varying vec2 v_uv;
    void main() {
      v_uv = a_position;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `);
  const fragment = compilePanoramaShader(gl, gl.FRAGMENT_SHADER, `
    precision mediump float;
    varying vec2 v_uv;
    uniform sampler2D u_panorama;
    uniform float u_yaw;
    uniform float u_pitch;
    uniform float u_fov;
    uniform float u_aspect;
    const float PI = 3.141592653589793;
    void main() {
      float fov = radians(u_fov);
      vec3 dir = normalize(vec3(v_uv.x * tan(fov * 0.5) * u_aspect, v_uv.y * tan(fov * 0.5), -1.0));
      float cy = cos(u_yaw);
      float sy = sin(u_yaw);
      float cp = cos(u_pitch);
      float sp = sin(u_pitch);
      dir = vec3(cy * dir.x - sy * dir.z, dir.y, sy * dir.x + cy * dir.z);
      dir = vec3(dir.x, cp * dir.y - sp * dir.z, sp * dir.y + cp * dir.z);
      float u = atan(dir.x, -dir.z) / (2.0 * PI) + 0.5;
      float v = 0.5 - asin(clamp(dir.y, -1.0, 1.0)) / PI;
      gl_FragColor = texture2D(u_panorama, vec2(u, v));
    }
  `);
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) || "WebGL panorama program link failed.");
  }
  return program;
}

function compilePanoramaShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) || "WebGL panorama shader compile failed.");
  }
  return shader;
}

function startPanoramaRenderLoop() {
  if (panoramaFrameId) {
    return;
  }
  panoramaLastFrameTime = performance.now();
  const tick = (time) => {
    const delta = Math.min((time - panoramaLastFrameTime) / 1000, 0.05);
    panoramaLastFrameTime = time;
    if (panoramaViewerEngine === "photoSphere" && panoramaPhotoSphereViewer) {
      tickPhotoSphereAutorotate(delta);
    } else if (panoramaAutoRotate && !panoramaDragState) {
      panoramaYaw += delta * 0.18;
      updatePanoramaOverlayPositions();
    }
    drawPanoramaFrame();
    panoramaFrameId = window.requestAnimationFrame(tick);
  };
  panoramaFrameId = window.requestAnimationFrame(tick);
}

function stopPanoramaRenderLoop() {
  if (panoramaFrameId) {
    window.cancelAnimationFrame(panoramaFrameId);
    panoramaFrameId = 0;
  }
}

function drawPanoramaFrame() {
  if (panoramaViewerEngine === "photoSphere" && panoramaPhotoSphereViewer) {
    return;
  }
  const state = getPanoramaGlState();
  if (!state || !state.hasTexture || !panoramaViewerCanvas) {
    return;
  }
  const { gl, program, buffer, position, texture } = state;
  const rect = panoramaViewerCanvas.getBoundingClientRect();
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(Math.floor(rect.width * pixelRatio), 1);
  const height = Math.max(Math.floor(rect.height * pixelRatio), 1);
  if (panoramaViewerCanvas.width !== width || panoramaViewerCanvas.height !== height) {
    panoramaViewerCanvas.width = width;
    panoramaViewerCanvas.height = height;
  }
  gl.viewport(0, 0, width, height);
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(state.sampler, 0);
  gl.uniform1f(state.yaw, panoramaYaw);
  gl.uniform1f(state.pitch, panoramaPitch);
  gl.uniform1f(state.fov, horizontalFovToVerticalFov(panoramaFov, width / height));
  gl.uniform1f(state.aspect, width / height);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function renderPanoramaHotspots(activeScene) {
  if (!panoramaViewerHotspots) {
    return;
  }
  panoramaViewerHotspots.replaceChildren();
  updatePanoramaOverlayPositions();
}

function resolveVrHotspotTargets(activeScene, scenes) {
  return [];
}

function hotspotYawRadians(hotspot, index, count) {
  const yaw = Number(hotspot.yaw ?? hotspot.yaw_degrees ?? hotspot.yawDegrees);
  return Number.isFinite(yaw) ? degreesToRadians(yaw) : panoramaHotspotYaw(index, count);
}

function hotspotPitchRadians(hotspot) {
  const pitch = Number(hotspot.pitch ?? hotspot.pitch_degrees ?? hotspot.pitchDegrees);
  return Number.isFinite(pitch) ? degreesToRadians(pitch) : degreesToRadians(-18);
}

function degreesToRadians(value) {
  return (value * Math.PI) / 180;
}

function panoramaHotspotYaw(index, count) {
  const spread = Math.PI * 1.18;
  const start = -spread / 2;
  return count <= 1 ? 0 : start + (spread * index) / (count - 1);
}

function panoramaHotspotYawForScene(scene, index, count) {
  const key = String(`${scene?.id || ""} ${scene?.roomId || ""} ${scene?.room_id || ""} ${scene?.name || ""}`).toLowerCase();
  if (key.includes("kitchen") || key.includes("厨房")) {
    return -Math.PI * 0.42;
  }
  if (key.includes("hall") || key.includes("corridor") || key.includes("过道")) {
    return 0;
  }
  if (key.includes("master") || key.includes("bedroom") || key.includes("主卧") || key.includes("卧室")) {
    return Math.PI * 0.38;
  }
  if (key.includes("dining") || key.includes("餐厅")) {
    return -Math.PI * 0.18;
  }
  if (key.includes("balcony") || key.includes("阳台")) {
    return Math.PI * 0.58;
  }
  if (key.includes("living") || key.includes("客厅")) {
    return -Math.PI * 0.04;
  }
  return panoramaHotspotYaw(index, count);
}

function formatVrHotspotLabel(scene) {
  const name = String(scene?.roomName || scene?.name || "空间").replace(/\s*全景$/, "").trim();
  return `进入${name}`;
}

function updatePanoramaOverlayPositions() {
  if (!panoramaViewerHotspots) {
    return;
  }
  panoramaViewerHotspots.querySelectorAll(".vr-hotspot").forEach((button) => {
    const targetYaw = Number(button.dataset.yaw) || 0;
    const diff = normalizePanoramaAngle(targetYaw - panoramaYaw);
    const visibleLimit = Math.PI * 0.34;
    const visible = Math.abs(diff) < visibleLimit;
    const x = 50 + (diff / visibleLimit) * 42;
    const baseY = button.dataset.anchor === "door_floor" ? 74 : 56;
    const y = baseY + Math.sin(diff * 1.2) * 4 + panoramaPitch * 18;
    button.style.left = `${Math.max(8, Math.min(92, x))}%`;
    button.style.top = `${Math.max(24, Math.min(86, y))}%`;
    button.style.opacity = visible ? "1" : "0";
    button.style.pointerEvents = visible ? "auto" : "none";
  });
}

function renderPanoramaMap(activeScene) {
  if (!panoramaViewerMap) {
    return;
  }
  const title = document.createElement("strong");
  title.textContent = "全屋地图";
  const mapBody = document.createElement("div");
  mapBody.className = "vr-viewer-map-body";
  mapBody.innerHTML = createPanoramaMinimapSvg();
  panoramaViewerScenes.forEach((scene, index) => {
    const point = getPanoramaSceneMapPoint(scene, index);
    const button = document.createElement("button");
    button.type = "button";
    button.className = scene.id === activeScene?.id ? "is-active" : "";
    button.style.left = `${point.x}%`;
    button.style.top = `${point.y}%`;
    button.setAttribute("aria-label", `切换到${scene.name}`);
    button.title = scene.name;
    button.addEventListener("pointerdown", (event) => event.stopPropagation());
    button.addEventListener("pointermove", (event) => event.stopPropagation());
    button.addEventListener("pointerup", (event) => event.stopPropagation());
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      if (activePanoramaSceneId === scene.id) {
        return;
      }
      activePanoramaSceneId = scene.id;
      resetPanoramaViewState();
      renderPanoramaViewer();
    });
    mapBody.append(button);
  });
  panoramaViewerMap.replaceChildren(title, mapBody);
}

function createPanoramaMinimapSvg() {
  const floorPlanSvg = createFloorPlanMinimapSvg();
  if (floorPlanSvg) {
    return floorPlanSvg;
  }
  const floorPlanImageSvg = createFloorPlanImageMinimapSvg();
  if (floorPlanImageSvg) {
    return floorPlanImageSvg;
  }
  const renderSpec = panoramaViewerRenderSpec;
  const bounds = getPanoramaMinimapBounds(renderSpec);
  if (!renderSpec || !bounds) {
    return `<svg viewBox="0 0 ${panoramaMinimapWidth} ${panoramaMinimapHeight}" aria-hidden="true"><rect x="0" y="0" width="${panoramaMinimapWidth}" height="${panoramaMinimapHeight}" fill="none"/></svg>`;
  }
  const parts = [`<svg viewBox="0 0 ${panoramaMinimapWidth} ${panoramaMinimapHeight}" aria-hidden="true" preserveAspectRatio="xMidYMid meet">`];
  (renderSpec.room_boundaries || []).forEach((boundary) => {
    const points = (boundary.polygon || []).filter(isPoint).map((point) => projectPanoramaMapPoint(point, bounds)).map((point) => `${point.svgX},${point.svgY}`).join(" ");
    if (points) {
      parts.push(`<polygon points="${points}" class="mini-room"/>`);
    }
  });
  (renderSpec.walls || []).forEach((wall) => {
    if (!isPoint(wall.start) || !isPoint(wall.end)) {
      return;
    }
    const start = projectPanoramaMapPoint(wall.start, bounds);
    const end = projectPanoramaMapPoint(wall.end, bounds);
    parts.push(`<line x1="${start.svgX}" y1="${start.svgY}" x2="${end.svgX}" y2="${end.svgY}" class="mini-wall"/>`);
  });
  (renderSpec.openings || []).forEach((opening) => {
    if (!isPoint(opening.center)) {
      return;
    }
    const point = projectPanoramaMapPoint(opening.center, bounds);
    const className = opening.kind === "window" ? "mini-window" : "mini-door";
    parts.push(`<circle cx="${point.svgX}" cy="${point.svgY}" r="${opening.kind === "window" ? 1.5 : 2.1}" class="${className}"/>`);
  });
  parts.push("</svg>");
  return parts.join("");
}

function createFloorPlanImageMinimapSvg() {
  if (!panoramaViewerFloorPlanImage) {
    return "";
  }
  return [
    `<svg viewBox="0 0 ${panoramaMinimapWidth} ${panoramaMinimapHeight}" aria-hidden="true" preserveAspectRatio="xMidYMid meet">`,
    `<rect x="0" y="0" width="${panoramaMinimapWidth}" height="${panoramaMinimapHeight}" fill="rgb(255 253 246 / 0.10)"/>`,
    `<image href="${escapeSvgText(panoramaViewerFloorPlanImage)}" x="0" y="0" width="${panoramaMinimapWidth}" height="${panoramaMinimapHeight}" preserveAspectRatio="xMidYMid meet" opacity="0.92"/>`,
    "</svg>",
  ].join("");
}

function createFloorPlanMinimapSvg() {
  const drawing = buildDrawingFromFloorPlan(panoramaViewerFloorPlan);
  if (!drawing?.bounds || drawing.stats.drawableCount === 0) {
    return "";
  }

  const parts = [`<svg viewBox="0 0 ${panoramaMinimapWidth} ${panoramaMinimapHeight}" aria-hidden="true" preserveAspectRatio="xMidYMid meet">`];
  drawing.polylines.forEach((polyline) => {
    const points = polyline.points.map((point) => projectPanoramaMapPoint(point, drawing.bounds)).map((point) => `${point.svgX},${point.svgY}`).join(" ");
    if (!points) {
      return;
    }
    const tagName = polyline.closed ? "polygon" : "polyline";
    const fill = polyline.closed && polyline.role === "room_boundary" ? "rgb(255 253 246 / 0.12)" : "none";
    parts.push(`<${tagName} points="${points}" class="mini-floor-${polyline.role}" fill="${fill}"/>`);
  });
  drawing.lines.forEach((line) => {
    const start = projectPanoramaMapPoint(line.start, drawing.bounds);
    const end = projectPanoramaMapPoint(line.end, drawing.bounds);
    parts.push(`<line x1="${start.svgX}" y1="${start.svgY}" x2="${end.svgX}" y2="${end.svgY}" class="mini-floor-${line.role}"/>`);
  });
  drawing.points.forEach((point) => {
    const projected = projectPanoramaMapPoint(point.position, drawing.bounds);
    parts.push(`<circle cx="${projected.svgX}" cy="${projected.svgY}" r="${point.role === "door" ? 1.9 : 1.5}" class="mini-floor-${point.role}"/>`);
  });
  parts.push("</svg>");
  return parts.join("");
}

function getPanoramaSceneMapPoint(scene, index) {
  const floorPlanPoint = getFloorPlanSceneMapPoint(scene);
  if (floorPlanPoint) {
    return floorPlanPoint;
  }
  const renderPoint = getRenderSpecSceneMapPoint(scene);
  if (renderPoint) {
    return renderPoint;
  }
  const point = panoramaViewerMapPoints.find((item) => {
    const sceneId = item.sceneId || item.scene_id;
    const roomId = item.roomId || item.room_id;
    return sceneId === scene.id || sceneId === scene.sceneId || roomId === scene.roomId || roomId === scene.room_id;
  });
  return point || panoramaMapPoint(index, panoramaViewerScenes.length);
}

function getFloorPlanSceneMapPoint(scene) {
  const drawing = buildDrawingFromFloorPlan(panoramaViewerFloorPlan);
  const boundary = findFloorPlanMapBoundary(scene);
  if (!drawing?.bounds || !boundary) {
    return null;
  }
  const anchor = nearestFloorPlanDoorForBoundary(boundary) || boundary.center;
  return isPoint(anchor) ? projectPanoramaMapPoint(normalizePoint(anchor), drawing.bounds) : null;
}

function findFloorPlanMapBoundary(scene) {
  const boundaries = panoramaViewerFloorPlan?.room_boundaries || [];
  const keys = new Set([
    scene?.roomId,
    scene?.room_id,
    scene?.target_room_id,
    scene?.id,
    scene?.sceneId,
    scene?.scene_id,
    String(scene?.name || "").replace(/\s*全景$/, "").trim(),
  ].filter(Boolean).map(String));
  return boundaries.find((boundary) => {
    const boundaryKeys = [boundary.id, boundary.label_id, boundary.name].filter(Boolean).map(String);
    return boundaryKeys.some((key) => keys.has(key));
  }) || null;
}

function nearestFloorPlanDoorForBoundary(boundary) {
  const polygon = (boundary?.polygon || []).filter(isPoint);
  const doors = (panoramaViewerFloorPlan?.doors || []).filter((door) => isPoint(door.center));
  if (!polygon.length || !doors.length) {
    return null;
  }
  const candidates = doors
    .map((door) => ({ point: door.center, distance: pointPolygonDistance(door.center, polygon) }))
    .filter((item) => item.distance <= 900);
  return candidates.length ? candidates.sort((a, b) => a.distance - b.distance)[0].point : null;
}

function getRenderSpecSceneMapPoint(scene) {
  const renderSpec = panoramaViewerRenderSpec;
  const bounds = getPanoramaMinimapBounds(renderSpec);
  const boundary = findPanoramaMapBoundary(scene);
  if (!renderSpec || !bounds || !boundary) {
    return null;
  }
  const anchor = nearestPanoramaDoorForBoundary(boundary) || boundary.center;
  return isPoint(anchor) ? projectPanoramaMapPoint(anchor, bounds) : null;
}

function findPanoramaMapBoundary(scene) {
  const renderSpec = panoramaViewerRenderSpec;
  const boundaries = renderSpec?.room_boundaries || [];
  const keys = new Set([
    scene?.roomId,
    scene?.room_id,
    scene?.id,
    scene?.sceneId,
    scene?.scene_id,
    String(scene?.name || "").replace(/\s*全景$/, "").trim(),
  ].filter(Boolean).map(String));
  return boundaries.find((boundary) => {
    const boundaryKeys = [boundary.id, boundary.label_id, boundary.name].filter(Boolean).map(String);
    return boundaryKeys.some((key) => keys.has(key));
  }) || null;
}

function nearestPanoramaDoorForBoundary(boundary) {
  const polygon = (boundary?.polygon || []).filter(isPoint);
  const doors = (panoramaViewerRenderSpec?.openings || []).filter((opening) => opening.kind === "door" && isPoint(opening.center));
  if (!polygon.length || !doors.length) {
    return null;
  }
  const candidates = doors
    .map((door) => ({ point: door.center, distance: pointPolygonDistance(door.center, polygon) }))
    .filter((item) => item.distance <= 900);
  return candidates.length ? candidates.sort((a, b) => a.distance - b.distance)[0].point : null;
}

function getPanoramaMinimapBounds(renderSpec) {
  if (!renderSpec) {
    return null;
  }
  const rawBounds = renderSpec.bounds || {};
  const minX = Number(rawBounds.min_x);
  const minY = Number(rawBounds.min_y);
  const maxX = Number(rawBounds.max_x);
  const maxY = Number(rawBounds.max_y);
  if (Number.isFinite(minX) && Number.isFinite(minY) && Number.isFinite(maxX) && Number.isFinite(maxY)) {
    return {
      minX,
      minY,
      maxX,
      maxY,
    };
  }
  const points = [];
  (renderSpec.room_boundaries || []).forEach((boundary) => {
    (boundary.polygon || []).filter(isPoint).forEach((point) => points.push(point));
    if (isPoint(boundary.center)) points.push(boundary.center);
  });
  (renderSpec.walls || []).forEach((wall) => {
    if (isPoint(wall.start)) points.push(wall.start);
    if (isPoint(wall.end)) points.push(wall.end);
  });
  (renderSpec.openings || []).forEach((opening) => {
    if (isPoint(opening.center)) points.push(opening.center);
  });
  if (!points.length) {
    return null;
  }
  return {
    minX: Math.min(...points.map((point) => point.x)),
    minY: Math.min(...points.map((point) => point.y)),
    maxX: Math.max(...points.map((point) => point.x)),
    maxY: Math.max(...points.map((point) => point.y)),
  };
}

function projectPanoramaMapPoint(point, bounds) {
  const width = Math.max(bounds.maxX - bounds.minX, 1);
  const height = Math.max(bounds.maxY - bounds.minY, 1);
  const fitWidth = Math.max(panoramaMinimapWidth - panoramaMinimapPadding * 2, 1);
  const fitHeight = Math.max(panoramaMinimapHeight - panoramaMinimapPadding * 2, 1);
  const scale = Math.min(fitWidth / width, fitHeight / height);
  const drawnWidth = width * scale;
  const drawnHeight = height * scale;
  const offsetX = (panoramaMinimapWidth - drawnWidth) / 2;
  const offsetY = (panoramaMinimapHeight - drawnHeight) / 2;
  const svgX = offsetX + (point.x - bounds.minX) * scale;
  const svgY = offsetY + (bounds.maxY - point.y) * scale;
  return {
    svgX,
    svgY,
    x: Math.max(3, Math.min(97, (svgX / panoramaMinimapWidth) * 100)),
    y: Math.max(3, Math.min(97, (svgY / panoramaMinimapHeight) * 100)),
  };
}

function pointPolygonDistance(point, polygon) {
  if (pointInPolygon(point, polygon)) {
    return 0;
  }
  return Math.min(...polygon.map((start, index) => pointSegmentDistance(point, start, polygon[(index + 1) % polygon.length])));
}

function pointInPolygon(point, polygon) {
  let inside = false;
  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index++) {
    const currentPoint = polygon[index];
    const previousPoint = polygon[previous];
    const intersects = ((currentPoint.y > point.y) !== (previousPoint.y > point.y))
      && (point.x < ((previousPoint.x - currentPoint.x) * (point.y - currentPoint.y)) / ((previousPoint.y - currentPoint.y) || 1e-9) + currentPoint.x);
    if (intersects) inside = !inside;
  }
  return inside;
}

function pointSegmentDistance(point, start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  if (dx === 0 && dy === 0) {
    return Math.hypot(point.x - start.x, point.y - start.y);
  }
  const t = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(point.x - (start.x + t * dx), point.y - (start.y + t * dy));
}

function panoramaMapPoint(index, count) {
  const columns = Math.min(Math.max(count, 1), 3);
  const row = Math.floor(index / columns);
  const column = index % columns;
  return {
    x: 18 + column * 31,
    y: 24 + row * 28,
  };
}

function clampPanoramaPitch(value) {
  return Math.max(-Math.PI * 0.42, Math.min(Math.PI * 0.42, value));
}

function normalizePanoramaAngle(value) {
  let angle = value;
  while (angle > Math.PI) angle -= Math.PI * 2;
  while (angle < -Math.PI) angle += Math.PI * 2;
  return angle;
}

function renderVersionPane(sample) {
  if (!versionList) {
    return;
  }

  if (!hasFinalVersion(sample)) {
    versionList.replaceChildren(createEmptyState("暂无方案版本", "第一版方案生成成功后会写入 V1；之后每次调整都会新增版本。"));
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
    const qualityLabel = version.deliverable ? "可交付" : isRealPanoramaPackage(version.vrPackage) ? "可查看" : "草稿";
    summary.textContent = version.adjustments?.length
      ? `${qualityLabel}，应用 ${version.adjustments.length} 条调整，${version.scenes.length} 个场景。`
      : `${qualityLabel}，未额外调整，${version.scenes.length} 个场景。`;
    card.append(label, title, summary);
    card.addEventListener("click", () => {
      sample.activeVersionId = version.id;
      activeRoomId = version.scenes[0]?.id || activeRoomId;
      activeAdjustSceneId = version.scenes[0]?.id || activeAdjustSceneId;
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
