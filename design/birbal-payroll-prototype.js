/**
 * Birbal Payroll Prototype — interactive demo for stakeholder buy-in.
 * Calculation logic mirrors RFP rules (prototype-only; production uses server API).
 */
(function () {
  "use strict";

  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const BRANDS = ["Birbal Kitchen", "Spice Route", "Masala Bay", "Curry House"];
  const LOCATIONS = {
    "Birbal Kitchen": ["Indiranagar", "Koramangala"],
    "Spice Route": ["Whitefield", "HSR Layout"],
    "Masala Bay": ["JP Nagar"],
    "Curry House": ["MG Road", "Brigade Road", "Jayanagar"],
  };

  const LOOKUPS = {
    departments: ["Kitchen", "Service", "Management", "Housekeeping"],
    designations: ["Chef", "Waiter", "Cashier", "Manager", "Helper"],
    employmentTypes: ["Full-time", "Part-time", "Contract"],
  };

  const LOOKUP_LABELS = {
    departments: "Departments",
    designations: "Designations",
    employmentTypes: "Employment types",
  };

  const LOOKUP_USAGE = {
    "Birbal Kitchen": 12,
    "Spice Route": 9,
    "Masala Bay": 6,
    "Curry House": 14,
    Kitchen: 18,
    Service: 15,
    Management: 4,
    Housekeeping: 4,
    Chef: 8,
    Waiter: 12,
    Cashier: 3,
    Manager: 4,
    Helper: 6,
    "Full-time": 35,
    "Part-time": 4,
    Contract: 2,
  };

  function lookupCard(title, itemsHtml, addLabel) {
    return `<div class="lookup-card">
      <div class="lookup-card-head">
        <h4>${title}</h4>
        <button type="button" class="btn-link-save lookup-add-btn" data-add="${addLabel}">+ Add</button>
      </div>
      ${itemsHtml}
    </div>`;
  }

  function lookupListItems(items) {
    return `<ul class="lookup-list">${items.map((item) => {
      const usage = LOOKUP_USAGE[item];
      return `<li><span>${item}</span>${usage ? `<span class="lookup-usage">${usage} in use</span>` : ""}</li>`;
    }).join("")}</ul>`;
  }

  const IMPORT_BLOCKERS = [
    { id: "b1", label: "2 employees missing PF UAN", detail: "Manual review required", severity: "blocker" },
    { id: "b2", label: "Salary total delta ₹120.50 vs spreadsheet", detail: "Within tolerance. Confirm to continue.", severity: "warning" },
    { id: "b3", label: "1 duplicate employee code resolved", detail: "Verify mapping is correct", severity: "info" },
  ];

  const IMPORT_ERROR_TEMPLATE = [
    {
      id: "err-14",
      row: 14,
      code: "EMP-014",
      name: "Sanjay Rao",
      message: "Missing bank account",
      severity: "blocking",
      fixLabel: "Add bank details",
      fixSummary: "HDFC Bank · account ending 4521",
    },
    {
      id: "err-22",
      row: 22,
      code: "EMP-022",
      name: "Meera Joshi",
      message: "Duplicate phone 9810000022",
      severity: "blocking",
      fixLabel: "Update phone number",
      fixSummary: "Changed to 9812345678",
    },
    {
      id: "err-31",
      row: 31,
      code: "EMP-031",
      name: "Arun Pillai",
      message: "Invalid PAN format",
      severity: "warning",
      fixLabel: "Correct PAN",
      fixSummary: "PAN set to ABCPK1234L",
    },
  ];

  const IMPORT_DEMO_STATS = {
    fileName: "birbal-employees-march-2026.csv",
    rowCount: 41,
    employeeCount: 41,
    brandCount: 4,
    monthlyGross: 842500,
    spreadsheetDelta: 120.5,
  };

  const IMPORT_STEPS = ["Download template", "Upload file", "Check for errors", "Confirm import"];

  const LETTERHEAD_META = {
    "Birbal Kitchen": { uploaded: "12 Mar 2026", size: "184 KB", hasFile: true },
    "Spice Route": { uploaded: "10 Mar 2026", size: "156 KB", hasFile: true },
    "Masala Bay": { uploaded: null, size: null, hasFile: false },
    "Curry House": { uploaded: "8 Mar 2026", size: "201 KB", hasFile: true },
  };

  const LIFECYCLE_STEPS = ["Import done", "Payroll entered", "Totals checked", "Salaries paid", "Month locked"];

  const state = {
    period: { month: 2, year: 2026 },
    filters: { brand: "", location: "" },
    payrollMode: "work",
    peopleView: "directory",
    expandedRows: new Set(),
    migrationPending: true,
    bannerCompact: false,
    showAllExceptions: false,
    periodLocked: false,
    pendingNav: null,
    pendingPaidEmpId: null,
    currentScreen: "dashboard",
    settingsTab: "org",
    importStep: 3,
    importFileUploaded: true,
    importErrors: [],
    letterheads: {},
    employeeDetailId: null,
    employeeDetailSection: "basic",
    employees: [],
    payroll: {},
    paidRecords: {},
    reconciliation: {
      totalsMatched: false,
      exported: false,
    },
  };

  const EMPLOYEE_PHOTOS = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80&h=80&fit=crop&crop=face",
  ];

  function initEmployees() {
    const raw = [
      { code: "EMP-001", name: "Rahul Sharma", brand: "Birbal Kitchen", location: "Indiranagar", dept: "Kitchen", desig: "Chef", status: "active", basic: 12000, hra: 4000, other: 2000, bonus: 1000, legacyPerDay: 0, esi: true, pf: true },
      { code: "EMP-002", name: "Priya Nair", brand: "Birbal Kitchen", location: "Koramangala", dept: "Service", desig: "Waiter", status: "active", basic: 8000, hra: 2000, other: 0, bonus: 500, legacyPerDay: 0, esi: true, pf: true },
      { code: "EMP-003", name: "Amit Patel", brand: "Spice Route", location: "Whitefield", dept: "Kitchen", desig: "Helper", status: "active", basic: 0, hra: 0, other: 0, bonus: 0, legacyPerDay: 450, esi: true, pf: false },
      { code: "EMP-004", name: "Sneha Reddy", brand: "Spice Route", location: "HSR Layout", dept: "Management", desig: "Manager", status: "active", basic: 18000, hra: 6000, other: 3000, bonus: 2000, legacyPerDay: 0, esi: false, pf: true },
      { code: "EMP-005", name: "Vikram Singh", brand: "Masala Bay", location: "JP Nagar", dept: "Service", desig: "Cashier", status: "active", basic: 9000, hra: 2500, other: 500, bonus: 0, legacyPerDay: 0, esi: true, pf: true },
      { code: "EMP-006", name: "Anita Das", brand: "Curry House", location: "MG Road", dept: "Kitchen", desig: "Chef", status: "active", basic: 11000, hra: 3500, other: 1500, bonus: 800, legacyPerDay: 0, esi: true, pf: true },
      { code: "EMP-007", name: "Karan Mehta", brand: "Curry House", location: "Brigade Road", dept: "Service", desig: "Waiter", status: "active", basic: 7500, hra: 2000, other: 0, bonus: 0, legacyPerDay: 0, esi: true, pf: true },
      { code: "EMP-008", name: "Deepa Iyer", brand: "Curry House", location: "Jayanagar", dept: "Housekeeping", desig: "Helper", status: "left", basic: 6000, hra: 1500, other: 0, bonus: 0, legacyPerDay: 0, esi: true, pf: true },
      { code: "EMP-009", name: "Mohammed Ali", brand: "Birbal Kitchen", location: "Indiranagar", dept: "Kitchen", desig: "Helper", status: "active", basic: 0, hra: 0, other: 0, bonus: 0, legacyPerDay: 400, esi: true, pf: true },
      { code: "EMP-010", name: "Lakshmi V", brand: "Masala Bay", location: "JP Nagar", dept: "Service", desig: "Waiter", status: "active", basic: 8200, hra: 2200, other: 0, bonus: 500, legacyPerDay: 0, esi: true, pf: true },
      { code: "EMP-011", name: "Rajesh Kumar", brand: "Spice Route", location: "Whitefield", dept: "Kitchen", desig: "Chef", status: "active", basic: 13000, hra: 4500, other: 2000, bonus: 1200, legacyPerDay: 0, esi: true, pf: true },
      { code: "EMP-012", name: "Fatima Khan", brand: "Curry House", location: "MG Road", dept: "Service", desig: "Waiter", status: "active", basic: 7800, hra: 2000, other: 0, bonus: 0, legacyPerDay: 0, esi: true, pf: true },
    ];

    state.employees = raw.map((e, i) => ({
      id: i + 1,
      ...e,
      photoUrl: EMPLOYEE_PHOTOS[i % EMPLOYEE_PHOTOS.length],
      phone: "98" + String(10000000 + i).slice(0, 8),
      joiningDate: "2023-0" + ((i % 9) + 1) + "-15",
      pan: "ABCDE" + String(1000 + i) + "F",
      uan: "1002345678" + String(10 + i).padStart(2, "0").slice(-2),
      bank: "HDFC Bank",
      account: "****" + String(1000 + i),
      ifsc: "HDFC0001234",
    }));

    initPayrollRows();
  }

  function payrollKey(empId) {
    return `${empId}-${state.period.month}-${state.period.year}`;
  }

  function initPayrollRows() {
    const defaults = {
      1: { days: 28, outletAdv: 0, companyAdv: 500, otherDed: 0, saved: true, payment: "paid", rowEsi: true, rowPf: true, notes: "" },
      2: { days: 26, outletAdv: 200, companyAdv: 0, otherDed: 0, saved: true, payment: "not_paid", rowEsi: true, rowPf: true, notes: "" },
      3: { days: 30, outletAdv: 0, companyAdv: 0, otherDed: 0, saved: true, payment: "paid", rowEsi: true, rowPf: false, notes: "" },
      4: { days: 30, outletAdv: 0, companyAdv: 1000, otherDed: 0, saved: true, payment: "hold", rowEsi: false, rowPf: true, notes: "Advance recovery" },
      5: { days: 27.5, outletAdv: 0, companyAdv: 0, otherDed: 100, saved: true, payment: "not_paid", rowEsi: true, rowPf: true, notes: "" },
      6: { days: 28, outletAdv: 0, companyAdv: 0, otherDed: 0, saved: true, payment: "paid", rowEsi: true, rowPf: true, notes: "" },
      7: { days: 25, outletAdv: 150, companyAdv: 0, otherDed: 0, saved: false, payment: "not_paid", rowEsi: true, rowPf: true, notes: "" },
      9: { days: 29, outletAdv: 0, companyAdv: 0, otherDed: 0, saved: false, payment: "not_paid", rowEsi: true, rowPf: true, notes: "" },
      10: { days: 26, outletAdv: 0, companyAdv: 300, otherDed: 0, saved: true, payment: "not_paid", rowEsi: true, rowPf: true, notes: "" },
      11: { days: 30, outletAdv: 0, companyAdv: 0, otherDed: 0, saved: true, payment: "paid", rowEsi: true, rowPf: true, notes: "" },
      12: { days: 0, outletAdv: 0, companyAdv: 0, otherDed: 0, saved: true, payment: "hold", rowEsi: true, rowPf: true, notes: "On leave entire month" },
    };

    state.payroll = {};
    state.employees.forEach((emp) => {
      if (emp.status !== "active") return;
      const d = defaults[emp.id];
      if (d) {
        state.payroll[payrollKey(emp.id)] = { ...d, dirty: false };
      } else {
        state.payroll[payrollKey(emp.id)] = {
          days: 0, outletAdv: 0, companyAdv: 0, otherDed: 0,
          saved: false, payment: "not_paid", rowEsi: emp.esi, rowPf: emp.pf,
          notes: "", dirty: false,
        };
      }
    });
  }

  function effectivePerDay(emp) {
    const total = emp.basic + emp.hra + emp.other + emp.bonus;
    if (total > 0) return Math.round((total / 30) * 100) / 100;
    return emp.legacyPerDay || 0;
  }

  function calculate(emp, row) {
    const perDay = effectivePerDay(emp);
    const gross = Math.round(perDay * (row.days || 0) * 100) / 100;
    const pfWage = Math.min(gross, 15000);
    const esiEmp = row.rowEsi ? Math.round(gross * 0.0075 * 100) / 100 : 0;
    const pfEmp = row.rowPf ? Math.round(pfWage * 0.12 * 100) / 100 : 0;
    const net = Math.round((gross - (row.outletAdv || 0) - (row.companyAdv || 0) - (row.otherDed || 0) - esiEmp - pfEmp) * 100) / 100;
    return { perDay, gross, esiEmp, pfEmp, net };
  }

  function formatINR(n) {
    return "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function getActiveEmployees() {
    return state.employees.filter((e) => {
      if (e.status !== "active") return false;
      if (state.filters.brand && e.brand !== state.filters.brand) return false;
      if (state.filters.location && e.location !== state.filters.location) return false;
      return true;
    });
  }

  function getRow(empId) {
    const key = payrollKey(empId);
    if (!state.payroll[key]) {
      const emp = state.employees.find((e) => e.id === empId);
      state.payroll[key] = {
        days: 0, outletAdv: 0, companyAdv: 0, otherDed: 0,
        saved: false, payment: "not_paid",
        rowEsi: emp?.esi ?? true, rowPf: emp?.pf ?? true,
        notes: "", dirty: false,
      };
    }
    return state.payroll[key];
  }

  function dirtyCount() {
    return getActiveEmployees().filter((e) => {
      const r = getRow(e.id);
      return r.dirty || !r.saved;
    }).length;
  }

  function savedCount() {
    return getActiveEmployees().filter((e) => getRow(e.id).saved).length;
  }

  // --- UI helpers ---
  function $(id) { return document.getElementById(id); }

  function toast(msg) {
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    $("toastContainer").appendChild(el);
    setTimeout(() => el.remove(), 2800);
  }

  function refreshIcons() {
    if (typeof lucide !== "undefined") lucide.createIcons();
  }

  function showScreen(name) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    document.querySelectorAll(".nav-item, .bottom-nav-item").forEach((n) => n.classList.remove("active"));

    const map = {
      dashboard: "screen-dashboard",
      people: "screen-people",
      employees: "screen-people",
      register: "screen-people",
      payroll: "screen-payroll",
      "payroll-work": "screen-payroll",
      "payroll-review": "screen-payroll",
      settings: "screen-settings",
      "employee-detail": "screen-employee-detail",
    };

    const screenId = map[name] || "screen-dashboard";
    const el = document.getElementById(screenId);
    if (el) el.classList.add("active");

    const navKey = name.startsWith("payroll") ? "payroll" : (name === "employees" || name === "register" ? "people" : name);
    document.querySelectorAll(`.nav-item[data-screen="${navKey}"], .bottom-nav-item[data-screen="${navKey}"]`).forEach((n) => n.classList.add("active"));

    if (name === "register") {
      state.peopleView = "register";
      document.querySelectorAll(".view-btn").forEach((b) => {
        b.classList.toggle("active", b.dataset.view === "register");
      });
      renderEmployees();
    }

    if (name === "payroll-work") setPayrollMode("work");
    if (name === "payroll-review") setPayrollMode("review");

    state.currentScreen = name === "employees" || name === "register" ? "people" : (name.startsWith("payroll") ? "payroll" : name);
    renderPeriodStrip();
    updateTopbar();
    updateMigrationBanner();
    refreshIcons();
  }

  function updateTopbar() {
    const screenEl = $("topbarScreen");
    const periodChip = $("topbarPeriodChip");
    const periodLabelEl = $("topbarPeriodLabel");
    const statusChip = $("topbarStatusChip");
    if (!screenEl) return;

    const titles = {
      dashboard: "Month close",
      people: state.peopleView === "register" ? "People · Pay register" : "People",
      payroll: state.payrollMode === "review" ? "Monthly payroll · Payments & slips" : "Monthly payroll · Enter payroll",
      settings: "Settings",
      "employee-detail": "Edit employee",
    };
    screenEl.textContent = titles[state.currentScreen] || "Month close";

    const onPayroll = state.currentScreen === "payroll";
    periodChip?.classList.toggle("hidden", !onPayroll);
    if (periodLabelEl) periodLabelEl.textContent = filterLabel();

    if (!statusChip) return;
    statusChip.className = "topbar-status-chip hidden";
    if (state.currentScreen === "dashboard") {
      if (state.migrationPending) {
        statusChip.textContent = `${importBlockerCount()} import issues`;
        statusChip.classList.add("is-blocked");
        statusChip.classList.remove("hidden");
      } else if (!state.periodLocked) {
        const { unsaved, unpaid } = periodReadiness();
        if (unsaved > 0) {
          statusChip.textContent = `${unsaved} unsaved`;
          statusChip.classList.add("is-progress");
          statusChip.classList.remove("hidden");
        } else if (unpaid > 0) {
          statusChip.textContent = `${unpaid} unpaid`;
          statusChip.classList.add("is-progress");
          statusChip.classList.remove("hidden");
        }
      }
    }
  }

  function navigate(name) {
    const target = name.startsWith("payroll") ? "payroll" : name;
    if (name === "payroll-work" && state.migrationPending) {
      toast("Fix import issues before entering payroll");
      openImportWizard({ step: 3, focusErrors: true });
      return;
    }
    const leavingPayroll =
      state.currentScreen === "payroll" &&
      !name.startsWith("payroll");
    if (dirtyCount() > 0 && leavingPayroll && state.payrollMode === "work") {
      state.pendingNav = name;
      $("dirtyDialogMsg").textContent = `You have ${dirtyCount()} unsaved payroll row(s). Save before leaving?`;
      $("dirtyDialog").showModal();
      return;
    }
    if (name === "payroll-review") {
      showScreen("payroll");
      setPayrollMode("review");
    } else if (name === "payroll-work") {
      showScreen("payroll");
      setPayrollMode("work");
    } else if (name === "settings") {
      openSettingsTab(state.settingsTab || "org");
    } else {
      showScreen(name);
    }
    if (target === "dashboard" || name === "dashboard") renderDashboard();
    if (name.startsWith("payroll") || target === "payroll") renderPayroll();
    if (name === "people" || name === "employees" || name === "register") renderEmployees();
    updateMigrationBanner();
  }

  function setPayrollMode(mode) {
    if (mode === "work" && state.migrationPending) {
      toast("Fix import issues before entering payroll");
      openImportWizard({ step: 3, focusErrors: true });
      return;
    }
    state.payrollMode = mode;
    document.querySelectorAll(".mode-btn").forEach((b) => {
      const on = b.dataset.mode === mode;
      b.classList.toggle("active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });
    $("payrollSubtitle").textContent = mode === "work"
      ? "Enter days worked, advances, and ESI/PF for this month"
      : "Confirm payments, view salary slips, and mark who has been paid";
    updateTopbar();
    $("saveAllBtn").classList.toggle("hidden", mode === "review");
    $("exportReviewBtn").classList.toggle("hidden", mode === "work");
    $("saveProgress").classList.toggle("hidden", mode === "review");
    renderPayroll();
  }

  function periodLabel() {
    return `${MONTHS[state.period.month]} ${state.period.year}`;
  }

  function filterLabel() {
    const parts = [periodLabel()];
    if (state.filters.brand) parts.push(state.filters.brand);
    else parts.push("All brands");
    if (state.filters.location) parts.push(state.filters.location);
    else parts.push("All locations");
    return parts.join(" · ");
  }

  function renderPeriodStrip() {
    const label = filterLabel();
    const strip = $("periodStrip");
    const payrollStrip = $("payrollPeriodStrip");
    const payrollLabel = $("payrollPeriodLabel");
    if (strip) strip.textContent = label;
    if (payrollStrip) payrollStrip.textContent = label;
    if (payrollLabel) payrollLabel.textContent = label;
  }

  function renderPeriodSelectors() {
    const mSel = $("periodMonth");
    const ySel = $("periodYear");
    mSel.innerHTML = MONTHS.map((m, i) =>
      `<option value="${i}" ${i === state.period.month ? "selected" : ""}>${m}</option>`
    ).join("");
    ySel.innerHTML = [2025, 2026, 2027].map((y) =>
      `<option value="${y}" ${y === state.period.year ? "selected" : ""}>${y}</option>`
    ).join("");

    const bSel = $("periodBrand");
    bSel.innerHTML = '<option value="">All brands</option>' +
      BRANDS.map((b) => `<option value="${b}" ${state.filters.brand === b ? "selected" : ""}>${b}</option>`).join("");

    const lSel = $("periodLocation");
    const locs = state.filters.brand ? (LOCATIONS[state.filters.brand] || []) : [...new Set(Object.values(LOCATIONS).flat())];
    lSel.innerHTML = '<option value="">All locations</option>' +
      locs.map((l) => `<option value="${l}" ${state.filters.location === l ? "selected" : ""}>${l}</option>`).join("");

    $("dashboardTitle").textContent = periodLabel();
    renderPeriodStrip();
  }

  function aggregateStats() {
    const emps = getActiveEmployees();
    let paidTotal = 0, pendingTotal = 0, paidCount = 0, pendingCount = 0, netTotal = 0, advTotal = 0, saved = 0;

    emps.forEach((emp) => {
      const row = getRow(emp.id);
      const calc = calculate(emp, row);
      netTotal += calc.net;
      advTotal += (row.outletAdv || 0) + (row.companyAdv || 0);
      if (row.saved) saved += 1;
      if (row.payment === "paid") {
        paidTotal += calc.net;
        paidCount += 1;
      } else {
        pendingTotal += calc.net;
        pendingCount += 1;
      }
    });

    return { paidTotal, pendingTotal, paidCount, pendingCount, netTotal, advTotal, saved, total: emps.length };
  }

  function initImportDemo() {
    state.importErrors = IMPORT_ERROR_TEMPLATE.map((e) => ({ ...e, fixed: false }));
    state.importFileUploaded = true;
    state.letterheads = structuredClone(LETTERHEAD_META);
  }

  function importBlockerCount() {
    return state.importErrors.filter((e) => e.severity === "blocking" && !e.fixed).length;
  }

  function importWarningCount() {
    return state.importErrors.filter((e) => e.severity === "warning" && !e.fixed).length;
  }

  function unfixedImportErrors() {
    return state.importErrors.filter((e) => !e.fixed);
  }

  function applyImportFix(errorId) {
    const err = state.importErrors.find((e) => e.id === errorId);
    if (!err || err.fixed) return;
    err.fixed = true;
    toast(`${err.code}: ${err.fixSummary}`);
    renderImportWizard();
    renderImportBlockers();
    renderDashboard();
    updateMigrationBanner();
  }

  function applyAllImportFixes() {
    let applied = 0;
    state.importErrors.forEach((err) => {
      if (!err.fixed) {
        err.fixed = true;
        applied += 1;
      }
    });
    if (applied > 0) {
      toast(`Applied ${applied} demo fix(es) to import file`);
      renderImportWizard();
      renderImportBlockers();
      renderDashboard();
      updateMigrationBanner();
    }
  }

  function importSummaryHtml() {
    const blocking = importBlockerCount();
    const warnings = importWarningCount();
    const ready = IMPORT_DEMO_STATS.rowCount - blocking;
    return `<div class="import-summary-card">
      <div class="import-summary-row"><span>File</span><strong>${IMPORT_DEMO_STATS.fileName}</strong></div>
      <div class="import-summary-row"><span>Rows in file</span><strong>${IMPORT_DEMO_STATS.rowCount}</strong></div>
      <div class="import-summary-row"><span>Ready to import</span><strong>${ready}</strong></div>
      <div class="import-summary-row"><span>Blocking issues</span><strong>${blocking}</strong></div>
      <div class="import-summary-row"><span>Warnings</span><strong>${warnings}</strong></div>
      <div class="import-summary-row"><span>Monthly gross (preview)</span><strong>${formatINR(IMPORT_DEMO_STATS.monthlyGross)}</strong></div>
    </div>`;
  }

  function monthlyPackage(emp) {
    return emp.basic + emp.hra + emp.other + emp.bonus;
  }

  function letterheadStripHtml(brand) {
    const meta = state.letterheads[brand] || LETTERHEAD_META[brand];
    if (!meta?.hasFile) {
      return `<div class="slip-brand-block">
        <h3 class="slip-brand-name">${brand}</h3>
        <p class="slip-brand-meta">Plain header (no letterhead uploaded)</p>
      </div>`;
    }
    return `<div class="slip-letterhead-strip" aria-hidden="true">${brand}</div>`;
  }

  function getLifecycleStep() {
    if (state.periodLocked) return 4;
    const { unsaved, unpaid } = periodReadiness();
    if (state.migrationPending) return 0;
    if (unsaved > 0) return 1;
    if (!state.reconciliation.totalsMatched || unpaid > 0) return 2;
    if (unpaid === 0 && state.reconciliation.totalsMatched) return 3;
    return 1;
  }

  function renderPeriodLifecycle() {
    const current = getLifecycleStep();
    const el = $("periodLifecycle");
    if (!el) return;
    el.innerHTML = LIFECYCLE_STEPS.map((label, i) => {
      const isDone = i < current;
      const isActive = i === current;
      const cls = isDone ? "done" : isActive ? "active" : "";
      const marker = isDone
        ? '<span class="lifecycle-check" aria-hidden="true"><i data-lucide="check"></i></span>'
        : '<span class="dot"></span>';
      const conn = i < LIFECYCLE_STEPS.length - 1
        ? `<span class="lifecycle-connector ${isDone ? "done" : ""}"></span>`
        : "";
      return `<span class="lifecycle-step ${cls}">${marker}${label}</span>${conn}`;
    }).join("");
  }

  function setNextActionVariant(block, variant) {
    block.classList.remove("is-blocked", "is-ready", "is-locked");
    if (variant) block.classList.add(variant);
  }

  function earningsBreakdown(emp, row) {
    const factor = (row.days || 0) / 30;
    if (emp.legacyPerDay > 0) {
      return [{ label: "Daily wages", amount: Math.round(emp.legacyPerDay * (row.days || 0) * 100) / 100 }];
    }
    const lines = [
      { label: "Basic", amount: Math.round(emp.basic * factor * 100) / 100 },
      { label: "HRA", amount: Math.round(emp.hra * factor * 100) / 100 },
      { label: "Other allowance", amount: Math.round(emp.other * factor * 100) / 100 },
      { label: "Bonus", amount: Math.round(emp.bonus * factor * 100) / 100 },
    ].filter((l) => l.amount > 0);
    return lines;
  }

  function deductionLines(row, calc) {
    const lines = [];
    if (calc.esiEmp > 0) lines.push({ label: "Employee ESI", amount: calc.esiEmp });
    if (calc.pfEmp > 0) lines.push({ label: "Employee PF", amount: calc.pfEmp });
    if (row.outletAdv > 0) lines.push({ label: "Outlet advance", amount: row.outletAdv });
    if (row.companyAdv > 0) lines.push({ label: "Company advance", amount: row.companyAdv });
    if (row.otherDed > 0) lines.push({ label: "Other deduction", amount: row.otherDed });
    return lines;
  }

  function renderSalarySlipHtml(emp, row, calc) {
    const isPreview = !row.saved || row.dirty;
    const earnings = earningsBreakdown(emp, row);
    const deductions = deductionLines(row, calc);
    const totalDed = deductions.reduce((s, l) => s + l.amount, 0);
    const periodLabel = `${MONTHS[state.period.month]} ${state.period.year}`;
    const generated = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

    const earningRows = earnings.map((l) =>
      `<div class="slip-line"><span>${l.label}</span><span>${formatINR(l.amount)}</span></div>`
    ).join("");
    const dedRows = deductions.map((l) =>
      `<div class="slip-line"><span>${l.label}</span><span>${formatINR(l.amount)}</span></div>`
    ).join("");

    return `
      ${isPreview ? '<div class="slip-preview-banner">Preview. Save the row to finalize slip amounts.</div>' : ""}
      <div class="slip-letterhead-zone">
        ${letterheadStripHtml(emp.brand)}
      </div>
      <div class="slip-doc-title">
        <span>Payslip</span>
        <span>${periodLabel}</span>
      </div>
      <dl class="slip-meta-grid">
        <dt>Employee</dt><dd>${emp.name}</dd>
        <dt>Employee ID</dt><dd>${emp.code}</dd>
        <dt>Designation</dt><dd>${emp.desig}</dd>
        <dt>Department</dt><dd>${emp.dept}</dd>
        <dt>Date of joining</dt><dd>${emp.joiningDate}</dd>
        <dt>PAN</dt><dd>${emp.pan.replace(/^(.{5}).*(.)$/, "$1••••$2")}</dd>
        <dt>Days worked</dt><dd>${row.days} / 30</dd>
        <dt>Payment status</dt><dd>${row.payment === "paid" ? "Paid" : row.payment === "hold" ? "Hold" : "Not paid"}</dd>
      </dl>
      <div class="slip-columns">
        <div class="slip-col">
          <h4>Earnings</h4>
          ${earningRows || '<div class="slip-line"><span>None</span><span>None</span></div>'}
          <div class="slip-line subtotal"><span>Gross</span><span>${formatINR(calc.gross)}</span></div>
        </div>
        <div class="slip-col">
          <h4>Deductions</h4>
          ${dedRows || '<div class="slip-line"><span>None</span><span>None</span></div>'}
          <div class="slip-line subtotal"><span>Total</span><span>${formatINR(totalDed)}</span></div>
        </div>
      </div>
      <div class="slip-net-band">
        <span>Net pay</span>
        <span>${formatINR(calc.net)}</span>
      </div>
      ${row.notes ? `<p class="slip-notes"><strong>Notes:</strong> ${row.notes}</p>` : ""}
      <div class="slip-footer">
        Generated ${generated} · Calc rule v1.0 (prototype)<br>
        Computer-generated payslip. For queries contact HR.
      </div>`;
  }

  function renderImportBlockers() {
    const section = $("blockerSection");
    const list = $("blockerList");
    if (!section || !list) return;
    const blocking = importBlockerCount();
    const warnings = importWarningCount();
    section.classList.toggle("hidden", !state.migrationPending);
    $("blockerCount").textContent = `${blocking + warnings} to fix`;
    const open = unfixedImportErrors();
    list.innerHTML = open.length ? open.map((e) => `
      <div class="blocker-row">
        <div class="issue-primary">
          <strong>Row ${e.row} · ${e.code} · ${e.name}</strong>
          <span class="meta">${e.message}</span>
        </div>
        ${severityChip(e.severity === "blocking" ? "blocker" : "warning")}
        <button type="button" class="btn ghost small review-blocker-btn" data-fix-id="${e.id}">Fix</button>
      </div>
    `).join("") : `<p class="text-meta" style="margin:0">All row issues fixed. Confirm import in Settings to unblock month close.</p>`;
    list.querySelectorAll(".review-blocker-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.dataset.fixId) applyImportFix(btn.dataset.fixId);
        else openImportWizard({ step: 3, focusErrors: true });
      });
    });
  }

  function renderImportErrorRow(err) {
    const rowCls = err.fixed
      ? "import-error-row is-fixed"
      : err.severity === "blocking"
        ? "import-error-row is-blocking"
        : "import-error-row is-warning";
    return `<div class="${rowCls}" data-error-id="${err.id}">
      <div>
        <strong>Row ${err.row} · ${err.code} · ${err.name}</strong>
        <div class="import-error-meta">${err.message}</div>
        ${err.fixed ? `<div class="import-error-fix-applied">Fixed: ${err.fixSummary}</div>` : `<div class="import-error-meta">Suggested: ${err.fixSummary}</div>`}
      </div>
      ${err.fixed
        ? '<span class="chip active">Fixed</span>'
        : `<button type="button" class="btn secondary small import-fix-btn" data-fix-id="${err.id}">${err.fixLabel}</button>`}
    </div>`;
  }

  function severityChip(severity) {
    const map = {
      blocker: '<span class="chip blocker"><i data-lucide="octagon-alert"></i> Blocker</span>',
      warning: '<span class="chip warning"><i data-lucide="alert-triangle"></i> Warning</span>',
      info: '<span class="chip info"><i data-lucide="info"></i> Info</span>',
    };
    return map[severity] || severity;
  }

  function saveIndicator(row) {
    if (!row.saved || row.dirty) {
      return '<span class="save-indicator unsaved">Unsaved</span>';
    }
    return '<span class="save-indicator saved">Saved</span>';
  }

  function deductionsTotal(row) {
    return (row.outletAdv || 0) + (row.companyAdv || 0) + (row.otherDed || 0);
  }

  function renderDeductionsEditor(empId, row, locked) {
    if (locked || state.periodLocked) {
      return `<span class="ded-total">${formatINR(deductionsTotal(row))}</span>`;
    }
    return `<span class="ded-total">${formatINR(deductionsTotal(row))}</span>
      <button type="button" class="btn-link-save ded-edit-btn" data-expand="${empId}">Edit advances &amp; deductions</button>`;
  }

  function renderReconcileChecklist(readiness) {
    const { s, unsaved, unpaid } = readiness;
    const items = [
      { key: "totals", label: "Payroll total matches your register or spreadsheet", done: state.reconciliation.totalsMatched,
        action: !state.reconciliation.totalsMatched ? '<button type="button" class="btn-link-save" id="confirmTotalsBtn">Confirm match</button>' : "" },
      { key: "saved", label: "All employee payroll entries saved", done: unsaved === 0 && s.saved === s.total },
      { key: "blockers", label: "No import issues remaining", done: !state.migrationPending },
      { key: "exceptions", label: "No unpaid or unsaved salaries", done: getAttentionItems().length === 0 },
      { key: "payments", label: "Payment status confirmed for everyone", done: unpaid === 0 },
      { key: "export", label: "Reports downloaded (CSV)", done: state.reconciliation.exported,
        action: !state.reconciliation.exported ? '<button type="button" class="btn-link-save" id="confirmExportBtn">Mark downloaded</button>' : "" },
    ];
    $("reconcileChecklist").innerHTML = items.map((item) => `
      <li class="${item.done ? "done" : "pending"}">
        <i data-lucide="${item.done ? "check-circle" : "circle"}" class="check-icon"></i>
        <span>${item.label} ${item.action || ""}</span>
      </li>
    `).join("");
    $("confirmTotalsBtn")?.addEventListener("click", () => {
      state.reconciliation.totalsMatched = true;
      toast("Totals confirmed against your pay register");
      renderDashboard();
    });
    $("confirmExportBtn")?.addEventListener("click", () => {
      state.reconciliation.exported = true;
      toast("Export recorded");
      renderDashboard();
    });
    const allDone = items.every((i) => i.done);
    $("lockPeriodBtn").disabled = !allDone || state.periodLocked;
    return allDone;
  }

  function updateMigrationBanner() {
    const banner = $("migrationBanner");
    if (!banner || state.migrationPending === false) {
      banner?.classList.add("hidden");
      return;
    }
    if (state.currentScreen === "dashboard") {
      banner.classList.add("hidden");
      return;
    }
    banner.classList.remove("hidden");
    banner.classList.toggle("compact", state.bannerCompact);
    banner.classList.toggle("on-import-tab", state.currentScreen === "settings" && state.settingsTab === "import");
    const blocking = importBlockerCount();
    $("migrationBannerText").textContent =
      `${blocking + importWarningCount()} import issue${blocking + importWarningCount() === 1 ? "" : "s"} must be fixed before you can close this month.`;
    const compactEl = $("migrationBannerCompact") || banner.querySelector(".banner-compact");
    if (compactEl) compactEl.textContent = `${blocking + importWarningCount()} import issues`;
  }

  function getAttentionItems() {
    const attention = [];
    getActiveEmployees().forEach((emp) => {
      const row = getRow(emp.id);
      const calc = calculate(emp, row);
      if (!row.saved || row.dirty) attention.push({ emp, issue: "unsaved", net: calc.net, detail: "Unsaved payroll row" });
      else if (row.payment === "not_paid") attention.push({ emp, issue: "not_paid", net: calc.net, detail: "Payment not recorded" });
      else if (row.payment === "hold") attention.push({ emp, issue: "hold", net: calc.net, detail: "On hold. Resolve before month close." });
    });
    return attention;
  }

  function periodReadiness() {
    const s = aggregateStats();
    const attention = getAttentionItems();
    const unsaved = attention.filter((a) => a.issue === "unsaved").length;
    const unpaid = getActiveEmployees().filter((e) => getRow(e.id).payment !== "paid").length;
    const canReconcile = !state.migrationPending && unsaved === 0 && s.saved === s.total;
    const readyToClose = canReconcile && unpaid === 0 && !state.periodLocked
      && state.reconciliation.totalsMatched && state.reconciliation.exported
      && attention.length === 0;
    return { s, attention, unsaved, unpaid, canReconcile, readyToClose };
  }

  function renderDashboard() {
    const { s, attention, unsaved, unpaid, readyToClose } = periodReadiness();
    const chip = $("periodStateChip");
    const meta = $("periodStateMeta");

    if (state.periodLocked) {
      chip.textContent = "Locked";
      chip.className = "chip period-state locked";
      meta.textContent = `${periodLabel()} is locked. No further edits.`;
    } else if (state.migrationPending) {
      chip.textContent = "Import review";
      chip.className = "chip period-state blocked";
      meta.textContent = `${importBlockerCount()} import issue(s) block month close`;
    } else if (readyToClose) {
      chip.textContent = "Ready to close";
      chip.className = "chip period-state ready";
      meta.textContent = "Check totals, download reports, and lock the month";
    } else if (unsaved > 0) {
      chip.textContent = "In progress";
      chip.className = "chip period-state";
      meta.textContent = `${unsaved} row(s) need saving`;
    } else if (unpaid > 0) {
      chip.textContent = "Awaiting payment";
      chip.className = "chip period-state";
      meta.textContent = `${unpaid} employee(s) not marked paid`;
    } else {
      chip.textContent = "In progress";
      chip.className = "chip period-state";
      meta.textContent = "This month isn't closed yet";
    }

    const next = $("nextActionBlock");
    if (state.periodLocked) {
      setNextActionVariant(next, "is-locked");
      next.innerHTML = `
        <h2>Period closed</h2>
        <p>${periodLabel()} is locked. Download reports from Settings.</p>
        <button type="button" class="btn secondary" id="dashExportBtn"><i data-lucide="download"></i> Export CSV</button>`;
      next.querySelector("#dashExportBtn")?.addEventListener("click", () => toast("March payroll summary downloaded"));
    } else if (state.migrationPending) {
      setNextActionVariant(next, "is-blocked");
      next.innerHTML = `
        <h2>Fix import issues first</h2>
        <p>${importBlockerCount()} import issue(s) block month close for ${periodLabel()}. ${getAttentionItems().length} payroll item(s) are tracked separately below.</p>
        <button type="button" class="btn primary" id="dashReviewImportBtn">Review import →</button>`;
      next.querySelector("#dashReviewImportBtn")?.addEventListener("click", () => openImportWizard({ step: 3, focusErrors: true }));
    } else if (unsaved > 0) {
      setNextActionVariant(next, null);
      next.innerHTML = `
        <h2>Save payroll entries</h2>
        <p>${unsaved} employee(s) still have unsaved changes. Finish entering payroll before marking payments.</p>
        <button type="button" class="btn primary" id="dashContinueWorkBtn">Enter payroll →</button>`;
      next.querySelector("#dashContinueWorkBtn")?.addEventListener("click", () => navigate("payroll-work"));
    } else if (unpaid > 0) {
      setNextActionVariant(next, null);
      next.innerHTML = `
        <h2>Mark who has been paid</h2>
        <p>${unpaid} employee(s) are still unpaid or on hold. Record payment after you pay them outside this app.</p>
        <button type="button" class="btn primary" id="dashOpenReviewBtn">Payments &amp; slips →</button>`;
      next.querySelector("#dashOpenReviewBtn")?.addEventListener("click", () => navigate("payroll-review"));
    } else {
      setNextActionVariant(next, readyToClose ? "is-ready" : null);
      next.innerHTML = `
        <h2>Close ${periodLabel()}</h2>
        <p>Complete the checklist, download reports, then lock this month.</p>
        <button type="button" class="btn primary" id="dashCloseBtn"><i data-lucide="clipboard-check"></i> Open close-month checklist</button>`;
      next.querySelector("#dashCloseBtn")?.addEventListener("click", () => {
        $("closePeriodBlock").scrollIntoView({ behavior: "smooth" });
        $("closePeriodBlock").classList.remove("hidden");
      });
    }

    renderPeriodLifecycle();
    renderImportBlockers();
    updateMigrationBanner();

    $("exceptionsSection")?.classList.toggle("is-muted", state.migrationPending);
    $("dashboardIssuesCol")?.classList.toggle("single-col", !state.migrationPending);

    const limit = state.showAllExceptions ? attention.length : 4;
    const list = $("exceptionsList");
    const empty = $("attentionEmpty");
    const viewAllBtn = $("viewAllExceptionsBtn");
    $("exceptionCount").textContent = attention.length > 0 ? `${attention.length} to resolve` : "";

    if (attention.length === 0) {
      list.innerHTML = "";
      empty.classList.remove("hidden");
      viewAllBtn?.classList.add("hidden");
    } else {
      empty.classList.add("hidden");
      list.innerHTML = attention.slice(0, limit).map(({ emp, issue, net, detail }) => `
        <div class="issue-row">
          <div class="issue-primary">
            <strong>${emp.name}</strong>
            <span class="meta">${emp.location} · ${detail}</span>
          </div>
          ${issueChip(issue)}
          <span class="issue-amount num">${formatINR(net)}</span>
        </div>
      `).join("");
      if (attention.length > 4) {
        viewAllBtn.classList.remove("hidden");
        viewAllBtn.textContent = state.showAllExceptions
          ? "Show fewer"
          : `View all ${attention.length} items`;
      } else {
        viewAllBtn?.classList.add("hidden");
      }
    }

    const byLoc = {};
    getActiveEmployees().forEach((emp) => {
      const key = emp.location;
      if (!byLoc[key]) byLoc[key] = { count: 0, gross: 0, net: 0, brand: emp.brand, open: 0 };
      const row = getRow(emp.id);
      const c = calculate(emp, row);
      byLoc[key].count += 1;
      byLoc[key].gross += c.gross;
      byLoc[key].net += c.net;
      if (!row.saved || row.dirty || row.payment !== "paid") byLoc[key].open += 1;
    });

    const sortedLocs = Object.entries(byLoc).sort((a, b) => b[1].net - a[1].net);

    $("locationAccordion").innerHTML = sortedLocs.map(([loc, data]) => {
      const statusChip = data.open > 0
        ? `<span class="chip pending chip-compact">${data.open} open</span>`
        : `<span class="chip paid chip-compact">Clear</span>`;
      return `<button type="button" class="location-row" data-location="${loc}" aria-label="Open payments and slips for ${loc}, ${data.count} employees, net ${formatINR(data.net)}">
        <span class="location-primary">
          <strong class="location-name">${loc}</strong>
          <span class="location-brand">${data.brand}</span>
        </span>
        <span class="location-emp num">${data.count}</span>
        <span class="location-net num">${formatINR(data.net)}</span>
        <span class="location-status">${statusChip}</span>
        <i data-lucide="chevron-right" class="location-chevron" aria-hidden="true"></i>
      </button>`;
    }).join("");

    $("locationAccordion").querySelectorAll(".location-row").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.filters.location = btn.dataset.location;
        renderPeriodSelectors();
        navigate("payroll-review");
      });
    });

    $("metricsInline").innerHTML = `
      <div><dt>Total net</dt><dd>${formatINR(s.netTotal)}</dd></div>
      <div><dt>Paid</dt><dd>${formatINR(s.paidTotal)}</dd></div>
      <div><dt>Not yet marked paid</dt><dd>${formatINR(s.pendingTotal)}</dd></div>
      <div><dt>Advances</dt><dd>${formatINR(s.advTotal)}</dd></div>
      <div><dt>Entries saved</dt><dd>${s.saved} / ${s.total}</dd></div>
    `;

    const closeBlock = $("closePeriodBlock");
    const canShowClose = periodReadiness().canReconcile || state.reconciliation.totalsMatched;
    closeBlock.classList.toggle("hidden", state.periodLocked ? false : !canShowClose && !readyToClose);
    $("closePeriodCopy").textContent = readyToClose
      ? `All checklist steps done. Lock ${periodLabel()} to finalize.`
      : "Complete each step before locking this month.";
    renderReconcileChecklist({ s, unsaved, unpaid });

    refreshIcons();
    updateTopbar();
  }

  function issueChip(issue) {
    const map = {
      unsaved: '<span class="chip unsaved"><i data-lucide="circle-dashed"></i> Unsaved</span>',
      not_paid: '<span class="chip pending"><i data-lucide="clock"></i> Not paid</span>',
      hold: '<span class="chip hold"><i data-lucide="pause-circle"></i> Hold</span>',
      error: '<span class="chip error"><i data-lucide="alert-circle"></i> Error</span>',
    };
    return map[issue] || issue;
  }

  function paymentChip(p) {
    const map = {
      paid: '<span class="chip paid"><i data-lucide="check-circle"></i> Paid</span>',
      not_paid: '<span class="chip pending"><i data-lucide="clock"></i> Not paid</span>',
      hold: '<span class="chip hold"><i data-lucide="pause-circle"></i> Hold</span>',
    };
    return map[p] || p;
  }

  function renderBreakdownLine(label, value, opts = {}) {
    const { strong = false, muted = false, deduct = false } = opts;
    const cls = [
      "breakdown-line",
      muted ? "is-muted" : "",
      deduct ? "is-deduct" : "",
    ].filter(Boolean).join(" ");
    return `<div class="${cls}"><span class="breakdown-label">${label}</span><span class="breakdown-value${strong ? " is-strong" : ""}">${value}</span></div>`;
  }

  function renderBreakdown(emp, row, calc, isPreview, mode) {
    const stateLabel = isPreview ? "preview" : "saved";
    const stateText = isPreview ? "Preview" : "Saved";
    const paid = state.paidRecords[emp.id];
    const audit = mode === "review" && row.payment === "paid" && paid
      ? `<div class="payment-audit"><i data-lucide="check-circle"></i><span>Paid · ${paid.method} · ${paid.date} · ${paid.actor}</span></div>`
      : "";
    const monthlyPkg = emp.basic + emp.hra + emp.other + emp.bonus;
    const totalDed = (row.outletAdv || 0) + (row.companyAdv || 0) + (row.otherDed || 0)
      + (row.rowEsi ? calc.esiEmp : 0) + (row.rowPf ? calc.pfEmp : 0);
    return `<div class="breakdown-panel">
      <div class="breakdown-header">
        <div class="breakdown-header-left">
          <span class="breakdown-title">Pay calculation</span>
          <span class="breakdown-subtitle">${emp.name} · ${emp.code}</span>
        </div>
        <span class="state-pill ${stateLabel}">${stateText}</span>
      </div>
      <div class="breakdown-grid">
        <section class="breakdown-col">
          <h4>What you entered</h4>
          ${renderBreakdownLine("Monthly package", `${formatINR(monthlyPkg)}/mo`)}
          ${renderBreakdownLine("Days worked", `${row.days} / 30`)}
          ${renderBreakdownLine("Outlet advance", formatINR(row.outletAdv || 0), { deduct: (row.outletAdv || 0) > 0 })}
          ${renderBreakdownLine("Company advance", formatINR(row.companyAdv || 0), { deduct: (row.companyAdv || 0) > 0 })}
          ${renderBreakdownLine("Other deduction", formatINR(row.otherDed || 0), { deduct: (row.otherDed || 0) > 0 })}
          ${row.notes ? renderBreakdownLine("Notes", row.notes, { muted: true }) : ""}
        </section>
        <section class="breakdown-col breakdown-col--rules">
          <h4>How pay was calculated</h4>
          ${renderBreakdownLine("Per day rate", formatINR(calc.perDay))}
          ${renderBreakdownLine("Gross", formatINR(calc.gross), { strong: true })}
          ${renderBreakdownLine("ESI 0.75%", row.rowEsi ? `− ${formatINR(calc.esiEmp)}` : "N/A", { deduct: row.rowEsi })}
          ${renderBreakdownLine("PF 12% (cap ₹15k)", row.rowPf ? `− ${formatINR(calc.pfEmp)}` : "N/A", { deduct: row.rowPf })}
          <div class="breakdown-formula">
            <span>${formatINR(calc.gross)} − ${formatINR(totalDed)}</span>
          </div>
          <button type="button" class="rule-version-link">View ESI/PF rates (Apr 2024 rules)</button>
        </section>
        <section class="breakdown-col breakdown-col--result">
          <h4>Final amount</h4>
          <div class="breakdown-net-hero">
            <span class="breakdown-net-label">Net pay</span>
            <span class="breakdown-net-value">${formatINR(calc.net)}</span>
          </div>
          ${renderBreakdownLine("ESI applicable", row.rowEsi ? "Yes" : "No")}
          ${renderBreakdownLine("PF applicable", row.rowPf ? "Yes" : "No")}
          ${audit}
        </section>
      </div>
    </div>`;
  }

  function workInputCell(field, empId, row, locked) {
    if (locked || state.periodLocked) {
      if (field === "notes") return `<span>${row.notes || "None"}</span>`;
      return `<span class="num">${field === "days" ? row.days : formatINR(row[field] || 0)}</span>`;
    }
    const val = row[field] ?? 0;
    const step = field === "days" ? ' step="0.5" min="0" max="60"' : ' step="1" min="0"';
    const cls = field === "notes" ? "cell-input cell-input-notes" : "cell-input cell-input-narrow";
    const type = field === "notes" ? "text" : "number";
    return `<input type="${type}" class="${cls}" data-field="${field}" data-emp="${empId}" value="${val}"${step} />`;
  }

  function renderEmpStickyCell(emp, row, expanded, showPaidBadge) {
    const paidBadge = showPaidBadge && row.payment === "paid" && row.saved && !row.dirty
      ? '<span class="chip paid chip-compact"><i data-lucide="lock"></i> Paid</span>'
      : "";
    return `<td class="sticky-col">
      <div class="emp-cell-inner">
        <button type="button" class="expand-btn" data-expand="${emp.id}" aria-label="Expand"><i data-lucide="chevron-${expanded ? "down" : "right"}"></i></button>
        ${renderEmployeeAvatar(emp)}
        <div class="emp-cell">
          <span class="emp-name">${emp.name}</span>
          <div class="emp-subline">
            <span class="emp-code">${emp.code}</span>${paidBadge}
          </div>
        </div>
      </div>
    </td>`;
  }

  function renderBrandLocCell(emp) {
    return `<td class="brand-loc-cell">
      <span class="cell-line-primary">${emp.brand}</span>
      <span class="cell-line-secondary">${emp.location}</span>
    </td>`;
  }

  function renderPayroll() {
    const mode = state.payrollMode;
    const search = ($("payrollSearch").value || "").toLowerCase();
    const emps = getActiveEmployees().filter((e) =>
      e.name.toLowerCase().includes(search) || e.code.toLowerCase().includes(search)
    );

    const thead = $("payrollThead");
    const tableWrap = $("payrollTableWrap");
    tableWrap.classList.toggle("review-readonly", mode === "review");

    if (mode === "work") {
      thead.innerHTML = `<tr>
        <th class="sticky-col">Employee</th>
        <th>Brand / outlet</th>
        <th class="num">Days</th>
        <th class="num">Advances &amp; deductions</th>
        <th class="num">Gross</th>
        <th class="num">Net</th>
        <th>Save status</th>
      </tr>`;
    } else {
      thead.innerHTML = `<tr>
        <th class="sticky-col">Employee</th>
        <th>Brand / outlet</th>
        <th class="num">Days</th>
        <th class="num">Gross</th>
        <th class="num">Net</th>
        <th>Payment</th>
        <th>Bank</th>
        <th></th>
      </tr>`;
    }

    const tbody = $("payrollBody");
    let html = "";

    emps.forEach((emp) => {
      const row = getRow(emp.id);
      const calc = calculate(emp, row);
      const isPreview = !row.saved || row.dirty;
      const isLocked = (row.payment === "paid" && row.saved && !row.dirty) || state.periodLocked;
      const expanded = state.expandedRows.has(emp.id);
      const rowCls = [
        row.dirty ? "row-dirty" : "",
        isLocked && mode === "work" ? "row-locked" : "",
      ].filter(Boolean).join(" ");

      if (mode === "work") {
        html += `<tr class="${rowCls}" data-emp="${emp.id}">
          ${renderEmpStickyCell(emp, row, expanded, true)}
          ${renderBrandLocCell(emp)}
          <td class="num">${workInputCell("days", emp.id, row, isLocked)}</td>
          <td class="num deductions-cell">${renderDeductionsEditor(emp.id, row, isLocked)}</td>
          <td class="num ${isPreview ? "cell-preview" : "cell-calc"}">${formatINR(calc.gross)}</td>
          <td class="num ${isPreview ? "cell-preview" : "cell-calc"}"><strong>${formatINR(calc.net)}</strong></td>
          <td>
            ${isLocked ? saveIndicator(row) :
              row.dirty || !row.saved
                ? `<button type="button" class="btn-link-save save-row" data-emp="${emp.id}">Save row</button>`
                : saveIndicator(row)}
          </td>
        </tr>`;
      } else {
        html += `<tr data-emp="${emp.id}">
          ${renderEmpStickyCell(emp, row, expanded, false)}
          ${renderBrandLocCell(emp)}
          <td class="num">${row.days}</td>
          <td class="num">${formatINR(calc.gross)}</td>
          <td class="num"><strong>${formatINR(calc.net)}</strong></td>
          <td class="payment-cell">${state.periodLocked ? paymentChip(row.payment) : renderPaySeg(emp.id, row.payment, row)}</td>
          <td class="bank-cell"><span class="bank-mask">${emp.bank || "Bank"}</span><span class="bank-digits">${emp.account}</span></td>
          <td class="slip-cell"><button type="button" class="btn ghost small slip-btn" data-emp="${emp.id}" aria-label="View salary slip"><i data-lucide="file-text"></i><span class="slip-label">Salary slip</span></button></td>
        </tr>`;
      }

      if (expanded) {
        const colSpan = mode === "work" ? 7 : 8;
        const dedFields = mode === "work" && !isLocked && !state.periodLocked ? `
          <div class="deductions-editor" style="margin-top:12px;display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
            <label style="font-size:12px">Outlet advance ${workInputCell("outletAdv", emp.id, row, false)}</label>
            <label style="font-size:12px">Company advance ${workInputCell("companyAdv", emp.id, row, false)}</label>
            <label style="font-size:12px">Other ded ${workInputCell("otherDed", emp.id, row, false)}</label>
          </div>` : "";
        const extra = mode === "work" && !isLocked && !state.periodLocked ? `
          ${dedFields}
          <div class="breakdown-extra" style="margin-top:12px;display:flex;gap:16px;flex-wrap:wrap;align-items:center">
            <label style="font-size:12px;display:flex;align-items:center;gap:6px">ESI <button type="button" class="toggle-switch ${row.rowEsi ? "on" : ""}" data-toggle-stat="rowEsi" data-emp="${emp.id}"></button></label>
            <label style="font-size:12px;display:flex;align-items:center;gap:6px">PF <button type="button" class="toggle-switch ${row.rowPf ? "on" : ""}" data-toggle-stat="rowPf" data-emp="${emp.id}"></button></label>
            <label style="font-size:12px;flex:1;min-width:200px">Notes ${workInputCell("notes", emp.id, row, false)}</label>
          </div>` : "";
        const breakdownCls = [
          "breakdown-row",
          row.payment === "paid" ? "breakdown-row--paid" : "",
          isPreview ? "breakdown-row--preview" : "",
        ].filter(Boolean).join(" ");
        html += `<tr class="${breakdownCls}"><td colspan="${colSpan}">
          ${renderBreakdown(emp, row, calc, isPreview, mode)}
          ${extra}
        </td></tr>`;
      }
    });

    tbody.innerHTML = html;
    renderPayrollCards(emps, mode);
    bindPayrollEvents();
    updateSaveAllState();
    refreshIcons();
  }

  function renderPayrollCards(emps, mode) {
    const container = $("payrollCards");
    if (!container) return;

    container.innerHTML = emps.map((emp) => {
      const row = getRow(emp.id);
      const calc = calculate(emp, row);
      const isPreview = !row.saved || row.dirty;
      const isLocked = (row.payment === "paid" && row.saved && !row.dirty) || state.periodLocked;
      const expanded = state.expandedRows.has(emp.id);

      if (mode === "review") {
        return `<article class="payroll-card ${row.dirty ? "row-dirty" : ""}" data-emp="${emp.id}">
          <div class="payroll-card-head">
            <div class="emp-name-cell">${renderEmployeeAvatar(emp)}<span class="emp-name-stack"><strong>${emp.name}</strong><span class="emp-code-inline">${emp.code} · ${emp.location}</span></span></div>
            ${state.periodLocked ? paymentChip(row.payment) : renderPaySeg(emp.id, row.payment, row)}
          </div>
          <div class="payroll-card-totals">
            <span>${row.days} days</span>
            <span>Gross ${formatINR(calc.gross)}</span>
            <span><strong>Net ${formatINR(calc.net)}</strong></span>
          </div>
          <div class="payroll-card-foot">
            <button type="button" class="btn ghost small" data-expand="${emp.id}">${expanded ? "Hide" : "Details"}</button>
            <button type="button" class="btn secondary small slip-btn" data-emp="${emp.id}">Slip</button>
          </div>
          ${expanded ? `<div style="margin-top:12px">${renderBreakdown(emp, row, calc, isPreview, mode)}</div>` : ""}
        </article>`;
      }

      return `<article class="payroll-card ${row.dirty ? "row-dirty" : ""} ${isLocked ? "row-locked" : ""}" data-emp="${emp.id}">
        <div class="payroll-card-head">
          <div class="emp-name-cell">${renderEmployeeAvatar(emp)}<span class="emp-name-stack"><strong>${emp.name}</strong><span class="emp-code-inline">${emp.code} · ${emp.location}</span></span></div>
          ${saveIndicator(row)}
        </div>
        <div class="payroll-card-fields">
          <div><label>Days</label>${isLocked ? `<input value="${row.days}" disabled />` : `<input type="number" data-field="days" data-emp="${emp.id}" value="${row.days}" step="0.5" min="0" />`}</div>
          <div><label>Outlet advance</label>${isLocked ? `<input value="${row.outletAdv}" disabled />` : `<input type="number" data-field="outletAdv" data-emp="${emp.id}" value="${row.outletAdv || 0}" min="0" />`}</div>
          <div><label>Company advance</label>${isLocked ? `<input value="${row.companyAdv}" disabled />` : `<input type="number" data-field="companyAdv" data-emp="${emp.id}" value="${row.companyAdv || 0}" min="0" />`}</div>
          <div><label>Other ded</label>${isLocked ? `<input value="${row.otherDed}" disabled />` : `<input type="number" data-field="otherDed" data-emp="${emp.id}" value="${row.otherDed || 0}" min="0" />`}</div>
        </div>
        <div class="payroll-card-toggles">
          <span>ESI <button type="button" class="toggle-switch ${row.rowEsi ? "on" : ""}" data-toggle-stat="rowEsi" data-emp="${emp.id}" ${isLocked ? "disabled" : ""}></button></span>
          <span>PF <button type="button" class="toggle-switch ${row.rowPf ? "on" : ""}" data-toggle-stat="rowPf" data-emp="${emp.id}" ${isLocked ? "disabled" : ""}></button></span>
        </div>
        <div class="payroll-card-totals">
          <span>Gross ${formatINR(calc.gross)}</span>
          <span><strong>Net ${formatINR(calc.net)}</strong></span>
        </div>
        <div class="payroll-card-foot">
          <button type="button" class="btn ghost small" data-expand="${emp.id}">${expanded ? "Hide calc" : "Calculation"}</button>
          ${!isLocked && (row.dirty || !row.saved) ? `<button type="button" class="btn primary small save-row" data-emp="${emp.id}">Save</button>` : ""}
        </div>
        ${expanded ? `<div style="margin-top:12px">${renderBreakdown(emp, row, calc, isPreview, mode)}</div>` : ""}
      </article>`;
    }).join("");
  }

  function bindPayrollEvents() {
    const roots = [$("payrollBody"), $("payrollCards")].filter(Boolean);

    roots.forEach((root) => {
      root.querySelectorAll(".cell-input, .payroll-card-fields input[data-field]").forEach((input) => {
        input.addEventListener("change", onPayrollInput);
        input.addEventListener("input", onPayrollInput);
      });
      root.querySelectorAll(".save-row").forEach((btn) => {
        btn.addEventListener("click", () => saveRow(Number(btn.dataset.emp)));
      });
      root.querySelectorAll("[data-expand]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = Number(btn.dataset.expand);
          if (state.expandedRows.has(id)) state.expandedRows.delete(id);
          else state.expandedRows.add(id);
          renderPayroll();
        });
      });
      root.querySelectorAll(".pay-seg button").forEach((btn) => {
        btn.addEventListener("click", () => onPaymentChange(Number(btn.dataset.emp), btn.dataset.pay));
      });
      root.querySelectorAll(".slip-btn").forEach((btn) => {
        btn.addEventListener("click", () => openDrawer(Number(btn.dataset.emp)));
      });
      root.querySelectorAll("[data-toggle-stat]").forEach((sw) => {
        sw.addEventListener("click", () => {
          if (state.periodLocked || state.payrollMode === "review") return;
          const empId = Number(sw.dataset.emp);
          const row = getRow(empId);
          if (row.payment === "paid" && row.saved && !row.dirty) return;
          const field = sw.dataset.toggleStat;
          row[field] = !row[field];
          row.dirty = true;
          row.saved = false;
          renderPayroll();
          updateSaveAllState();
        });
      });
    });
  }

  function onPaymentChange(empId, pay) {
    const row = getRow(empId);
    if (!row.saved || row.dirty) {
      toast("Save payroll row before setting payment status");
      return;
    }
    if (pay === "paid" && row.payment !== "paid") {
      openPaidDialog(empId);
      return;
    }
    row.payment = pay;
    renderPayroll();
    renderDashboard();
    toast("Payment status updated");
  }

  function openPaidDialog(empId) {
    const emp = state.employees.find((e) => e.id === empId);
    state.pendingPaidEmpId = empId;
    $("paidDialogEmp").innerHTML = `<strong>${emp.name}</strong> · Net ${formatINR(calculate(emp, getRow(empId)).net)}`;
    $("paidDate").value = new Date().toISOString().slice(0, 10);
    $("paidDialog").showModal();
  }

  function confirmPaid() {
    const empId = state.pendingPaidEmpId;
    if (!empId) return;
    const row = getRow(empId);
    row.payment = "paid";
    state.paidRecords[empId] = {
      method: $("paidMethod").value,
      date: $("paidDate").value,
      actor: "AK",
    };
    state.pendingPaidEmpId = null;
    $("paidDialog").close();
    renderPayroll();
    renderDashboard();
    toast("Payment recorded");
  }

  function renderPaySeg(empId, current, row) {
    if (!row || !row.saved || row.dirty) {
      return `<span class="save-required"><i data-lucide="circle-dashed"></i> Save required</span>`;
    }
    const opts = [
      { key: "paid", label: "Paid", cls: "active-paid" },
      { key: "not_paid", label: "Not paid", cls: "active-pending" },
      { key: "hold", label: "Hold", cls: "active-hold" },
    ];
    return `<span class="pay-seg" role="group" aria-label="Payment status">${opts.map((o) =>
      `<button type="button" data-emp="${empId}" data-pay="${o.key}" class="${current === o.key ? o.cls : ""}" aria-pressed="${current === o.key}">${o.label}</button>`
    ).join("")}</span>`;
  }

  function onPayrollInput(ev) {
    const input = ev.target;
    const empId = Number(input.dataset.emp);
    const field = input.dataset.field;
    const row = getRow(empId);
    if (state.periodLocked || state.payrollMode === "review") return;
    if (row.payment === "paid" && row.saved && !row.dirty) return;
    if (field === "notes") {
      row.notes = input.value;
    } else {
      row[field] = parseFloat(input.value) || 0;
    }
    row.dirty = true;
    row.saved = false;
    renderPayroll();
    updateSaveAllState();
  }

  function saveRow(empId) {
    const row = getRow(empId);
    row.saved = true;
    row.dirty = false;
    const tr = document.querySelector(`tr[data-emp="${empId}"]`);
    if (tr) {
      tr.classList.add("row-flash");
      setTimeout(() => tr.classList.remove("row-flash"), 300);
    }
    toast("Row saved");
    renderPayroll();
    renderDashboard();
  }

  function saveAllRows() {
    const dirtyEmps = getActiveEmployees().filter((emp) => {
      const row = getRow(emp.id);
      return row.dirty || !row.saved;
    });
    if (dirtyEmps.length === 0) return;

    const list = $("saveProgressList");
    const status = $("saveProgressStatus");
    const closeBtn = $("closeSaveProgressBtn");
    list.innerHTML = dirtyEmps.map((emp) =>
      `<li data-emp="${emp.id}"><span>${emp.name}</span><span class="save-state">Pending…</span></li>`
    ).join("");
    status.textContent = `Saving ${dirtyEmps.length} row(s)…`;
    closeBtn.disabled = true;
    $("saveProgressDialog").showModal();

    let i = 0;
    const tick = () => {
      if (i >= dirtyEmps.length) {
        status.textContent = "All rows saved.";
        closeBtn.disabled = false;
        renderPayroll();
        renderDashboard();
        return;
      }
      const emp = dirtyEmps[i];
      const row = getRow(emp.id);
      row.saved = true;
      row.dirty = false;
      const li = list.querySelector(`li[data-emp="${emp.id}"]`);
      if (li) {
        li.querySelector(".save-state").textContent = "Saved";
      }
      i += 1;
      setTimeout(tick, 120);
    };
    setTimeout(tick, 200);
  }

  function openLockDialog() {
    $("lockDialogPeriod").innerHTML = `<strong>${periodLabel()}</strong> will be locked.`;
    $("lockDialog").showModal();
  }

  function confirmLockPeriod() {
    state.periodLocked = true;
    $("lockDialog").close();
    toast(`${periodLabel()} locked`);
    renderDashboard();
    renderPayroll();
  }

  function updateSaveAllState() {
    const dirty = dirtyCount();
    const saved = savedCount();
    const total = getActiveEmployees().length;
    $("saveProgress").textContent = `${saved}/${total} saved · ${dirty} unsaved`;
    $("saveAllBtn").disabled = dirty === 0 || state.periodLocked;
    $("saveAllBtn").textContent = dirty > 0 ? `Save all changes (${dirty})` : "Save all changes";
  }

  function employeeInitials(name) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  function employeeAvatarColor(id) {
    const palette = ["#0d9488", "#0369a1", "#b45309", "#6d28d9", "#047857"];
    return palette[id % palette.length];
  }

  function renderEmployeeAvatar(emp) {
    const left = emp.status === "left";
    const cls = `emp-avatar${left ? " is-left" : ""}`;
    if (emp.photoUrl) {
      return `<img class="${cls} emp-avatar--photo" src="${emp.photoUrl}" alt="" loading="lazy" width="32" height="32" />`;
    }
    return `<span class="${cls}" style="background:${employeeAvatarColor(emp.id)}" aria-hidden="true">${employeeInitials(emp.name)}</span>`;
  }

  function renderEmployeeNameCell(emp) {
    return `<div class="emp-name-cell">
      ${renderEmployeeAvatar(emp)}
      <span class="emp-name-stack">
        <strong>${emp.name}</strong>
        <span class="emp-code-inline">${emp.code}</span>
      </span>
    </div>`;
  }

  function renderEmployees() {
    const view = state.peopleView;
    $("addEmployeeBtn")?.classList.toggle("hidden", view !== "directory");
    const search = ($("employeeSearch")?.value || "").toLowerCase();
    let list = state.employees.filter((e) =>
      e.name.toLowerCase().includes(search) || e.code.toLowerCase().includes(search)
    );

    const thead = $("employeeThead");
    const tbody = $("employeeBody");

    if (view === "directory") {
      thead.innerHTML = `<tr>
        <th>Employee</th><th>Brand</th><th>Location</th><th>Dept</th><th>Designation</th><th>Status</th><th></th>
      </tr>`;
      tbody.innerHTML = list.map((e) => `
        <tr>
          <td>${renderEmployeeNameCell(e)}</td>
          <td>${e.brand}</td>
          <td>${e.location}</td>
          <td>${e.dept}</td>
          <td>${e.desig}</td>
          <td>${e.status === "active" ? '<span class="chip active">Active</span>' : '<span class="chip left">Left</span>'}</td>
          <td><button type="button" class="btn ghost small view-emp" data-id="${e.id}">Edit</button></td>
        </tr>
      `).join("");
    } else {
      thead.innerHTML = `<tr>
        <th>Code</th><th>Name</th><th>Brand</th><th class="num">Daily rate</th><th class="num">Full-month gross</th>
        <th>ESI</th><th>PF</th><th class="num">Full-month net</th><th></th>
      </tr>`;
      tbody.innerHTML = list.map((e) => {
        const row = getRow(e.id);
        const calc = calculate(e, row.days !== undefined ? row : { ...row, days: 30 });
        return `<tr>
          <td>${e.code}</td>
          <td><strong>${e.name}</strong></td>
          <td>${e.brand}</td>
          <td class="num">${formatINR(calc.perDay)}</td>
          <td class="num">${formatINR(calc.gross)}</td>
          <td><button type="button" class="toggle-switch ${e.esi ? "on" : ""}" data-toggle="esi" data-id="${e.id}" aria-label="ESI"></button></td>
          <td><button type="button" class="toggle-switch ${e.pf ? "on" : ""}" data-toggle="pf" data-id="${e.id}" aria-label="PF"></button></td>
          <td class="num">${formatINR(calc.net)}</td>
          <td><button type="button" class="btn ghost small print-register-btn" data-id="${e.id}" aria-label="Print pay summary for ${e.name}"><i data-lucide="printer"></i></button></td>
        </tr>`;
      }).join("");

      tbody.querySelectorAll(".toggle-switch").forEach((sw) => {
        sw.addEventListener("click", () => {
          const emp = state.employees.find((x) => x.id === Number(sw.dataset.id));
          const field = sw.dataset.toggle;
          if (field === "esi") emp.esi = !emp.esi;
          else emp.pf = !emp.pf;
          sw.classList.toggle("on");
          toast("ESI/PF setting saved for this employee");
        });
      });

      tbody.querySelectorAll(".print-register-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const emp = state.employees.find((x) => x.id === Number(btn.dataset.id));
          if (!emp) return;
          toast(`Print preview for ${emp.name} (prototype)`);
        });
      });
    }

    tbody.querySelectorAll(".view-emp").forEach((btn) => {
      btn.addEventListener("click", () => openEmployeeDetail(Number(btn.dataset.id)));
    });
    refreshIcons();
  }

  function openSettingsTab(tab, options = {}) {
    state.settingsTab = tab;
    state.currentScreen = "settings";
    showScreen("settings");
    document.querySelectorAll(".settings-tab").forEach((t) => {
      const isActive = t.dataset.tab === tab;
      t.classList.toggle("active", isActive);
      t.setAttribute("aria-selected", isActive ? "true" : "false");
    });
    document.querySelectorAll(".settings-panel").forEach((p) => {
      p.classList.remove("active");
      p.hidden = true;
    });
    const panelId = tab === "org" ? "settingsOrg" : tab === "letterheads" ? "settingsLetterheads" : "settingsImport";
    const panel = $(panelId);
    panel?.classList.add("active");
    if (panel) panel.hidden = false;
    if (tab === "import") renderImportWizard();
    if (tab === "letterheads") renderLetterheads();
    updateMigrationBanner();
    if (options.focusErrors) {
      requestAnimationFrame(() => {
        $("importErrorList")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    }
  }

  function openImportWizard(options = {}) {
    state.importStep = options.step ?? (state.migrationPending ? 3 : 1);
    openSettingsTab("import", { focusErrors: options.focusErrors ?? false });
  }

  function confirmImport() {
    state.migrationPending = false;
    state.importStep = 4;
    $("migrationBanner")?.classList.add("hidden");
    toast(`Import confirmed · ${IMPORT_DEMO_STATS.employeeCount} employees active`);
    renderDashboard();
    renderImportWizard();
    renderImportBlockers();
    updateMigrationBanner();
  }

  function renderImportWizard() {
    const panel = $("importWizardPanel");
    if (!panel) return;

    const step = state.importStep;
    const blocking = importBlockerCount();
    const warnings = importWarningCount();
    const progressHtml = IMPORT_STEPS.map((_, i) => {
      const idx = i + 1;
      let cls = "import-progress-seg";
      if (idx < step) cls += " done";
      else if (idx === step) cls += " current";
      return `<div class="${cls}" aria-hidden="true"></div>`;
    }).join("");

    const stepsHtml = IMPORT_STEPS.map((label, i) => {
      const idx = i + 1;
      let cls = "";
      if (idx < step) cls = "done";
      else if (idx === step) cls = "current";
      return `<span class="${cls}">${label}</span>`;
    }).join("");

    let bodyHtml = "";
    let actionsHtml = "";

    if (step === 1) {
      bodyHtml = `<p class="text-meta">Download the employee template, fill it in Excel or Google Sheets, then upload it in the next step.</p>
        ${importSummaryHtml()}`;
      actionsHtml = `<button type="button" class="btn secondary" id="importDownloadBtn">Download template</button>
        <button type="button" class="btn primary" id="importNextBtn">Continue to upload</button>`;
    } else if (step === 2) {
      bodyHtml = `<p class="text-meta">Upload your completed CSV. We check every row before you confirm.</p>
        <div class="import-file-chip">
          <i data-lucide="file-spreadsheet"></i>
          <div>
            <strong>${IMPORT_DEMO_STATS.fileName}</strong>
            <span>${IMPORT_DEMO_STATS.rowCount} rows · demo file ready</span>
          </div>
        </div>
        <div class="import-upload-zone text-meta">
          Drop CSV here or <button type="button" class="btn-link-save" id="importUploadBtn">choose file</button>
        </div>`;
      actionsHtml = `<button type="button" class="btn ghost" id="importBackBtn">Back</button>
        <button type="button" class="btn primary" id="importValidateBtn">Upload and check</button>`;
    } else if (step === 3) {
      const blockingRows = state.importErrors.filter((e) => e.severity === "blocking");
      const warningRows = state.importErrors.filter((e) => e.severity === "warning");
      bodyHtml = `
        ${importSummaryHtml()}
        <div id="importErrorList" style="margin-top:16px">
          ${blockingRows.length ? `<div class="import-error-group">
            <h4>Blocking (${blockingRows.filter((e) => !e.fixed).length} open)</h4>
            ${blockingRows.map(renderImportErrorRow).join("")}
          </div>` : ""}
          ${warningRows.length ? `<div class="import-error-group">
            <h4>Warnings (${warningRows.filter((e) => !e.fixed).length} open)</h4>
            ${warningRows.map(renderImportErrorRow).join("")}
          </div>` : ""}
        </div>`;
      actionsHtml = `
        <button type="button" class="btn ghost" id="importErrorReportBtn">Download error report</button>
        ${unfixedImportErrors().length ? `<button type="button" class="btn secondary" id="importFixAllBtn">Apply all demo fixes</button>` : ""}
        ${blocking
          ? `<button type="button" class="btn primary" disabled title="Fix ${blocking} blocking issue(s) first">Fix issues first</button>`
          : `<button type="button" class="btn primary" id="importContinueBtn">Continue to confirm</button>`}`;
    } else {
      bodyHtml = state.migrationPending ? `
        ${importSummaryHtml()}
        <div class="import-confirm-block">
          <p class="text-meta" style="margin:12px 0">No blocking issues remain. Totals are within ₹${IMPORT_DEMO_STATS.spreadsheetDelta.toFixed(2)} of your spreadsheet.</p>
          <div class="import-summary-row"><span>Employees to import</span><strong>${IMPORT_DEMO_STATS.employeeCount}</strong></div>
          <div class="import-summary-row"><span>Brands</span><strong>${IMPORT_DEMO_STATS.brandCount}</strong></div>
          <div class="import-summary-row"><span>Monthly gross total</span><strong>${formatINR(IMPORT_DEMO_STATS.monthlyGross)}</strong></div>
          <label class="checkbox-row" style="margin-top:14px">
            <input type="checkbox" id="importConfirmCheck" />
            <span>I confirm employee and payroll totals match our records.</span>
          </label>
        </div>` : `<p class="text-meta">Import for ${periodLabel()} is complete. ${IMPORT_DEMO_STATS.employeeCount} employees are active in the system.</p>`;
      actionsHtml = state.migrationPending
        ? `<button type="button" class="btn ghost" id="importBackToErrorsBtn">Back to errors</button>
           <button type="button" class="btn primary" id="importConfirmBtn" disabled>Confirm import is correct</button>`
        : `<button type="button" class="btn secondary" id="importRestartBtn">Start new import</button>`;
    }

    panel.innerHTML = `
      <div class="import-wizard">
        <div class="import-wizard-head">
          <p class="import-wizard-step-label">Step ${step} of 4</p>
          <h3>Import employee data</h3>
          <p class="text-meta">${step === 3
            ? (blocking ? `${blocking} blocking issue(s) left before month close.` : "All blocking issues fixed. You can confirm the import.")
            : step === 4 && state.migrationPending
              ? "Last step before month close is unblocked."
              : "Bring employee records into Birbal Payroll."}</p>
        </div>
        <div class="import-progress" aria-hidden="true">${progressHtml}</div>
        <div class="import-step-list">${stepsHtml}</div>
        ${bodyHtml}
        <div class="import-wizard-actions">${actionsHtml}</div>
      </div>`;

    $("importDownloadBtn")?.addEventListener("click", () => toast("birbal-employee-template.csv downloaded"));
    $("importNextBtn")?.addEventListener("click", () => { state.importStep = 2; renderImportWizard(); });
    $("importBackBtn")?.addEventListener("click", () => { state.importStep = 1; renderImportWizard(); });
    $("importUploadBtn")?.addEventListener("click", () => {
      state.importFileUploaded = true;
      toast(`${IMPORT_DEMO_STATS.fileName} selected`);
    });
    $("importValidateBtn")?.addEventListener("click", () => {
      state.importStep = 3;
      toast(`Checked ${IMPORT_DEMO_STATS.rowCount} rows · ${importBlockerCount()} blocking · ${importWarningCount()} warning`);
      renderImportWizard();
    });
    $("importErrorReportBtn")?.addEventListener("click", () => toast("import-errors-march-2026.csv downloaded"));
    $("importFixAllBtn")?.addEventListener("click", applyAllImportFixes);
    panel.querySelectorAll(".import-fix-btn").forEach((btn) => {
      btn.addEventListener("click", () => applyImportFix(btn.dataset.fixId));
    });
    $("importContinueBtn")?.addEventListener("click", () => { state.importStep = 4; renderImportWizard(); });
    $("importBackToErrorsBtn")?.addEventListener("click", () => { state.importStep = 3; renderImportWizard(); });
    $("importConfirmCheck")?.addEventListener("change", (e) => {
      const btn = $("importConfirmBtn");
      if (btn) btn.disabled = !e.target.checked;
    });
    $("importConfirmBtn")?.addEventListener("click", confirmImport);
    $("importRestartBtn")?.addEventListener("click", () => {
      initImportDemo();
      state.migrationPending = true;
      state.importStep = 1;
      $("migrationBanner")?.classList.remove("hidden");
      renderImportWizard();
      renderDashboard();
      updateMigrationBanner();
    });
    refreshIcons();
  }

  function renderEmployeeSectionContent(emp, section) {
    const perDay = effectivePerDay(emp);
    const monthly = monthlyPackage(emp);
    switch (section) {
      case "basic":
        return `<h3>Basic</h3>
        <div class="form-grid">
          <div class="form-field"><label>Employee code</label><input value="${emp.code}" readonly /></div>
          <div class="form-field"><label>Full name</label><input value="${emp.name}" /></div>
          <div class="form-field"><label>Phone</label><input value="${emp.phone}" /></div>
          <div class="form-field"><label>Status</label><select><option ${emp.status === "active" ? "selected" : ""}>Active</option><option ${emp.status === "left" ? "selected" : ""}>Left</option></select></div>
        </div>`;
      case "work":
        return `<h3>Job details</h3>
        <div class="form-grid">
          <div class="form-field"><label>Brand</label><select>${BRANDS.map((b) => `<option ${b === emp.brand ? "selected" : ""}>${b}</option>`).join("")}</select></div>
          <div class="form-field"><label>Location</label><input value="${emp.location}" /></div>
          <div class="form-field"><label>Department</label><input value="${emp.dept}" /></div>
          <div class="form-field"><label>Designation</label><input value="${emp.desig}" /></div>
        </div>`;
      case "salary":
        return `<h3>Salary</h3>
        <div class="form-grid">
          <div class="form-field"><label>Basic</label><input type="number" value="${emp.basic}" /></div>
          <div class="form-field"><label>HRA (house rent allowance)</label><input type="number" value="${emp.hra}" /></div>
          <div class="form-field"><label>Other allowance</label><input type="number" value="${emp.other}" /></div>
          <div class="form-field"><label>Standard bonus</label><input type="number" value="${emp.bonus}" /></div>
        </div>
        <div class="salary-total-row"><span>Total monthly package</span><span>${formatINR(monthly)}/mo</span></div>
        <div class="preview-callout">Estimated daily rate: <strong>${formatINR(perDay)}</strong>. Save this employee to confirm.</div>`;
      case "statutory":
        return `<h3>ESI &amp; PF</h3>
        <div class="form-grid">
          <div class="form-field"><label>PAN</label><input value="${emp.pan.replace(/(.{5}).*(.{1})/, "$1****$2")}" /></div>
          <div class="form-field"><label>ESI applicable</label><select><option ${emp.esi ? "selected" : ""}>Yes</option><option ${!emp.esi ? "selected" : ""}>No</option></select></div>
          <div class="form-field"><label>PF applicable</label><select><option ${emp.pf ? "selected" : ""}>Yes</option><option ${!emp.pf ? "selected" : ""}>No</option></select></div>
          <div class="form-field"><label>PF UAN</label><input value="${emp.uan || ""}" placeholder="12-digit UAN" /></div>
        </div>`;
      case "bank":
        return `<h3>Bank</h3>
        <div class="form-grid">
          <div class="form-field"><label>Bank</label><input value="${emp.bank}" /></div>
          <div class="form-field"><label>Account</label><input value="${emp.account}" /></div>
        </div>`;
      default:
        return "";
    }
  }

  function setEmployeeDetailSection(section) {
    state.employeeDetailSection = section;
    const emp = state.employees.find((e) => e.id === state.employeeDetailId);
    if (!emp) return;
    document.querySelectorAll(".section-tab").forEach((t) => {
      t.classList.toggle("active", t.dataset.section === section);
    });
    $("detailForm").innerHTML = `<div class="detail-form-panel">${renderEmployeeSectionContent(emp, section)}</div>`;
  }

  function openLetterheadSlipPreview(brand) {
    const emp = state.employees.find((e) => e.brand === brand && e.status === "active");
    if (!emp) {
      toast(`No active employee found for ${brand}`);
      return;
    }
    const slipRow = { ...getRow(emp.id), days: 30, saved: true, dirty: false };
    const calc = calculate(emp, slipRow);
    $("drawerTitle").textContent = "Salary slip preview";
    $("drawerMeta").textContent = `${brand} letterhead · sample: ${emp.name}`;
    $("pdfMock").innerHTML = renderSalarySlipHtml(emp, slipRow, calc);
    $("drawerBackdrop").classList.remove("hidden");
    $("docDrawer").classList.remove("hidden");
    refreshIcons();
  }

  function renderLetterheads() {
    const list = $("letterheadList");
    if (!list) return;
    list.innerHTML = BRANDS.map((brand) => {
      const meta = state.letterheads[brand] || LETTERHEAD_META[brand];
      const thumbClass = meta.hasFile ? "letterhead-thumb has-image" : "letterhead-thumb";
      const thumbInner = meta.hasFile
        ? `<span>${brand.split(" ")[0]}</span>`
        : `<span>No file</span>`;
      const statusLine = meta.hasFile
        ? `Uploaded ${meta.uploaded} · ${meta.size}`
        : "No letterhead yet. Slips use a plain header.";
      return `<article class="letterhead-row">
        <div class="${thumbClass}">${thumbInner}</div>
        <div class="letterhead-info">
          <h4>${brand}</h4>
          <p class="text-meta">${statusLine}</p>
          <p class="letterhead-uses">Used on: Salary slip, Joining letter</p>
        </div>
        <div class="letterhead-actions">
          ${meta.hasFile ? `<button type="button" class="btn secondary small letterhead-preview-btn" data-brand="${brand}">Preview on slip</button>` : ""}
          <button type="button" class="btn ghost small letterhead-replace-btn" data-brand="${brand}">${meta.hasFile ? "Replace" : "Upload"}</button>
        </div>
      </article>`;
    }).join("");

    list.querySelectorAll(".letterhead-preview-btn").forEach((btn) => {
      btn.addEventListener("click", () => openLetterheadSlipPreview(btn.dataset.brand));
    });
    list.querySelectorAll(".letterhead-replace-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const brand = btn.dataset.brand;
        state.letterheads[brand] = {
          uploaded: "18 Mar 2026",
          size: "192 KB",
          hasFile: true,
        };
        toast(`Letterhead uploaded for ${brand} (demo)`);
        renderLetterheads();
      });
    });
    refreshIcons();
  }

  function openEmployeeDetail(id) {
    const emp = state.employees.find((e) => e.id === id);
    if (!emp) return;
    state.employeeDetailId = id;
    state.employeeDetailSection = "basic";
    $("detailCode").textContent = emp.code;
    $("detailName").textContent = emp.name;
    $("detailStatus").textContent = emp.status === "active" ? "Active" : "Left";
    $("detailStatus").className = "chip " + (emp.status === "active" ? "active" : "left");
    $("detailAvatarWrap").innerHTML = renderEmployeeAvatar(emp);

    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    $("screen-employee-detail").classList.add("active");
    state.currentScreen = "employee-detail";
    setEmployeeDetailSection("basic");
    updateTopbar();
    refreshIcons();
  }

  function openDrawer(empId) {
    const emp = state.employees.find((e) => e.id === empId);
    const row = getRow(empId);
    const calc = calculate(emp, row);
    $("drawerTitle").textContent = "Salary slip";
    $("drawerMeta").textContent = `${emp.name} · ${MONTHS[state.period.month]} ${state.period.year}`;
    $("pdfMock").innerHTML = renderSalarySlipHtml(emp, row, calc);
    $("drawerBackdrop").classList.remove("hidden");
    $("docDrawer").classList.remove("hidden");
    refreshIcons();
  }

  function closeDrawer() {
    $("drawerBackdrop").classList.add("hidden");
    $("docDrawer").classList.add("hidden");
  }

  function renderSettings() {
    const brandsHtml = lookupListItems(BRANDS);
    const locationsHtml = Object.entries(LOCATIONS).map(([brand, locs]) => `
      <div class="lookup-brand-group">
        <strong>${brand}</strong>
        <ul>${locs.map((l) => `<li>${l}</li>`).join("")}</ul>
      </div>
    `).join("");

    const lookupCards = [
      lookupCard("Brands", brandsHtml, "brand"),
      lookupCard("Locations", locationsHtml, "location"),
      ...Object.entries(LOOKUPS).map(([key, items]) =>
        lookupCard(LOOKUP_LABELS[key] || key, lookupListItems(items), key)
      ),
    ].join("");

    $("lookupGrid").innerHTML = lookupCards;

    $("lookupGrid").querySelectorAll(".lookup-add-btn").forEach((btn) => {
      btn.addEventListener("click", () => toast(`Add ${btn.dataset.add} (prototype)`));
    });

    renderLetterheads();
    renderImportWizard();
  }

  function bindEvents() {
    document.querySelectorAll(".nav-item, .bottom-nav-item").forEach((btn) => {
      btn.addEventListener("click", () => navigate(btn.dataset.screen));
    });

    document.querySelectorAll("[data-nav]").forEach((btn) => {
      btn.addEventListener("click", () => navigate(btn.dataset.nav));
    });

    document.querySelectorAll(".mode-btn").forEach((btn) => {
      btn.addEventListener("click", () => setPayrollMode(btn.dataset.mode));
    });

    $("periodMonth").addEventListener("change", (e) => {
      if (tryPeriodChange()) state.period.month = Number(e.target.value);
      else e.target.value = state.period.month;
      renderAll();
    });
    $("periodYear").addEventListener("change", (e) => {
      if (tryPeriodChange()) state.period.year = Number(e.target.value);
      else e.target.value = state.period.year;
      renderAll();
    });
    $("periodBrand").addEventListener("change", (e) => {
      state.filters.brand = e.target.value;
      state.filters.location = "";
      renderPeriodSelectors();
      renderAll();
    });
    $("periodLocation").addEventListener("change", (e) => {
      state.filters.location = e.target.value;
      renderAll();
    });
    $("resetFiltersBtn").addEventListener("click", () => {
      state.filters = { brand: "", location: "" };
      renderPeriodSelectors();
      renderAll();
    });

    $("viewAllExceptionsBtn")?.addEventListener("click", () => {
      state.showAllExceptions = !state.showAllExceptions;
      renderDashboard();
    });
    $("exportDashBtn").addEventListener("click", () => {
      state.reconciliation.exported = true;
      toast("March payroll summary downloaded");
      renderDashboard();
    });
    $("exportReviewBtn").addEventListener("click", () => toast("Payment report downloaded"));
    $("lockPeriodBtn").addEventListener("click", openLockDialog);
    $("cancelLockBtn").addEventListener("click", () => $("lockDialog").close());
    $("confirmLockBtn").addEventListener("click", confirmLockPeriod);
    $("closeSaveProgressBtn").addEventListener("click", () => $("saveProgressDialog").close());
    $("saveAllBtn").addEventListener("click", saveAllRows);

    $("payrollSearch").addEventListener("input", () => renderPayroll());
    $("employeeSearch")?.addEventListener("input", () => renderEmployees());

    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.peopleView = btn.dataset.view;
        document.querySelectorAll(".view-btn").forEach((b) => b.classList.toggle("active", b === btn));
        renderEmployees();
        updateTopbar();
      });
    });

    $("topbarPeriodChip")?.addEventListener("click", () => navigate("dashboard"));
    $("helpBtn")?.addEventListener("click", () => toast("Month close guide opens here (prototype)"));
    $("userMenuBtn")?.addEventListener("click", () => toast("Account menu (prototype)"));

    $("backToEmployees").addEventListener("click", () => navigate("people"));
    $("saveEmployeeBtn").addEventListener("click", () => { toast("Employee saved"); navigate("people"); });

    $("closeDrawer").addEventListener("click", closeDrawer);
    $("drawerBackdrop").addEventListener("click", closeDrawer);

    $("cancelPaidBtn").addEventListener("click", () => {
      state.pendingPaidEmpId = null;
      $("paidDialog").close();
    });
    $("confirmPaidBtn").addEventListener("click", confirmPaid);

    document.querySelectorAll("[data-dirty]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.dataset.dirty;
        $("dirtyDialog").close();
        if (action === "stay") return;
        if (action === "discard") {
          initPayrollRows();
          if (state.pendingNav) {
            const nav = state.pendingNav;
            state.pendingNav = null;
            showScreen(nav.startsWith("payroll") ? "payroll" : nav);
            if (nav.startsWith("payroll")) setPayrollMode(nav === "payroll-review" ? "review" : "work");
            renderAll();
          }
        }
        if (action === "save") {
          saveAllRows();
          if (state.pendingNav) {
            const nav = state.pendingNav;
            state.pendingNav = null;
            navigate(nav);
          }
        }
      });
    });

    $("dismissBannerBtn").addEventListener("click", () => {
      state.bannerCompact = true;
      updateMigrationBanner();
    });
    $("reviewImportBtn").addEventListener("click", () => openImportWizard({ step: 3, focusErrors: true }));
    $("closeOnbBtn").addEventListener("click", () => $("onbDialog").close());
    $("reconSignoff").addEventListener("change", (e) => {
      $("completeOnbBtn").disabled = !e.target.checked;
    });
    $("completeOnbBtn").addEventListener("click", confirmImport);

    document.querySelectorAll(".section-tab").forEach((tab) => {
      tab.addEventListener("click", () => setEmployeeDetailSection(tab.dataset.section));
    });

    document.querySelectorAll(".settings-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        openSettingsTab(tab.dataset.tab);
      });
    });
  }

  function tryPeriodChange() {
    if (dirtyCount() > 0) {
      state.pendingNav = null;
      $("dirtyDialogMsg").textContent = `You have ${dirtyCount()} unsaved payroll row(s). Save before changing period?`;
      $("dirtyDialog").showModal();
      return false;
    }
    return true;
  }

  function renderAll() {
    renderPeriodSelectors();
    renderPeriodStrip();
    renderDashboard();
    renderPayroll();
    renderEmployees();
    renderSettings();
    refreshIcons();
  }

  function init() {
    initEmployees();
    initImportDemo();
    bindEvents();
    if (state.migrationPending) $("migrationBanner").classList.remove("hidden");
    updateMigrationBanner();
    renderAll();
    navigate("dashboard");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
