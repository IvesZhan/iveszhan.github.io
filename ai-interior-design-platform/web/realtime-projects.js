export const REALTIME_SESSION_KEY = "xspace-cloud-session";

export async function requestRealtime(baseUrl, path, { method = "GET", body, shared = false, contentType, signal } = {}) {
  const headers = new Headers({ Accept: "application/json" });
  const binary = body instanceof Blob;
  if (body !== undefined) headers.set("Content-Type", binary ? (contentType || body.type) : "application/json");
  if (!shared) {
    const token = sessionStorage.getItem(REALTIME_SESSION_KEY);
    if (!token) throw Object.assign(new Error("请登录设计师工作台。"), { status: 401 });
    headers.set("Authorization", `Bearer ${token}`);
  }
  const response = await fetch(`${baseUrl}/api/v1${path}`, {
    method, headers, body: binary ? body : JSON.stringify(body), signal,
    referrerPolicy: "no-referrer", cache: "no-store",
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw Object.assign(new Error(result.detail || "实时方案服务暂时无法处理请求。"), {
      status: response.status, code: result.code,
    });
  }
  return result;
}

export function realtimeMusic(musicId, projectId, versionId) {
  return musicId === "woodlight" ? {
    url: "./assets/projects/jindi-dacheng-cream/woodlight.mp3", title: "木窗微光", projectId, versionId,
  } : null;
}

export function readRealtimeShare(hash) {
  const value = new URLSearchParams(hash.slice(1)).get("share");
  return value && /^[a-f0-9]{64}$/.test(value) ? value : null;
}

export function makeRealtimeShareUrl(token, pathname = window.location.pathname) {
  const url = new URL(pathname, window.location.origin);
  url.hash = `share=${encodeURIComponent(token)}`;
  return url.href;
}

export function makeRealtimeStudioUrl(projectId, versionId) {
  const url = new URL("./studio-workspace.html", import.meta.url);
  url.searchParams.set("project", projectId);
  if (versionId) url.searchParams.set("version", versionId);
  return url.href;
}
