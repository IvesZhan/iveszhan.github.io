import dd, { openLink } from "dingtalk-jsapi";
import { openAuth } from "dingtalk-design-libs/biz/openAuth";

const DEFAULT_RETURN_URL = "https://iveszhan.github.io/zensee/dingtalk-auth/";
const DEFAULT_APP_RETURN_URL = "zensee://auth/dingtalk-login";
const DEFAULT_CLIENT_ID = "dinggfbar3acbwmhawve";
const DEFAULT_CORP_ID = "dingb30bc4a6f95b2caf";
const DEFAULT_SCOPE = "Contact.User.Read";

const params = new URLSearchParams(window.location.search);
const titleNode = document.getElementById("title");
const summaryNode = document.getElementById("summary");
const hintNode = document.getElementById("hint");
const statusNode = document.getElementById("status");
const detailsNode = document.getElementById("details");
const retryButton = document.getElementById("retry-button");
const returnLink = document.getElementById("return-link");

const clientId = params.get("client_id") || DEFAULT_CLIENT_ID;
const corpId = params.get("corp_id") || DEFAULT_CORP_ID;
const state = params.get("state") || "";
const returnTo = params.get("return_to") || DEFAULT_RETURN_URL;
const appReturnTo = params.get("app_return_to") || DEFAULT_APP_RETURN_URL;
const autoStart = params.get("auto") !== "0";

let isSubmitting = false;

function setStatus(message, type = "") {
  statusNode.textContent = message;
  statusNode.className = type ? `status ${type}` : "status";
}

function buildReturnURL(queryParams) {
  const [base, existingQuery = ""] = returnTo.split("?");
  const merged = new URLSearchParams(existingQuery);
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }
    merged.set(key, value);
  });

  const query = merged.toString();
  return query ? `${base}?${query}` : base;
}

function showDetails(lines) {
  detailsNode.textContent = lines.join("\n");
}

function baseDetailLines() {
  return [
    `clientId: ${clientId}`,
    `corpId: ${corpId}`,
    `scope: ${DEFAULT_SCOPE}`,
    `state: ${state || "(empty)"}`,
    `returnTo: ${returnTo}`,
    `appReturnTo: ${appReturnTo}`,
    `env: ${/DingTalk/i.test(navigator.userAgent || "") ? "DingTalk" : "Browser"}`,
    `openLink: ${typeof openLink === "function" ? "available" : "missing"}`,
    `launchApp: ${typeof dd?.device?.launcher?.launchApp === "function" ? "available" : "missing"}`
  ];
}

function buildAppReturnURL(queryParams) {
  const [base, existingQuery = ""] = appReturnTo.split("?");
  const merged = new URLSearchParams(existingQuery);
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }
    merged.set(key, value);
  });

  const query = merged.toString();
  return query ? `${base}?${query}` : base;
}

async function openCallbackURL(callbackURL, fallbackURL = returnTo) {
  returnLink.href = callbackURL;
  showDetails([
    ...baseDetailLines(),
    `callbackURL: ${callbackURL}`,
    `fallbackURL: ${fallbackURL}`
  ]);

  const isDingTalk = /DingTalk/i.test(navigator.userAgent || "");
  if (isDingTalk && typeof dd?.device?.launcher?.launchApp === "function") {
    try {
      const launchResult = await dd.device.launcher.launchApp({
        app: callbackURL
      });
      if (launchResult?.result === true) {
        return;
      }

      showDetails([
        ...baseDetailLines(),
        `callbackURL: ${callbackURL}`,
        `fallbackURL: ${fallbackURL}`,
        `launchAppResult: ${JSON.stringify(launchResult)}`
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : JSON.stringify(error);
      showDetails([
        ...baseDetailLines(),
        `callbackURL: ${callbackURL}`,
        `fallbackURL: ${fallbackURL}`,
        `launchAppError: ${message || "unknown"}`
      ]);
    }
  }

  if (isDingTalk && typeof openLink === "function") {
    try {
      await openLink({ url: fallbackURL });
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : JSON.stringify(error);
      showDetails([
        ...baseDetailLines(),
        `callbackURL: ${callbackURL}`,
        `fallbackURL: ${fallbackURL}`,
        `openLinkError: ${message || "unknown"}`
      ]);
    }
  }

  window.location.href = fallbackURL;
}

function jumpBackToZenSee(queryParams) {
  const appCallbackURL = buildAppReturnURL(queryParams);
  const fallbackURL = buildReturnURL(queryParams);
  void openCallbackURL(appCallbackURL, fallbackURL);
}

function describeEnvironment() {
  const userAgent = navigator.userAgent || "";
  const isDingTalk = /DingTalk/i.test(userAgent);
  showDetails(baseDetailLines());

  if (!isDingTalk) {
    titleNode.textContent = "请在钉钉内完成授权";
    summaryNode.textContent = "这个页面需要运行在钉钉 App 内，才能调用钉钉官方授权组件。";
    hintNode.textContent = "请从 ZenSee 发起钉钉登录，或把这个地址配置为钉钉 H5 微应用首页。";
    setStatus("当前环境不是钉钉 App，授权组件不可用。", "error");
    return false;
  }

  return true;
}

async function requestAuthorization() {
  if (isSubmitting) {
    return;
  }

  if (!describeEnvironment()) {
    return;
  }

  isSubmitting = true;
  retryButton.disabled = true;
  setStatus("正在打开钉钉授权面板…");
  titleNode.textContent = "请在钉钉中确认授权";
  summaryNode.textContent = "ZenSee 需要读取你的钉钉基础个人信息，用于完成登录。";

  try {
    const response = await openAuth({
      clientId,
      corpId,
      rpcScope: DEFAULT_SCOPE,
      type: 0
    });

    if (!response || response.status === "cancel") {
      setStatus("你已取消钉钉授权。", "error");
      hintNode.textContent = "如果需要继续，请点击“重新发起授权”。";
      return;
    }

    if (response.status !== "ok" || !response.result || !response.result.authCode) {
      setStatus("钉钉授权失败，请重新尝试。", "error");
      hintNode.textContent = "如果问题持续，请把页面中的状态发给 Codex。";
      showDetails([
        detailsNode.textContent,
        `response: ${JSON.stringify(response)}`
      ]);
      return;
    }

    const authCode = String(response.result.authCode || "").trim();
    if (!authCode) {
      setStatus("钉钉没有返回有效的授权码。", "error");
      return;
    }

    titleNode.textContent = "授权成功，正在返回 ZenSee";
    summaryNode.textContent = "你已完成钉钉授权，ZenSee 将继续完成登录。";
    hintNode.textContent = "如果没有自动返回，请点击下方按钮。";
    setStatus("授权完成。", "success");
    showDetails([
      `clientId: ${clientId}`,
      `corpId: ${corpId}`,
      `scope: ${DEFAULT_SCOPE}`,
      `state: ${state || "(empty)"}`,
      `authCode: ${authCode}`
    ]);

    window.setTimeout(() => {
      jumpBackToZenSee({
        provider: "dingtalk",
        code: authCode,
        state
      });
    }, 220);
  } catch (error) {
    const message = error instanceof Error ? error.message : "授权组件调用失败";
    titleNode.textContent = "钉钉授权未完成";
    hintNode.textContent = "请重新发起授权；如果仍失败，把错误信息发给 Codex。";
    setStatus(message, "error");
  } finally {
    isSubmitting = false;
    retryButton.disabled = false;
  }
}

returnLink.href = DEFAULT_APP_RETURN_URL;
retryButton.addEventListener("click", requestAuthorization);
returnLink.addEventListener("click", (event) => {
  event.preventDefault();
  void openCallbackURL(returnLink.href || DEFAULT_APP_RETURN_URL, buildReturnURL({}));
});
describeEnvironment();

if (autoStart) {
  window.setTimeout(requestAuthorization, 260);
}
