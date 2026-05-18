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
    summary: "已完成客餐厅、餐厅、主卧等关键空间效果预览，支持进入方案工作区和 VR 全景查看。",
    rooms: [
      {
        id: "living",
        name: "客餐厅",
        image: "./assets/living-dining.jpg",
        alt: "益兴园客餐厅效果图",
      },
      {
        id: "wide",
        name: "客厅",
        image: "./assets/living-wide.jpg",
        alt: "益兴园客厅效果图",
      },
      {
        id: "dining",
        name: "餐厅",
        image: "./assets/dining-sideboard.jpg",
        alt: "益兴园餐边柜效果图",
      },
      {
        id: "bedroom",
        name: "主卧",
        image: "./assets/master-bedroom.jpg",
        alt: "益兴园主卧效果图",
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
    delivery: "效果图",
    summary: "已完成户型解析和基础硬装策略，等待补充参考图和局部空间效果。",
    designerOnly: true,
    rooms: [
      {
        id: "plan",
        name: "户型",
        image: "./assets/hero-birdview.png",
        alt: "建宁府户型预览",
      },
    ],
  },
  {
    id: "base-plan",
    name: "基础户型",
    title: "空间解析样例",
    status: "V0 · 数据校对",
    area: "待确认",
    style: "未选择",
    delivery: "户型预览",
    summary: "用于验证 CAD 图层、空间边界、房间名称和基础渲染规格。",
    designerOnly: true,
    rooms: [
      {
        id: "plan",
        name: "户型",
        image: "./assets/hero-birdview.png",
        alt: "基础户型预览",
      },
    ],
  },
];

const role = resolveAccountRole();
const canUseDesignerWorkspace =
  role === "designer" || APP_CONFIG.featureFlags.designerWorkspace === true;
const availableSamples = canUseDesignerWorkspace
  ? samples
  : samples.filter((sample) => !sample.designerOnly);

const body = document.body;
const panels = [...document.querySelectorAll("[data-panel]")];
const accountLabel = document.querySelector("#accountLabel");
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
const schemeTabButtons = [...document.querySelectorAll("[data-scheme-tab]")];
const schemePanes = [...document.querySelectorAll("[data-scheme-pane]")];
const importStepInputs = [...document.querySelectorAll("[data-import-step]")];
const assetOptions = [...document.querySelectorAll("[data-asset-option]")];
const importProgress = document.querySelector("[data-import-progress]");
const generateButton = document.querySelector("[data-generate-plan]");
const importSteps = ["floor", "brief", "references", "assets"];
const importState = Object.fromEntries(importSteps.map((step) => [step, false]));

let activeTab = "samples";
let activeSampleId = availableSamples[0].id;
let activeRoomId = availableSamples[0].rooms[0].id;

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
  accountLabel.textContent = canUseDesignerWorkspace ? "设计师工作台" : APP_CONFIG.account.name;
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

    input.addEventListener("change", () => {
      const step = input.dataset.importStep;
      importState[step] = input.files.length > 0;
      updateUploadLabel(input);
      updateGenerateState();
    });
  });

  assetOptions.forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("is-selected");
      importState.assets = assetOptions.some((option) => option.classList.contains("is-selected"));
      updateGenerateState();
    });
  });
}

function updateUploadLabel(input) {
  const label = input.closest(".upload-zone")?.querySelector("[data-upload-label]");
  if (!label) {
    return;
  }

  label.textContent = input.files.length > 0 ? `已选择 ${input.files.length} 个文件` : label.dataset.defaultLabel;
}

function updateGenerateState() {
  const completedCount = importSteps.filter((step) => importState[step]).length;
  const isReady = completedCount === importSteps.length;

  document.querySelectorAll("[data-step-card]").forEach((card) => {
    card.classList.toggle("is-complete", Boolean(importState[card.dataset.stepCard]));
  });

  if (importProgress) {
    importProgress.textContent = `${completedCount}/4 步已完成`;
  }

  if (generateButton) {
    generateButton.disabled = !isReady;
    generateButton.setAttribute("aria-disabled", String(!isReady));
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
      <span class="project-body">
        <strong>导入生成空间方案</strong>
        <small>完成户型、设计说明、参考图和本地资产选择，生成可进入详情页操作的空间方案。</small>
        <span class="import-specs">
          <span>CAD / DXF</span>
          <span>参考图</span>
          <span>本地资产</span>
        </span>
        <span class="add-link">开始导入</span>
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
          <strong>${sample.name}</strong>
          <small>${sample.title}</small>
          <span class="project-summary">${sample.summary}</span>
          <span class="project-stats" aria-label="方案参数">
            <span><b>${sample.area}</b><em>面积</em></span>
            <span><b>${sample.style}</b><em>风格</em></span>
            <span><b>${sample.rooms.length}</b><em>空间</em></span>
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
