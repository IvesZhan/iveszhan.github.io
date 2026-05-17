export const APP_CONFIG = {
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
