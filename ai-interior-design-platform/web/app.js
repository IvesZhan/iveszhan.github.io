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
const tabButtons = [...document.querySelectorAll("[data-tab]")];
const panels = [...document.querySelectorAll("[data-panel]")];
const accountLabel = document.querySelector("#accountLabel");
const sampleList = document.querySelector("#sampleList");
const roomStrip = document.querySelector("#roomStrip");
const projectName = document.querySelector("#currentProjectName");
const schemeImage = document.querySelector("#schemeImage");
const schemeRoom = document.querySelector("#schemeRoom");
const schemeVersion = document.querySelector("#schemeVersion");
const schemeTitle = document.querySelector("#schemeTitle");
const schemeSummary = document.querySelector("#schemeSummary");
const schemeArea = document.querySelector("#schemeArea");
const schemeStyle = document.querySelector("#schemeStyle");
const schemeDelivery = document.querySelector("#schemeDelivery");
const vrLink = document.querySelector("[data-local-preview]");
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

let activeTab = "samples";
let activeSampleId = availableSamples[0].id;
let activeRoomId = availableSamples[0].rooms[0].id;

applyRole();
configureLocalPreview();
bindNavigation();
renderSampleList();
renderScheme();
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
  if (!vrLink) {
    return;
  }

  const localHosts = ["localhost", "127.0.0.1", "::1", ""];
  if (localHosts.includes(window.location.hostname)) {
    vrLink.href = vrLink.dataset.localPreview;
    vrLink.target = "_blank";
    vrLink.rel = "noreferrer";
  }
}

function bindNavigation() {
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => setTab(button.dataset.tab));
  });

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

  document.querySelector("[data-back-to-library]")?.addEventListener("click", () => {
    setTab("samples");
  });

  schemeTabButtons.forEach((button) => {
    button.addEventListener("click", () => setSchemePane(button.dataset.schemeTab));
  });
}

function setTab(tab) {
  if (!canUseDesignerWorkspace && isDesignerTab(tab)) {
    return;
  }

  activeTab = tab;

  tabButtons.forEach((button) => {
    const isActive = button.dataset.tab === tab;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

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
  const tabButton = tabButtons.find((button) => button.dataset.tab === tab);
  return Boolean(tabButton?.hasAttribute("data-designer-only"));
}

function renderSampleList() {
  sampleList.replaceChildren(
    ...availableSamples.map((sample) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = sample.id === activeSampleId ? "scheme-card is-active" : "scheme-card";
      button.innerHTML = `
        <span>${sample.status}</span>
        <strong>${sample.name}</strong>
        <small>${sample.title}</small>
      `;
      button.addEventListener("click", () => {
        activeSampleId = sample.id;
        activeRoomId = sample.rooms[0].id;
        renderSampleList();
        renderScheme();
      });
      return button;
    })
  );
}

function renderScheme() {
  const sample = availableSamples.find((item) => item.id === activeSampleId) ?? availableSamples[0];
  const room = sample.rooms.find((item) => item.id === activeRoomId) ?? sample.rooms[0];

  projectName.textContent = `${sample.name} · ${sample.title}`;
  schemeImage.src = room.image;
  schemeImage.alt = room.alt;
  schemeRoom.textContent = room.name;
  schemeVersion.textContent = sample.status;
  schemeTitle.textContent = `${sample.name} · ${sample.title}`;
  schemeSummary.textContent = sample.summary;
  schemeArea.textContent = sample.area;
  schemeStyle.textContent = sample.style;
  schemeDelivery.textContent = sample.delivery;
  detailStatus.textContent = sample.status;
  detailTitle.textContent = `${sample.name} · ${sample.title}`;
  detailImage.src = room.image;
  detailImage.alt = room.alt;
  detailRoomName.textContent = room.name;
  detailSummary.textContent = sample.summary;
  detailArea.textContent = sample.area;
  detailStyle.textContent = sample.style;
  detailDelivery.textContent = sample.delivery;

  roomStrip.replaceChildren(
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
