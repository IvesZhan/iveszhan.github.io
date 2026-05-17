const styles = [
  {
    id: "mid-century",
    name: "中古风",
    note: "中浅木色、米白墙面、暖棕点缀",
    colors: ["#875735", "#f1ece2", "#6d735b"],
  },
  {
    id: "cream",
    name: "奶油风",
    note: "暖白、浅木、低饱和软装",
    colors: ["#f3e6d0", "#fffaf1", "#c9ad86"],
  },
  {
    id: "modern",
    name: "现代简约",
    note: "清爽墙面、简洁线条、黑白灰控制",
    colors: ["#171411", "#f7f4ec", "#9a9a91"],
  },
  {
    id: "natural",
    name: "原木风",
    note: "木色地面、白墙、自然织物",
    colors: ["#b17743", "#f5efe3", "#8a927a"],
  },
];

const rooms = [
  {
    id: "living",
    name: "客餐厅",
    summary: "当前样例优先沉淀餐边柜、电视柜、沙发、餐桌椅、灯具和窗帘资产。",
  },
  {
    id: "kitchen",
    name: "厨房",
    summary: "下一步补橱柜、烟机、水槽、台面、墙砖和灯带规则，支持局部重渲染。",
  },
  {
    id: "bedroom",
    name: "主卧",
    summary: "需要沉淀床、床头背景、衣柜、窗帘、床头灯和暖光模板。",
  },
  {
    id: "bathroom",
    name: "卫生间",
    summary: "先记录洁具、浴室柜、墙地砖和镜柜资产，后续做湿区模板。",
  },
];

const assets = [
  ["硬装", "吊顶、踢脚线、护墙板、背景墙"],
  ["定制柜", "电视柜、餐边柜、橱柜、衣柜"],
  ["家具", "沙发、餐桌椅、床、书桌"],
  ["灯光", "吊灯、筒灯、灯带、台灯"],
  ["软装", "窗帘、地毯、装饰画、绿植"],
];

const styleOptions = document.querySelector("#styleOptions");
const styleStatus = document.querySelector("#styleStatus");
const roomSwitcher = document.querySelector("#roomSwitcher");
const roomStatus = document.querySelector("#roomStatus");
const roomSummary = document.querySelector("#roomSummary");
const assetList = document.querySelector("#assetList");
const nextAction = document.querySelector("#nextAction");
const previewLink = document.querySelector(".preview-link");

let activeStyle = styles[0].id;
let activeRoom = rooms[0].id;

renderStyles();
renderRooms();
renderAssets();
configurePreviewLink();
bindActions();

function configurePreviewLink() {
  const isLocal = ["localhost", "127.0.0.1", "::1"].includes(location.hostname);
  if (isLocal && previewLink.dataset.localPreview) {
    previewLink.href = previewLink.dataset.localPreview;
    previewLink.textContent = "打开 VR 样例";
    previewLink.target = "_blank";
    previewLink.rel = "noreferrer";
  }
}

function renderStyles() {
  styleOptions.replaceChildren(
    ...styles.map((item) => {
      const button = document.createElement("button");
      button.className = `style-option${item.id === activeStyle ? " is-active" : ""}`;
      button.type = "button";
      button.innerHTML = `
        <span class="swatches">${item.colors.map((color) => `<span style="background:${color}"></span>`).join("")}</span>
        <span><strong>${item.name}</strong><small>${item.note}</small></span>
      `;
      button.addEventListener("click", () => {
        activeStyle = item.id;
        styleStatus.textContent = item.name;
        renderStyles();
      });
      return button;
    })
  );
}

function renderRooms() {
  roomSwitcher.replaceChildren(
    ...rooms.map((room) => {
      const button = document.createElement("button");
      button.className = room.id === activeRoom ? "is-active" : "";
      button.type = "button";
      button.textContent = room.name;
      button.addEventListener("click", () => {
        activeRoom = room.id;
        roomStatus.textContent = room.name;
        roomSummary.textContent = room.summary;
        renderRooms();
      });
      return button;
    })
  );
  roomSummary.textContent = rooms.find((room) => room.id === activeRoom).summary;
}

function renderAssets() {
  assetList.replaceChildren(
    ...assets.map(([name, detail]) => {
      const row = document.createElement("div");
      row.className = "asset-row";
      row.innerHTML = `<strong>${name}</strong><span>${detail}</span>`;
      return row;
    })
  );
}

function bindActions() {
  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      const copy = {
        style: "把益兴园效果图沉淀成第一版中古风风格包",
        asset: "建立 assets/catalog/assets.json，先记录客餐厅和厨房资产",
        editor: "定义 EditableDesignState，支撑后续用户局部调整",
      };
      nextAction.textContent = copy[action];
    });
  });
}
