export const REALTIME_SESSION_KEY = "xspace-cloud-session";

export async function requestRealtime(baseUrl, path, { method = "GET", body, shared = false } = {}) {
  const headers = new Headers({ Accept: "application/json" });
  if (body !== undefined) headers.set("Content-Type", "application/json");
  if (!shared) {
    const token = sessionStorage.getItem(REALTIME_SESSION_KEY);
    if (!token) throw Object.assign(new Error("请登录设计师工作台。"), { status: 401 });
    headers.set("Authorization", `Bearer ${token}`);
  }
  const response = await fetch(`${baseUrl}/api/v1${path}`, {
    method, headers, body: body === undefined ? undefined : JSON.stringify(body),
    referrerPolicy: "no-referrer", cache: "no-store",
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw Object.assign(new Error(result.detail || "实时方案服务暂时无法处理请求。"), { status: response.status });
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

export function makeRealtimeShareUrl(token) {
  const url = new URL(window.location.pathname, window.location.origin);
  url.hash = `share=${encodeURIComponent(token)}`;
  return url.href;
}
