export const APP_CONFIG = {
  publishedProjects: ["./assets/projects/jindi-dacheng-cream/manifest.json"],
  api: {
    // Enable only after the Container deployment and designer allowlist are ready.
    cloudAuth: false,
    baseUrl: ["localhost", "127.0.0.1"].includes(window.location.hostname)
      ? "http://127.0.0.1:8010"
      : "https://ai-interior-design-api.ives-c29.workers.dev",
    useBackendFloorValidation: true,
  },
  account: {
    // client: only owner-facing schemes. designer: show import/version/model/resource tools.
    role: "designer",
    name: "设计师工作台",
    loginEndpoint: "https://aw.aoscdn.com/base/passport/v2/login/telephone",
    countryCode: "+86",
    productId: "482",
    language: "zh",
  },
  featureFlags: {
    // Set true to expose designer tools regardless of account role.
    designerWorkspace: true,
  },
  vrViewer: {
    photoSphere: {
      moduleUrl: "https://esm.sh/@photo-sphere-viewer/core@5?bundle",
      stylesheetUrl: "https://cdn.jsdelivr.net/npm/@photo-sphere-viewer/core@5/index.min.css",
    },
  },
};
