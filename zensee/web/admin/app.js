(function () {
  var config = window.ZENSEE_ADMIN_CONFIG || {};
  var supabaseGlobal = window.supabase;
  var client = supabaseGlobal && config.supabaseUrl && config.supabaseAnonKey
    ? supabaseGlobal.createClient(config.supabaseUrl, config.supabaseAnonKey)
    : null;

  var state = {
    session: null,
    groups: [],
    groupId: "",
    snapshot: null,
    startDate: "",
    endDate: "",
    selectedDate: "",
    statusFilter: "all",
    memberSort: "status",
    memberSearch: ""
  };

  var elements = {
    authPanel: document.getElementById("auth-panel"),
    dashboardPanel: document.getElementById("dashboard-panel"),
    authForm: document.getElementById("auth-form"),
    emailInput: document.getElementById("email-input"),
    passwordInput: document.getElementById("password-input"),
    authMessage: document.getElementById("auth-message"),
    dashboardMessage: document.getElementById("dashboard-message"),
    sideNav: document.getElementById("side-nav"),
    groupSelect: document.getElementById("group-select"),
    groupTitle: document.getElementById("group-title"),
    groupIdLine: document.getElementById("group-id-line"),
    copyGroupIdButton: document.getElementById("copy-group-id-button"),
    signOutButton: document.getElementById("sign-out-button"),
    profileButton: document.getElementById("profile-button"),
    profileAvatar: document.getElementById("profile-avatar"),
    profilePopover: document.getElementById("profile-popover"),
    profilePopoverAvatar: document.getElementById("profile-popover-avatar"),
    profileDisplayName: document.getElementById("profile-display-name"),
    profileEmail: document.getElementById("profile-email"),
    profileForm: document.getElementById("profile-form"),
    profileNicknameInput: document.getElementById("profile-nickname-input"),
    profileAvatarInput: document.getElementById("profile-avatar-input"),
    profileToken: document.getElementById("profile-token"),
    copyTokenButton: document.getElementById("copy-token-button"),
    profileMessage: document.getElementById("profile-message"),
    startDate: document.getElementById("start-date"),
    endDate: document.getElementById("end-date"),
    selectedDate: document.getElementById("selected-date"),
    applyDateButton: document.getElementById("apply-date-button"),
    metricGrid: document.getElementById("metric-grid"),
    trendChart: document.getElementById("trend-chart"),
    riskList: document.getElementById("risk-list"),
    calendarGrid: document.getElementById("calendar-grid"),
    dayTitle: document.getElementById("day-title"),
    daySummaryGrid: document.getElementById("day-summary-grid"),
    copyRemindButton: document.getElementById("copy-remind-button"),
    exportDayButton: document.getElementById("export-day-button"),
    statusFilter: document.getElementById("status-filter"),
    memberSearch: document.getElementById("member-search"),
    memberSort: document.getElementById("member-sort"),
    memberTableBody: document.getElementById("member-table-body"),
    segmentGrid: document.getElementById("segment-grid"),
    requestList: document.getElementById("request-list"),
    settingsForm: document.getElementById("group-settings-form"),
    groupNameInput: document.getElementById("group-name-input"),
    groupDescriptionInput: document.getElementById("group-description-input"),
    autoKickSelect: document.getElementById("auto-kick-select"),
    ruleImpactCopy: document.getElementById("rule-impact-copy"),
    ruleImpactList: document.getElementById("rule-impact-list")
  };

  boot();

  function boot() {
    setDefaultDates();
    bindEvents();

    if (!client) {
      showAuthMessage("Supabase 配置未加载，无法进入后台。");
      return;
    }

    client.auth.getSession().then(function (result) {
      state.session = result.data.session;
      renderAuthState();
      if (state.session) {
        renderProfileFromSession();
        loadProfile();
        loadGroups();
      }
    });
  }

  function bindEvents() {
    elements.authForm.addEventListener("submit", function (event) {
      event.preventDefault();
      signIn();
    });

    elements.signOutButton.addEventListener("click", signOut);
    elements.profileButton.addEventListener("click", function (event) {
      event.stopPropagation();
      toggleProfilePopover();
    });
    elements.profilePopover.addEventListener("click", function (event) {
      event.stopPropagation();
    });
    elements.profileForm.addEventListener("submit", function (event) {
      event.preventDefault();
      saveProfile();
    });
    elements.copyTokenButton.addEventListener("click", copyAccessToken);
    elements.copyGroupIdButton.addEventListener("click", copyGroupId);
    document.addEventListener("click", closeProfilePopover);
    window.addEventListener("scroll", updateActiveNav);

    elements.groupSelect.addEventListener("change", function () {
      state.groupId = elements.groupSelect.value;
      writeGroupToUrl(state.groupId);
      loadSnapshot();
    });

    elements.applyDateButton.addEventListener("click", function () {
      syncDatesFromInputs();
      loadSnapshot();
    });

    document.querySelectorAll("[data-range]").forEach(function (button) {
      button.addEventListener("click", function () {
        document.querySelectorAll("[data-range]").forEach(function (item) {
          item.classList.remove("is-active");
        });
        button.classList.add("is-active");
        applyQuickRange(button.getAttribute("data-range"));
        loadSnapshot();
      });
    });

    elements.statusFilter.addEventListener("change", function () {
      state.statusFilter = elements.statusFilter.value;
      renderMemberTable();
    });

    elements.memberSearch.addEventListener("input", function () {
      state.memberSearch = elements.memberSearch.value.trim().toLowerCase();
      renderMemberTable();
    });

    elements.memberSort.addEventListener("change", function () {
      state.memberSort = elements.memberSort.value;
      renderMemberTable();
    });

    elements.copyRemindButton.addEventListener("click", copyRemindList);
    elements.exportDayButton.addEventListener("click", exportSelectedDayCsv);

    elements.settingsForm.addEventListener("submit", function (event) {
      event.preventDefault();
      saveGroupSettings();
    });
  }

  function setDefaultDates() {
    var today = startOfLocalDay(new Date());
    var start = addDays(today, -6);
    state.startDate = formatDate(start);
    state.endDate = formatDate(today);
    state.selectedDate = state.endDate;
    elements.startDate.value = state.startDate;
    elements.endDate.value = state.endDate;
    elements.selectedDate.value = state.selectedDate;
  }

  function syncDatesFromInputs() {
    state.startDate = elements.startDate.value || state.startDate;
    state.endDate = elements.endDate.value || state.endDate;
    state.selectedDate = elements.selectedDate.value || state.endDate;

    if (state.startDate > state.endDate) {
      var previousStart = state.startDate;
      state.startDate = state.endDate;
      state.endDate = previousStart;
    }

    if (state.selectedDate < state.startDate || state.selectedDate > state.endDate) {
      state.selectedDate = state.endDate;
    }

    elements.startDate.value = state.startDate;
    elements.endDate.value = state.endDate;
    elements.selectedDate.value = state.selectedDate;
  }

  function applyQuickRange(value) {
    var today = startOfLocalDay(new Date());
    var start = today;
    var end = today;

    if (value === "yesterday") {
      start = addDays(today, -1);
      end = start;
    } else if (value === "7") {
      start = addDays(today, -6);
    } else if (value === "30") {
      start = addDays(today, -29);
    } else if (value === "month") {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
    }

    state.startDate = formatDate(start);
    state.endDate = formatDate(end);
    state.selectedDate = state.endDate;
    elements.startDate.value = state.startDate;
    elements.endDate.value = state.endDate;
    elements.selectedDate.value = state.selectedDate;
  }

  function renderAuthState() {
    var signedIn = Boolean(state.session);
    elements.authPanel.hidden = signedIn;
    elements.dashboardPanel.hidden = !signedIn;
    elements.sideNav.hidden = !signedIn;
    elements.authPanel.classList.toggle("is-hidden", signedIn);
    elements.dashboardPanel.classList.toggle("is-hidden", !signedIn);
    elements.sideNav.classList.toggle("is-hidden", !signedIn);
    elements.authPanel.style.display = signedIn ? "none" : "";
    elements.dashboardPanel.style.display = signedIn ? "" : "none";
    elements.sideNav.style.display = signedIn ? "" : "none";

    if (signedIn) {
      showAuthMessage("");
    }
  }

  function signIn() {
    showAuthMessage("正在登录…");
    setBusy(elements.authForm.querySelector("button"), true, "登录中");

    client.auth.signInWithPassword({
      email: elements.emailInput.value.trim(),
      password: elements.passwordInput.value
    }).then(function (result) {
      if (result.error) {
        throw result.error;
      }
      state.session = result.data.session;
      elements.passwordInput.value = "";
      renderAuthState();
      renderProfileFromSession();
      loadProfile();
      setDashboardMessage("登录成功，正在确认群主权限…");
      return fetchOwnerGroups();
    }).then(function (groups) {
      state.groups = groups;

      if (!state.groups.length) {
        throw new Error("登录成功，但当前账号没有可管理的群组。请确认你是群主。");
      }

      renderGroupSelect();
      state.groupId = initialGroupId();
      elements.groupSelect.value = state.groupId;
      elements.groupSelect.disabled = false;
      writeGroupToUrl(state.groupId);
      return loadSnapshot();
    }).catch(function (error) {
      var message = error.message || "登录失败，请检查账号密码。";
      if (/get_group_owner_admin_groups|function/i.test(message)) {
        message = "登录成功，但后台接口还未部署。请先在 Supabase 执行 group_owner_admin_dashboard.sql。";
      }
      if (state.session) {
        renderAuthState();
        setDashboardMessage(message);
      } else {
        showAuthMessage(message);
      }
    }).finally(function () {
      setBusy(elements.authForm.querySelector("button"), false, "登录后台");
    });
  }

  function signOut() {
    client.auth.signOut().finally(function () {
      state.session = null;
      state.groups = [];
      state.groupId = "";
      state.snapshot = null;
      closeProfilePopover();
      renderAuthState();
      clearDashboard();
    });
  }

  function loadGroups() {
    setDashboardMessage("正在加载群组…");
    elements.groupSelect.disabled = true;

    return fetchOwnerGroups().then(function (groups) {
      state.groups = groups;
      renderGroupSelect();

      if (!state.groups.length) {
        setDashboardMessage("当前账号还没有可管理的群组。");
        return null;
      }

      state.groupId = initialGroupId();
      elements.groupSelect.value = state.groupId;
      writeGroupToUrl(state.groupId);
      return loadSnapshot();
    }).catch(function (error) {
      setDashboardMessage(error.message || "群组加载失败。");
    }).finally(function () {
      elements.groupSelect.disabled = !state.groups.length;
    });
  }

  function fetchOwnerGroups() {
    return client.rpc("get_group_owner_admin_groups").then(function (result) {
      if (result.error) {
        throw result.error;
      }
      return result.data || [];
    });
  }

  function initialGroupId() {
    var urlGroupId = new URLSearchParams(window.location.search).get("group_id");
    var matched = state.groups.find(function (group) {
      return group.id === urlGroupId;
    });
    return (matched || state.groups[0]).id;
  }

  function renderGroupSelect() {
    if (!state.groups.length) {
      elements.groupSelect.innerHTML = "<option>暂无可管理群组</option>";
      return;
    }

    elements.groupSelect.innerHTML = state.groups.map(function (group) {
      return "<option value=\"" + escapeHtml(group.id) + "\">" + escapeHtml(group.name) + "</option>";
    }).join("");
  }

  function loadSnapshot() {
    if (!state.groupId) {
      return Promise.resolve();
    }

    syncDatesFromInputs();
    setDashboardMessage("正在更新看板…");

    return client.rpc("get_group_owner_admin_snapshot", {
      target_group_id: state.groupId,
      target_start_date: state.startDate,
      target_end_date: state.endDate,
      target_selected_date: state.selectedDate
    }).then(function (result) {
      if (result.error) {
        throw result.error;
      }
      state.snapshot = result.data;
      renderDashboard();
      setDashboardMessage("已更新：" + formatDateTime(new Date()));
    }).catch(function (error) {
      setDashboardMessage(error.message || "看板加载失败。");
    });
  }

  function renderDashboard() {
    if (!state.snapshot) {
      clearDashboard();
      return;
    }

    var group = state.snapshot.group;
    elements.groupTitle.textContent = group.name;
    elements.groupIdLine.textContent = "group_id: " + group.id;
    elements.groupNameInput.value = group.name || "";
    elements.groupDescriptionInput.value = group.description || "";
    elements.autoKickSelect.value = String(group.auto_kick_days || 0);
    elements.selectedDate.value = state.snapshot.range.selected_date;
    state.selectedDate = state.snapshot.range.selected_date;

    renderMetrics();
    renderTrend();
    renderCalendar();
    renderDaySummary();
    renderMemberTable();
    renderSegments();
    renderRisks();
    renderRequests();
    renderRuleImpact();
    updateActiveNav();
  }

  function updateActiveNav() {
    if (!state.session) {
      return;
    }

    var links = Array.prototype.slice.call(elements.sideNav.querySelectorAll("a[href^='#']"));
    var currentId = "";

    links.forEach(function (link) {
      var target = document.querySelector(link.getAttribute("href"));
      if (target && target.getBoundingClientRect().top <= 150) {
        currentId = target.id;
      }
    });

    if (!currentId && links.length) {
      currentId = links[0].getAttribute("href").slice(1);
    }

    links.forEach(function (link) {
      var active = link.getAttribute("href") === "#" + currentId;
      link.classList.toggle("is-active", active);
      if (active) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function loadProfile() {
    if (!state.session || !state.session.user) {
      return Promise.resolve();
    }

    return client.from("profiles")
      .select("id,nickname,avatar_url")
      .eq("id", state.session.user.id)
      .maybeSingle()
      .then(function (result) {
        if (result.error) {
          throw result.error;
        }
        renderProfile(result.data || {});
      }).catch(function () {
        renderProfile({});
      });
  }

  function renderProfileFromSession() {
    renderProfile({});
  }

  function renderProfile(profile) {
    var user = state.session && state.session.user || {};
    var email = user.email || "";
    var metadata = user.user_metadata || {};
    var nickname = profile.nickname || metadata.nickname || emailPrefix(email) || "禅友";
    var avatarUrl = profile.avatar_url || metadata.avatar_url || "";
    var token = state.session && state.session.access_token || "";

    elements.profileDisplayName.textContent = nickname;
    elements.profileEmail.textContent = email || "已登录";
    elements.profileNicknameInput.value = nickname === "禅友" ? "" : nickname;
    elements.profileAvatarInput.value = avatarUrl;
    elements.profileToken.textContent = token ? compactToken(token) : "未登录";
    renderAvatar(elements.profileAvatar, nickname, avatarUrl);
    renderAvatar(elements.profilePopoverAvatar, nickname, avatarUrl);
  }

  function copyAccessToken() {
    var token = state.session && state.session.access_token || "";
    if (!token) {
      setProfileMessage("当前没有可复制的 token。");
      return;
    }

    copyText(token).then(function () {
      showCopiedIcon(elements.copyTokenButton);
    }).catch(function () {
      setProfileMessage("复制失败，请手动选中 token。");
    });
  }

  function copyGroupId() {
    var groupId = state.snapshot && state.snapshot.group && state.snapshot.group.id || state.groupId;
    if (!groupId) {
      return;
    }

    copyText(groupId).then(function () {
      showCopiedIcon(elements.copyGroupIdButton);
    }).catch(function () {
      setDashboardMessage("复制失败，请手动选中 group_id。");
    });
  }

  function showCopiedIcon(button) {
    button.classList.add("is-copied");
    window.setTimeout(function () {
      button.classList.remove("is-copied");
    }, 1100);
  }

  function saveProfile() {
    if (!state.session || !state.session.user) {
      return;
    }

    var nickname = elements.profileNicknameInput.value.trim();
    var avatarUrl = elements.profileAvatarInput.value.trim();

    if (nickname && nickname.length > 24) {
      setProfileMessage("昵称不能超过 24 个字符。");
      return;
    }

    setProfileMessage("正在保存…");

    client.from("profiles")
      .upsert({
        id: state.session.user.id,
        nickname: nickname || null,
        avatar_url: avatarUrl || null,
        updated_at: new Date().toISOString()
      })
      .select("id,nickname,avatar_url")
      .single()
      .then(function (result) {
        if (result.error) {
          throw result.error;
        }
        renderProfile(result.data || {});
        setProfileMessage("资料已保存。");
        loadSnapshot();
      }).catch(function (error) {
        setProfileMessage(error.message || "保存失败。");
      });
  }

  function toggleProfilePopover() {
    var willOpen = elements.profilePopover.hidden;
    elements.profilePopover.hidden = !willOpen;
    elements.profileButton.setAttribute("aria-expanded", String(willOpen));
    if (willOpen) {
      setProfileMessage("");
    }
  }

  function closeProfilePopover() {
    elements.profilePopover.hidden = true;
    elements.profileButton.setAttribute("aria-expanded", "false");
  }

  function renderAvatar(target, nickname, avatarUrl) {
    if (avatarUrl) {
      target.innerHTML = "<img src=\"" + escapeHtml(avatarUrl) + "\" alt=\"\">";
      return;
    }
    target.textContent = initials(nickname);
  }

  function setProfileMessage(message) {
    elements.profileMessage.textContent = message || "";
  }

  function renderMetrics() {
    var days = state.snapshot.days || [];
    var members = activeMembers();
    var totalEligible = sum(days, "eligible_count");
    var totalChecked = sum(days, "checked_in_count");
    var totalLeave = sum(days, "leave_count");
    var totalMissed = sum(days, "missed_count");
    var totalMinutes = sum(days, "total_minutes");
    var avgRate = totalEligible ? Math.round(totalChecked / totalEligible * 100) : 0;
    var avgMinutes = members.length ? Math.round(totalMinutes / members.length) : 0;

    elements.metricGrid.innerHTML = [
      metric("平均打卡率", avgRate + "%", "区间内已打卡 / 应打卡"),
      metric("总禅修分钟", totalMinutes + " 分", "来自群内分享记录"),
      metric("请假次数", totalLeave + " 次", "区间内请假记录"),
      metric("缺勤次数", totalMissed + " 次", "未打卡且未请假"),
      metric("当前成员", members.length + " 人", "含群主"),
      metric("待审批", (state.snapshot.pending_requests || []).length + " 条", "待群主处理"),
      metric("人均分钟", avgMinutes + " 分", "按当前成员粗略折算"),
      metric("活跃天数", days.filter(function (day) { return day.checked_in_count > 0; }).length + " 天", "区间内至少一人打卡")
    ].join("");
  }

  function renderTrend() {
    var days = state.snapshot.days || [];
    if (!days.length) {
      elements.trendChart.innerHTML = empty("暂无区间数据");
      return;
    }

    elements.trendChart.innerHTML = days.map(function (day) {
      var rate = day.eligible_count ? Math.round(day.checked_in_count / day.eligible_count * 100) : 0;
      var label = day.date.slice(5);
      return [
        "<button class=\"trend-bar\" type=\"button\" data-date=\"" + escapeHtml(day.date) + "\" title=\"" + label + " · " + rate + "%\">",
        "<i class=\"trend-bar-fill\" style=\"--bar-height:" + Math.max(rate, 4) + "%\"></i>",
        "<span>" + escapeHtml(label) + "</span>",
        "</button>"
      ].join("");
    }).join("");

    elements.trendChart.querySelectorAll("[data-date]").forEach(function (button) {
      button.addEventListener("click", function () {
        selectDate(button.getAttribute("data-date"));
      });
    });
  }

  function renderCalendar() {
    var days = state.snapshot.days || [];
    if (!days.length) {
      elements.calendarGrid.innerHTML = empty("暂无每日数据");
      return;
    }

    elements.calendarGrid.innerHTML = days.map(function (day) {
      var rate = day.eligible_count ? Math.round(day.checked_in_count / day.eligible_count * 100) : 0;
      var heat = Math.min(88, Math.max(8, rate));
      var selected = day.date === state.selectedDate ? " is-selected" : "";

      return [
        "<button class=\"day-cell" + selected + "\" type=\"button\" data-date=\"" + escapeHtml(day.date) + "\" style=\"--heat:" + heat + "%\">",
        "<strong>" + escapeHtml(day.date) + "</strong>",
        "<span>打卡 " + day.checked_in_count + " / " + day.eligible_count + " · 请假 " + day.leave_count + "</span>",
        "<span>未打卡 " + day.missed_count + " · " + day.total_minutes + " 分钟</span>",
        "<div class=\"day-rate\"><i style=\"--rate:" + rate + "%\"></i></div>",
        "</button>"
      ].join("");
    }).join("");

    elements.calendarGrid.querySelectorAll("[data-date]").forEach(function (button) {
      button.addEventListener("click", function () {
        selectDate(button.getAttribute("data-date"));
      });
    });
  }

  function selectDate(date) {
    state.selectedDate = date;
    elements.selectedDate.value = date;
    loadSnapshot();
  }

  function renderDaySummary() {
    var day = selectedDay();
    var members = activeMembers();
    var checked = members.filter(function (member) { return member.selected_status === "checked_in"; });
    var leaves = members.filter(function (member) { return member.selected_status === "on_leave"; });
    var missed = members.filter(function (member) { return member.selected_status === "missed"; });
    var topMember = checked.slice().sort(function (a, b) {
      return b.selected_minutes - a.selected_minutes;
    })[0];
    var rate = day && day.eligible_count ? Math.round(day.checked_in_count / day.eligible_count * 100) : 0;

    elements.dayTitle.textContent = state.selectedDate + " 单日汇总";
    elements.daySummaryGrid.innerHTML = [
      metric("应打卡", (day ? day.eligible_count : members.length) + " 人", "当前在群成员"),
      metric("已打卡", checked.length + " 人", rate + "% 打卡率"),
      metric("请假", leaves.length + " 人", "请假不计入缺勤"),
      metric("未打卡", missed.length + " 人", "需要提醒"),
      metric("总分钟", (day ? day.total_minutes : 0) + " 分", "当日分享合计"),
      metric("当日最长", topMember ? topMember.selected_minutes + " 分" : "0 分", topMember ? topMember.nickname : "暂无")
    ].join("");
  }

  function renderMemberTable() {
    var members = filteredMembers();

    if (!members.length) {
      elements.memberTableBody.innerHTML = "<tr><td colspan=\"7\">" + empty("没有符合条件的成员") + "</td></tr>";
      return;
    }

    elements.memberTableBody.innerHTML = members.map(function (member) {
      var canRemove = member.role !== "owner";
      return [
        "<tr>",
        "<td>" + memberCell(member) + "</td>",
        "<td>" + statusPill(member.selected_status) + "</td>",
        "<td>" + member.selected_minutes + " 分</td>",
        "<td>" + member.range_active_days + " 天 · " + member.range_minutes + " 分</td>",
        "<td>" + member.missed_days_since_last_ok + " 天</td>",
        "<td>" + escapeHtml(formatNullableDateTime(member.selected_last_shared_at || member.range_last_shared_at)) + "</td>",
        "<td>",
        canRemove ? "<button class=\"danger-button\" type=\"button\" data-remove=\"" + escapeHtml(member.user_id) + "\">移除</button>" : "<span class=\"status-pill\">群主</span>",
        "</td>",
        "</tr>"
      ].join("");
    }).join("");

    elements.memberTableBody.querySelectorAll("[data-remove]").forEach(function (button) {
      button.addEventListener("click", function () {
        removeMember(button.getAttribute("data-remove"));
      });
    });
  }

  function renderSegments() {
    var members = activeMembers();
    var checked = members.filter(function (member) { return member.selected_status === "checked_in"; });
    var missed = members.filter(function (member) { return member.selected_status === "missed"; });
    var leaves = members.filter(function (member) { return member.selected_status === "on_leave"; });
    var stable = members.filter(function (member) { return member.range_active_days >= 5 || member.range_minutes >= 120; });
    var silent = members.filter(function (member) { return member.range_active_days === 0 && member.role !== "owner"; });
    var risk = riskMembers();

    elements.segmentGrid.innerHTML = [
      segment("今日已打卡", checked.length + " 人", names(checked)),
      segment("今日未打卡", missed.length + " 人", names(missed)),
      segment("今日请假", leaves.length + " 人", names(leaves)),
      segment("稳定成员", stable.length + " 人", names(stable)),
      segment("区间沉默", silent.length + " 人", names(silent)),
      segment("移除风险", risk.length + " 人", names(risk)),
      segment("新成员", recentMembers(members).length + " 人", names(recentMembers(members))),
      segment("待审批", (state.snapshot.pending_requests || []).length + " 条", namesFromRequests(state.snapshot.pending_requests || []))
    ].join("");
  }

  function renderRisks() {
    var missed = activeMembers()
      .filter(function (member) { return member.selected_status === "missed" && member.role !== "owner"; })
      .sort(function (a, b) { return b.missed_days_since_last_ok - a.missed_days_since_last_ok; });
    var risky = riskMembers();
    var lowDays = (state.snapshot.days || []).filter(function (day) {
      return day.eligible_count && day.checked_in_count / day.eligible_count < 0.5;
    });
    var items = [];

    if (missed.length) {
      items.push(riskItem("今日未打卡", names(missed.slice(0, 6)), "共 " + missed.length + " 人需要提醒"));
    }
    if (risky.length) {
      items.push(riskItem("自动移除风险", names(risky.slice(0, 6)), "当前规则下会受影响"));
    }
    if (lowDays.length) {
      items.push(riskItem("低活跃日期", lowDays.map(function (day) { return day.date; }).join("、"), "打卡率低于 50%"));
    }

    elements.riskList.innerHTML = items.length ? items.join("") : empty("当前没有明显风险");
  }

  function renderRequests() {
    var requests = state.snapshot.pending_requests || [];
    if (!requests.length) {
      elements.requestList.innerHTML = empty("暂无待处理入群申请");
      return;
    }

    elements.requestList.innerHTML = requests.map(function (request) {
      return [
        "<article class=\"request-item\">",
        "<div>",
        "<strong>" + escapeHtml(request.applicant_name || "禅友") + "</strong>",
        "<span>申请时间：" + escapeHtml(formatNullableDateTime(request.created_at)) + "</span>",
        "</div>",
        "<div class=\"request-actions\">",
        "<button class=\"secondary-button\" type=\"button\" data-request=\"" + escapeHtml(request.id) + "\" data-status=\"approved\">通过</button>",
        "<button class=\"ghost-button\" type=\"button\" data-request=\"" + escapeHtml(request.id) + "\" data-status=\"rejected\">拒绝</button>",
        "</div>",
        "</article>"
      ].join("");
    }).join("");

    elements.requestList.querySelectorAll("[data-request]").forEach(function (button) {
      button.addEventListener("click", function () {
        processRequest(button.getAttribute("data-request"), button.getAttribute("data-status"));
      });
    });
  }

  function renderRuleImpact() {
    var group = state.snapshot.group || {};
    var days = Number(group.auto_kick_days || 0);
    var risky = riskMembers();

    if (!days) {
      elements.ruleImpactCopy.textContent = "自动移除已关闭。你仍然可以在成员表中筛选连续缺勤成员。";
      elements.ruleImpactList.innerHTML = "";
      return;
    }

    elements.ruleImpactCopy.textContent = days + " 天未打卡规则下，以下成员需要优先确认。";
    elements.ruleImpactList.innerHTML = risky.length
      ? risky.map(function (member) {
        return impactItem(member.nickname, "连续缺勤 " + member.missed_days_since_last_ok + " 天");
      }).join("")
      : empty("当前没有成员达到自动移除风险线");
  }

  function saveGroupSettings() {
    if (!state.groupId) {
      return;
    }

    var payload = {
      name: elements.groupNameInput.value.trim(),
      description: elements.groupDescriptionInput.value.trim(),
      auto_kick_days: Number(elements.autoKickSelect.value)
    };

    setDashboardMessage("正在保存群规则…");

    client.from("groups")
      .update(payload)
      .eq("id", state.groupId)
      .then(function (result) {
        if (result.error) {
          throw result.error;
        }
        return loadGroups();
      })
      .then(function () {
        setDashboardMessage("群规则已保存。");
      })
      .catch(function (error) {
        setDashboardMessage(error.message || "保存失败。");
      });
  }

  function processRequest(requestId, status) {
    setDashboardMessage("正在处理入群申请…");

    client.from("group_join_requests")
      .update({ status: status })
      .eq("id", requestId)
      .eq("group_id", state.groupId)
      .then(function (result) {
        if (result.error) {
          throw result.error;
        }
        return loadSnapshot();
      })
      .then(function () {
        setDashboardMessage(status === "approved" ? "已通过申请。" : "已拒绝申请。");
      })
      .catch(function (error) {
        setDashboardMessage(error.message || "申请处理失败。");
      });
  }

  function removeMember(userId) {
    var member = activeMembers().find(function (item) {
      return item.user_id === userId;
    });

    if (!member || member.role === "owner") {
      return;
    }

    if (!window.confirm("确认移除成员「" + member.nickname + "」？")) {
      return;
    }

    setDashboardMessage("正在移除成员…");

    client.from("group_memberships")
      .delete()
      .eq("group_id", state.groupId)
      .eq("user_id", userId)
      .eq("role", "member")
      .then(function (result) {
        if (result.error) {
          throw result.error;
        }
        return loadSnapshot();
      })
      .then(function () {
        setDashboardMessage("成员已移除。");
      })
      .catch(function (error) {
        setDashboardMessage(error.message || "移除失败。");
      });
  }

  function copyRemindList() {
    var missed = activeMembers().filter(function (member) {
      return member.selected_status === "missed" && member.role !== "owner";
    });
    var text = missed.length
      ? state.selectedDate + " 未打卡成员：" + names(missed)
      : state.selectedDate + " 暂无需要提醒的未打卡成员。";

    copyText(text).then(function () {
      setDashboardMessage("提醒名单已复制。");
    }).catch(function () {
      setDashboardMessage(text);
    });
  }

  function exportSelectedDayCsv() {
    var rows = [["昵称", "角色", "状态", "当日分钟", "区间活跃天数", "区间分钟", "连续缺勤天数", "最后分享"]];
    filteredMembers().forEach(function (member) {
      rows.push([
        member.nickname,
        member.role === "owner" ? "群主" : "成员",
        statusLabel(member.selected_status),
        String(member.selected_minutes),
        String(member.range_active_days),
        String(member.range_minutes),
        String(member.missed_days_since_last_ok),
        formatNullableDateTime(member.selected_last_shared_at || member.range_last_shared_at)
      ]);
    });

    var csv = rows.map(function (row) {
      return row.map(csvCell).join(",");
    }).join("\n");
    var blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "zensee-group-" + state.selectedDate + ".csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function clearDashboard() {
    elements.metricGrid.innerHTML = "";
    elements.trendChart.innerHTML = "";
    elements.riskList.innerHTML = "";
    elements.calendarGrid.innerHTML = "";
    elements.daySummaryGrid.innerHTML = "";
    elements.memberTableBody.innerHTML = "";
    elements.segmentGrid.innerHTML = "";
    elements.requestList.innerHTML = "";
    elements.ruleImpactList.innerHTML = "";
  }

  function activeMembers() {
    return (state.snapshot && state.snapshot.members || []).filter(function (member) {
      return member.selected_status !== "not_joined";
    });
  }

  function filteredMembers() {
    var members = activeMembers().filter(function (member) {
      var statusMatches = state.statusFilter === "all" || member.selected_status === state.statusFilter;
      var searchMatches = !state.memberSearch || String(member.nickname || "").toLowerCase().indexOf(state.memberSearch) >= 0;
      return statusMatches && searchMatches;
    });

    members.sort(function (a, b) {
      if (a.role === "owner" || b.role === "owner") {
        return a.role === "owner" ? -1 : 1;
      }
      if (state.memberSort === "minutes") {
        return b.selected_minutes - a.selected_minutes;
      }
      if (state.memberSort === "missed") {
        return b.missed_days_since_last_ok - a.missed_days_since_last_ok;
      }
      if (state.memberSort === "joined") {
        return String(a.joined_at).localeCompare(String(b.joined_at));
      }
      return statusWeight(a.selected_status) - statusWeight(b.selected_status);
    });

    return members;
  }

  function selectedDay() {
    return (state.snapshot.days || []).find(function (day) {
      return day.date === state.selectedDate;
    });
  }

  function riskMembers() {
    var days = Number(state.snapshot && state.snapshot.group && state.snapshot.group.auto_kick_days || 0);
    if (!days) {
      return [];
    }
    return activeMembers().filter(function (member) {
      return member.role !== "owner" && member.missed_days_since_last_ok >= days;
    });
  }

  function recentMembers(members) {
    var cutoff = addDays(startOfLocalDay(new Date()), -7).getTime();
    return members.filter(function (member) {
      return new Date(member.joined_at).getTime() >= cutoff;
    });
  }

  function metric(label, value, hint) {
    return [
      "<article class=\"metric-item\">",
      "<span>" + escapeHtml(label) + "</span>",
      "<strong>" + escapeHtml(value) + "</strong>",
      "<small>" + escapeHtml(hint || "") + "</small>",
      "</article>"
    ].join("");
  }

  function segment(title, value, body) {
    return [
      "<article class=\"segment-item\">",
      "<strong>" + escapeHtml(title) + " · " + escapeHtml(value) + "</strong>",
      "<span>" + escapeHtml(body || "暂无成员") + "</span>",
      "</article>"
    ].join("");
  }

  function riskItem(title, body, hint) {
    return [
      "<article class=\"risk-item\">",
      "<strong>" + escapeHtml(title) + "</strong>",
      "<span>" + escapeHtml(body || "暂无") + "</span>",
      "<span>" + escapeHtml(hint || "") + "</span>",
      "</article>"
    ].join("");
  }

  function impactItem(title, body) {
    return [
      "<article class=\"impact-item\">",
      "<strong>" + escapeHtml(title) + "</strong>",
      "<span>" + escapeHtml(body) + "</span>",
      "</article>"
    ].join("");
  }

  function memberCell(member) {
    var avatar = member.avatar_url
      ? "<img src=\"" + escapeHtml(member.avatar_url) + "\" alt=\"\">"
      : escapeHtml(initials(member.nickname));

    return [
      "<div class=\"member-cell\">",
      "<div class=\"avatar\">" + avatar + "</div>",
      "<div class=\"member-name\">",
      "<strong>" + escapeHtml(member.nickname || "禅友") + "</strong>",
      "<span>" + (member.role === "owner" ? "群主" : "成员") + " · 入群 " + escapeHtml(shortDate(member.joined_at)) + "</span>",
      "</div>",
      "</div>"
    ].join("");
  }

  function statusPill(status) {
    return "<span class=\"status-pill " + escapeHtml(status) + "\">" + escapeHtml(statusLabel(status)) + "</span>";
  }

  function statusLabel(status) {
    if (status === "checked_in") {
      return "已打卡";
    }
    if (status === "on_leave") {
      return "已请假";
    }
    if (status === "missed") {
      return "未打卡";
    }
    return "未入群";
  }

  function statusWeight(status) {
    if (status === "missed") {
      return 0;
    }
    if (status === "on_leave") {
      return 1;
    }
    if (status === "checked_in") {
      return 2;
    }
    return 3;
  }

  function names(members) {
    return members.map(function (member) {
      return member.nickname || "禅友";
    }).join("、");
  }

  function namesFromRequests(requests) {
    return requests.map(function (request) {
      return request.applicant_name || "禅友";
    }).join("、");
  }

  function sum(items, key) {
    return items.reduce(function (total, item) {
      return total + Number(item[key] || 0);
    }, 0);
  }

  function empty(message) {
    return "<div class=\"empty-state\">" + escapeHtml(message) + "</div>";
  }

  function setDashboardMessage(message) {
    elements.dashboardMessage.textContent = message || "";
  }

  function showAuthMessage(message) {
    elements.authMessage.textContent = message || "";
  }

  function setBusy(button, isBusy, text) {
    button.disabled = isBusy;
    button.textContent = text;
  }

  function writeGroupToUrl(groupId) {
    if (!groupId || !window.history || !window.URLSearchParams) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    params.set("group_id", groupId);
    window.history.replaceState({}, "", window.location.pathname + "?" + params.toString());
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var input = document.createElement("textarea");
      input.value = text;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      try {
        document.execCommand("copy");
        resolve();
      } catch (error) {
        reject(error);
      } finally {
        document.body.removeChild(input);
      }
    });
  }

  function csvCell(value) {
    return "\"" + String(value || "").replace(/"/g, "\"\"") + "\"";
  }

  function initials(name) {
    var text = String(name || "禅友").trim();
    return text.slice(0, 2);
  }

  function emailPrefix(email) {
    return String(email || "").split("@")[0] || "";
  }

  function compactToken(token) {
    var value = String(token || "");
    if (value.length <= 28) {
      return value;
    }
    return value.slice(0, 14) + "..." + value.slice(-10);
  }

  function startOfLocalDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function addDays(date, offset) {
    var next = new Date(date);
    next.setDate(next.getDate() + offset);
    return next;
  }

  function formatDate(date) {
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  function formatDateTime(date) {
    var formatter = new Intl.DateTimeFormat("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
    return formatter.format(date);
  }

  function formatNullableDateTime(value) {
    if (!value) {
      return "暂无";
    }
    return formatDateTime(new Date(value));
  }

  function shortDate(value) {
    if (!value) {
      return "未知";
    }
    return String(value).slice(0, 10);
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
