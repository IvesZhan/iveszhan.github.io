export const APP_CONFIG = {
  account: {
    // client: only owner-facing schemes. designer: show import/version/model/resource tools.
    role: "client",
    name: "业主交付",
  },
  featureFlags: {
    // Set true to expose designer tools regardless of account role.
    designerWorkspace: false,
  },
};
