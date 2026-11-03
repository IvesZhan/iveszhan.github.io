(function () {
  "use strict";
  var config = window.ZENSEE_ADMIN_CONFIG || {};
  var client = window.supabase && config.supabaseUrl && config.supabaseAnonKey
    ? window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey, { auth: { detectSessionInUrl: false } }) : null;
  var byId = function (id) { return document.getElementById(id); };
  var form = byId("policy-form");
  var session = null, userId = "", generation = 0, listRevision = 0, policies = [], editing = null, saving = false;
  var platforms = { ios: "iOS", android: "Android", harmony: "鸿蒙" };
  var downloadURLs = { ios: "https://apps.apple.com/app/id6760809128", android: "https://www.pgyer.com/zensee-android", harmony: "https://appgallery.huawei.com/app/detail?id=com.zensee.app" };
  function message(value) { byId("message").textContent = value || ""; }
  function field(name) { return form.elements.namedItem(name); }
  function current(context) { return context === generation && session && session.user.id === userId; }
  function errorText(error) {
    if (error.code === "42501") return "当前账号没有版本管理权限，请由数据库管理员授权。";
    if (error.code === "40001") return "策略已被其他人修改，请刷新后重新编辑。";
    if (error.code === "22023" || error.code === "22P02") return "请检查版本号格式，使用数字和小数点，例如 1.2.4。";
    if (error.code === "23514" || error.code === "23502") return "请检查必填项、版本范围及数值限制；最低版本不能高于最高版本。";
    return error.message || "操作失败，请稍后重试。";
  }
  function resetEditor() {
    editing = null; form.reset(); field("target_version").value = "1.2.4";
    field("update_url").value = downloadURLs.ios;
    byId("editor-title").textContent = "新建策略";
    byId("editor-section").hidden = true;
    byId("new-policy").setAttribute("aria-expanded", "false");
  }
  function setSession(next) {
    session = next;
    var nextId = next ? next.user.id : "";
    if (nextId === userId) return;
    userId = nextId; ++generation; ++listRevision; policies = []; saving = false;
    byId("save").disabled = false; byId("policy-list").replaceChildren(); resetEditor(); message("");
    byId("preview-result").textContent = "";
    byId("auth-panel").hidden = !!next;
    byId("workspace").hidden = true;
    byId("sign-out").hidden = !next;
    if (next) loadPolicies();
  }
  async function loadPolicies() {
    var context = generation, revision = ++listRevision;
    message("正在读取更新策略…");
    try {
      var result = await client.rpc("list_app_update_policies_v1");
      if (!current(context) || revision !== listRevision) return;
      if (result.error) throw result.error;
      policies = result.data || []; byId("workspace").hidden = false; renderPolicies(); message(""); return true;
    } catch (error) { if (current(context) && revision === listRevision) message(errorText(error)); return false; }
  }
  function renderPolicies() {
    var list = byId("policy-list"); list.replaceChildren();
    var platform = byId("platform-filter").value, statusFilter = byId("state-filter").value;
    var visible = policies.filter(function (policy) { return (platform === "all" || policy.platform === platform) && (statusFilter === "all" || policy.enabled === (statusFilter === "enabled")); });
    byId("policy-count").textContent = policies.length + " 条策略 · " + policies.filter(function (policy) { return policy.enabled; }).length + " 条已启用";
    if (!visible.length) { var empty = document.createElement("p"); empty.className = "empty-state"; empty.textContent = policies.length ? "没有符合筛选条件的策略。" : "还没有更新策略。点击「新建策略」开始，上架后再启用。"; list.appendChild(empty); }
    visible.forEach(function (policy) {
      var row = document.createElement("article"); row.className = "policy-row";
      var content = document.createElement("div"), title = document.createElement("h3"), status = document.createElement("span");
      title.textContent = policy.name;
      status.className = "policy-status" + (policy.force_update ? " forced" : "");
      status.textContent = [platforms[policy.platform], policy.enabled ? "已启用" : "已停用", policy.force_update ? "强制更新" : "非强制"].join(" · ");
      var target = document.createElement("p"); target.textContent = "更新至 " + policy.target_version + (policy.target_build ? "（构建 " + policy.target_build + "）" : "") + " · 优先级 " + policy.priority;
      var range = document.createElement("p"); range.className = "policy-range"; range.textContent = "提醒版本：" + (policy.source_versions.length ? policy.source_versions.join("、") : (policy.source_min_version || policy.source_max_version ? (policy.source_min_version || "不限") + " ～ " + (policy.source_max_version || "不限") : "全部旧版本"));
      content.append(title, status, target, range);
      var actions = document.createElement("div"); actions.className = "inline-actions";
      var edit = document.createElement("button"); edit.type = "button"; edit.className = "ghost-button"; edit.textContent = "编辑";
      edit.onclick = function () { if (!saving) editPolicy(policy); }; actions.appendChild(edit);
      if (policy.enabled) {
        var disable = document.createElement("button"); disable.type = "button"; disable.className = "ghost-button"; disable.textContent = "停用";
        disable.onclick = function () { if (!saving) savePolicy(Object.assign({}, policy, { enabled: false }), policy.revision); }; actions.appendChild(disable);
      }
      row.append(content, actions); list.appendChild(row);
    });
  }
  function editPolicy(policy) {
    editing = policy; form.reset();
    ["name", "platform", "target_version", "target_build", "source_min_version", "source_max_version", "title", "message", "update_url", "remind_interval_hours", "priority"].forEach(function (key) { field(key).value = policy[key] == null ? "" : policy[key]; });
    field("source_versions").value = policy.source_versions.join(", "); field("force_update").value = String(policy.force_update);
    field("enabled").checked = policy.enabled; field("release_ready").checked = false;
    field("update_url").value = downloadURLs[policy.platform];
    byId("editor-title").textContent = "编辑策略 · " + policy.name;
    byId("editor-section").hidden = false;
    byId("new-policy").setAttribute("aria-expanded", "true");
    byId("editor-section").scrollIntoView({ block: "start" }); field("name").focus({ preventScroll: true });
  }
  async function savePolicy(policy, revision) {
    if (saving) return;
    var context = generation; saving = true; byId("save").disabled = true; message("正在保存…");
    try {
      var result = await client.rpc("save_app_update_policy_v1", { policy: policy, expected_revision: revision });
      if (!current(context)) return;
      if (result.error) throw result.error;
      resetEditor(); var refreshed = await loadPolicies();
      if (current(context) && refreshed) message("策略已保存；客户端下次成功检查时生效。");
    } catch (error) { if (current(context)) message(errorText(error)); }
    finally { if (context === generation) { saving = false; byId("save").disabled = false; } }
  }
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (field("enabled").checked && !field("release_ready").checked) { message("启用前，请确认目标版本已经上架且下载入口可用。"); field("release_ready").focus(); return; }
    var policy = {};
    ["name", "platform", "target_version", "title", "message", "update_url"].forEach(function (key) { policy[key] = field(key).value.trim(); });
    ["source_min_version", "source_max_version"].forEach(function (key) { policy[key] = field(key).value.trim() || null; });
    ["remind_interval_hours", "priority"].forEach(function (key) { policy[key] = Number(field(key).value); });
    policy.target_build = field("target_build").value ? Number(field("target_build").value) : null;
    policy.source_versions = field("source_versions").value.split(/[,，\s]+/).filter(Boolean);
    policy.force_update = field("force_update").value === "true"; policy.enabled = field("enabled").checked;
    policy.update_url = downloadURLs[policy.platform];
    if (!/^https:\/\//i.test(policy.update_url)) { message("更新地址必须使用 HTTPS。"); return; }
    if (editing) policy.id = editing.id;
    savePolicy(policy, editing ? editing.revision : null);
  });
  byId("login-form").addEventListener("submit", async function (event) {
    event.preventDefault(); var login = event.currentTarget, button = login.querySelector("button"); button.disabled = true; message("正在登录…");
    try {
      var result = await client.auth.signInWithPassword({ email: login.elements.email.value.trim(), password: login.elements.password.value });
      if (result.error) throw result.error;
      login.reset(); setSession(result.data.session);
    } catch (error) { message(errorText(error)); } finally { button.disabled = false; }
  });
  byId("preview-form").addEventListener("submit", async function (event) {
    event.preventDefault(); var preview = event.currentTarget, context = generation, button = preview.querySelector("button"); button.disabled = true;
    try {
      var result = await client.rpc("check_app_update_v1", { client_platform: preview.elements.platform.value, client_version: preview.elements.version.value.trim(), client_build: Number(preview.elements.build.value) });
      if (!current(context)) return;
      if (result.error) throw result.error;
      byId("preview-result").textContent = result.data ? "命中：更新至 " + result.data.target_version + " · " + (result.data.force_update ? "强制更新" : "非强制提醒") : "未命中策略，不弹窗。";
    } catch (error) { if (current(context)) byId("preview-result").textContent = errorText(error); }
    finally { button.disabled = false; }
  });
  byId("new-policy").setAttribute("aria-controls", "editor-section");
  byId("new-policy").onclick = function () {
    if (saving) return;
    resetEditor(); byId("editor-section").hidden = false; byId("new-policy").setAttribute("aria-expanded", "true");
    byId("editor-section").scrollIntoView({ block: "start" }); field("name").focus({ preventScroll: true });
  };
  byId("cancel-edit").onclick = function () { if (!saving) { resetEditor(); byId("policy-list").scrollIntoView({ block: "start" }); } };
  byId("platform-filter").onchange = byId("state-filter").onchange = renderPolicies;
  byId("refresh").onclick = loadPolicies;
  byId("sign-out").onclick = async function () { var result = await client.auth.signOut(); if (result.error) message(errorText(result.error)); else { setSession(null); byId("auth-panel").hidden = false; } };
  field("platform").addEventListener("change", function () {
    field("update_url").value = downloadURLs[field("platform").value];
    if (!editing) field("target_version").value = { ios: "1.2.4", android: "1.2.0", harmony: "1.0.0" }[field("platform").value];
  });
  resetEditor();
  if (!client) { message("后台连接配置未加载，请刷新页面。"); return; }
  client.auth.onAuthStateChange(function (_event, next) { setTimeout(function () { setSession(next); }, 0); });
  client.auth.getSession().then(function (result) {
    if (result.error) { message(errorText(result.error)); byId("auth-panel").hidden = false; return; }
    setSession(result.data.session); if (!result.data.session) byId("auth-panel").hidden = false;
  });
}());
