(function () {
  var links = window.ZENSEE_DOWNLOAD_LINKS || {};
  var placeholderPattern = /YOUR_APP_ID|YOUR_PACKAGE_NAME/;

  function isConfigured(url) {
    return typeof url === "string" && /^https?:\/\//.test(url) && !placeholderPattern.test(url);
  }

  function normalizeLocale(value) {
    var lang = String(value || "").toLowerCase();
    if (lang.indexOf("zh-hant") === 0) {
      return "zh-hant";
    }
    if (
      lang.indexOf("zh-tw") === 0 ||
      lang.indexOf("zh-hk") === 0 ||
      lang.indexOf("zh-mo") === 0
    ) {
      return "zh-hant";
    }
    if (lang.indexOf("ja") === 0) {
      return "ja";
    }
    if (lang.indexOf("en") === 0) {
      return "en";
    }
    return "zh-cn";
  }

  function resolveAndroidLink(currentLocale, currentLinks, fallbackLink) {
    var zhCnLink = isConfigured(currentLinks.androidZhCn) ? currentLinks.androidZhCn : fallbackLink;
    var globalLink = isConfigured(currentLinks.androidGlobal)
      ? currentLinks.androidGlobal
      : (isConfigured(currentLinks.android) ? currentLinks.android : fallbackLink);

    return currentLocale === "zh-cn" ? zhCnLink : globalLink;
  }

  function detectPlatform() {
    var ua = navigator.userAgent || "";
    var isAndroid = /Android/i.test(ua);
    var harmonyVersion = /HarmonyOS[\s\/-]+(\d+)/i.exec(ua);
    // 与共享导航一致，原生鸿蒙优先于 UA 中的 Android 兼容标记。
    if (/OpenHarmony|HarmonyOS\s*NEXT/i.test(ua) ||
      (harmonyVersion && Number(harmonyVersion[1]) >= 5) ||
      (/HarmonyOS/i.test(ua) && !harmonyVersion && !isAndroid)) {
      return "harmony";
    }
    var isIOS = /iPhone|iPad|iPod/i.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    if (isIOS) {
      return "ios";
    }
    if (isAndroid) {
      return "android";
    }
    return "fallback";
  }

  var buttons = document.querySelectorAll("[data-download-button]");
  var primary = buttons.length > 0 ? buttons[0] : null;
  var pageFallback = primary ? primary.getAttribute("href") : "";
  var fallback = isConfigured(links.fallback) ? links.fallback :
    (isConfigured(pageFallback) ? pageFallback : "https://iveszhan.github.io/zensee/web/support/");
  var iosLink = isConfigured(links.ios) ? links.ios : fallback;
  var locale = normalizeLocale(document.documentElement.lang || navigator.language);
  var androidLink = resolveAndroidLink(locale, links, fallback);
  var harmonyLink = isConfigured(links.harmony) ? links.harmony : "https://appgallery.huawei.com/app/detail?id=com.zensee.app";
  var androidReady = isConfigured(androidLink);
  var platform = detectPlatform();
  var resolved = platform === "ios" ? iosLink :
    (platform === "harmony" ? harmonyLink : (platform === "android" ? androidLink : "#hero-downloads"));
  var labels = {
    "zh-cn": { ios: "下载 iOS 版", android: "下载 Android 版", harmony: "下载鸿蒙版", fallback: "选择下载版本" },
    "zh-hant": { ios: "下載 iOS 版", android: "下載 Android 版", harmony: "下載鴻蒙版", fallback: "選擇下載版本" },
    en: { ios: "Download for iOS", android: "Download for Android", harmony: "Download for HarmonyOS", fallback: "Choose your version" },
    ja: { ios: "iOS版を入手", android: "Android版を入手", harmony: "HarmonyOS版を入手", fallback: "バージョンを選ぶ" }
  };
  var picker = document.querySelector(".platform-picker");
  if (picker && platform === "fallback") {
    picker.open = true;
  }

  for (var i = 0; i < buttons.length; i += 1) {
    var button = buttons[i];
    var target = button.getAttribute("data-platform");

    if (target === "ios") {
      button.href = iosLink;
      continue;
    }

    if (target === "android") {
      button.href = androidLink;
      if (!androidReady) {
        button.addEventListener("click", function (event) {
          event.preventDefault();
          var message = this.getAttribute("data-coming-soon") || "Coming soon";
          window.alert(message);
        });
      }
      continue;
    }

    if (target === "harmony") {
      button.href = harmonyLink;
      continue;
    }

    if (platform === "android" && !androidReady) {
      button.href = androidLink;
      button.addEventListener("click", function (event) {
        event.preventDefault();
        var message = this.getAttribute("data-coming-soon") || "Coming soon";
        window.alert(message);
      });
      continue;
    }

    button.href = resolved;
    if (button.hasAttribute("data-auto-download-label")) {
      button.textContent = labels[locale][platform];
    }
  }
}());
