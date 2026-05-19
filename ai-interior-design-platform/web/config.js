export const APP_CONFIG = {
  api: {
    baseUrl: "http://127.0.0.1:8010",
    useBackendFloorValidation: true,
  },
  account: {
    // client: only owner-facing schemes. designer: show import/version/model/resource tools.
    role: "designer",
    name: "设计师工作台",
  },
  featureFlags: {
    // Set true to expose designer tools regardless of account role.
    designerWorkspace: true,
  },
};
