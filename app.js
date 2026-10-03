/* ============================================================
   C&SB PROTOTYPE
   Loss Recovery Without New Deposits
   ============================================================ */

/* ============================================================
   STATE
============================================================ */

const INITIAL_STATE = {
  primaryAccount: {
    id: "CSB-ACC-001",
    size: 1000000,
    balance: 1000000,
    status: "Active",
    manager: "Manager A"
  },

  accounts: [
    {
      id: "CSB-ACC-001",
      size: 1000000,
      source: "Original Account",
      role: "Managed account",
      manager: "Manager A",
      status: "Active"
    },

    {
      id: "CSB-ACC-002",
      size: 1000000,
      source: "Participant Account",
      role: "Own account",
      manager: "Manager B",
      status: "Active"
    },

    {
      id: "CSB-CAP-001",
      size: 1000000,
      source: "C&SB Account 1",
      role: "Assigned to sub-manager",
      manager: "Sub-manager 1",
      status: "Active"
    },

    {
      id: "CSB-CAP-002",
      size: 1000000,
      source: "C&SB Account 2",
      role: "Assigned to sub-manager",
      manager: "Sub-manager 2",
      status: "Active"
    },

    {
      id: "CSB-CAP-003",
      size: 1000000,
      source: "C&SB Account 3",
      role: "Assigned to sub-manager",
      manager: "Sub-manager 3",
      status: "Active"
    },

    {
      id: "CSB-CAP-004",
      size: 1000000,
      source: "C&SB Account 4",
      role: "Assigned to sub-manager",
      manager: "Sub-manager 4",
      status: "Active"
    },

    {
      id: "CSB-CAP-005",
      size: 1000000,
      source: "C&SB Account 5",
      role: "Assigned to sub-manager",
      manager: "Sub-manager 5",
      status: "Active"
    }
  ],

  sources: [
    {
      id: 1,
      name: "Managed Account",
      description: "Eligible earnings from the account this participant manages.",
      amount: 70000,
      enabled: true
    },

    {
      id: 2,
      name: "Own Account Managed by Another",
      description: "Eligible earnings generated from the participant's own account under another manager.",
      amount: 55000,
      enabled: true
    },

    {
      id: 3,
      name: "C&SB Account 1",
      description: "Eligible earnings from the first additional C&SB account assigned to a sub-manager.",
      amount: 48000,
      enabled: true
    },

    {
      id: 4,
      name: "C&SB Account 2",
      description: "Eligible earnings from the second additional C&SB account.",
      amount: 43000,
      enabled: true
    },

    {
      id: 5,
      name: "C&SB Account 3",
      description: "Eligible earnings from the third additional C&SB account.",
      amount: 39000,
      enabled: true
    },

    {
      id: 6,
      name: "C&SB Account 4",
      description: "Eligible earnings from the fourth additional C&SB account.",
      amount: 36000,
      enabled: true
    },

    {
      id: 7,
      name: "C&SB Account 5",
      description: "Eligible earnings from the fifth additional C&SB account.",
      amount: 33000,
      enabled: true
    },

    {
      id: 8,
      name: "Referral Earnings",
      description: "15% referral earnings connected to eligible referral relationships.",
      amount: 22000,
      enabled: true
    },

    {
      id: 9,
      name: "SB Facilitator Earnings",
      description: "8% SB earnings where the participant has consented to act as facilitator/provider.",
      amount: 18000,
      enabled: true
    },

    {
      id: 10,
      name: "Bonder Earnings",
      description: "0.8% Bonder earnings where the participant has consented to participate as a Bonder.",
      amount: 9000,
      enabled: true
    }
  ],

  recoveryCases: [],

  ledger: [],

  sb: {
    active: false,
    manager: null,
    portfolio: null,
    repayment: 0
  },

  simulationStep: 0
};

let state = deepClone(INITIAL_STATE);


/* ============================================================
   HELPERS
============================================================ */

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function generateId(prefix) {
  return `${prefix}-${Date.now().toString().slice(-8)}`;
}

function getTotalRecovery() {
  return state.recoveryCases.reduce(
    (total, item) => total + item.remaining,
    0
  );
}

function getTotalSources() {
  return state.sources.filter(source => source.enabled).length;
}

function showToast(message) {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}


/* ============================================================
   NAVIGATION
============================================================ */

const navItems = document.querySelectorAll(".nav-item");
const views = document.querySelectorAll(".view");
const pageTitle = document.getElementById("pageTitle");

const titles = {
  overview: "Recovery Overview",
  accounts: "Account Network",
  network: "Recovery Network",
  recovery: "Recovery Cases",
  sb: "Social Bond",
  participants: "Participants",
  ledger: "Recovery Ledger"
};

function openView(viewName) {

  views.forEach(view => {
    view.classList.remove("active");
  });

  navItems.forEach(item => {
    item.classList.remove("active");
  });

  const selectedView = document.getElementById(`view-${viewName}`);
  const selectedNav = document.querySelector(
    `.nav-item[data-view="${viewName}"]`
  );

  if (selectedView) {
    selectedView.classList.add("active");
  }

  if (selectedNav) {
    selectedNav.classList.add("active");
  }

  pageTitle.textContent = titles[viewName] || "C&SB";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  closeMobileMenu();
}

navItems.forEach(item => {

  item.addEventListener("click", () => {
    openView(item.dataset.view);
  });

});


document.querySelectorAll("[data-view-target]").forEach(button => {

  button.addEventListener("click", () => {
    openView(button.dataset.viewTarget);
  });

});


/* ============================================================
   MOBILE MENU
============================================================ */

const sidebar = document.getElementById("sidebar");
const mobileMenu = document.getElementById("mobileMenu");

mobileMenu.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

function closeMobileMenu() {
  sidebar.classList.remove("open");
}


/* ============================================================
   RENDER ACCOUNTS
============================================================ */

function renderAccounts() {

  const container = document.getElementById("accountGrid");

  container.innerHTML = state.accounts.map(account => {

    return `
      <div class="account-card">

        <div class="account-card-header">

          <div>
            <div class="account-id">${account.id}</div>
            <div class="account-size">${money(account.size)}</div>
          </div>

          <div class="account-status">
            ${account.status}
          </div>

        </div>

        <div class="account-role">
          ${account.role}
        </div>

        <div class="account-source">
          ${account.source}
        </div>

        <div class="account-source">
          Responsible participant: ${account.manager}
        </div>

      </div>
    `;

  }).join("");
}


/* ============================================================
   RENDER RECOVERY SOURCES
============================================================ */

function renderSources() {

  const container = document.getElementById("sourceGrid");

  container.innerHTML = state.sources.map(source => {

    return `
      <div class="source-card">

        <div class="source-number">
          ${source.id}
        </div>

        <div>

          <h3>
            ${source.name}
          </h3>

          <p>
            ${source.description}
          </p>

        </div>

        <div class="source-amount">
          ${source.enabled ? money(source.amount) : "$0"}
        </div>

      </div>
    `;

  }).join("");

  document.getElementById("sourceCount").textContent =
    getTotalSources();

  document.getElementById("networkSourceCount").textContent =
    getTotalSources();

}


/* ============================================================
   CREATE RECOVERY CASE
============================================================ */

function createRecoveryCase(managerName, accountId) {

  const account = state.accounts.find(
    item => item.id === accountId
  );

  const accountSize = account
    ? account.size
    : 1000000;

  const obligation = accountSize * 0.50;

  const recoveryCase = {

    id: generateId("REC"),

    manager: managerName,

    accountId,

    accountSize,

    drawdown: obligation,

    originalObligation: obligation,

    recovered: 0,

    remaining: obligation,

    status: "Active",

    sourceCount: getTotalSources(),

    createdAt: new Date().toLocaleTimeString(),

    sourceRecoveries: state.sources.map(source => ({

      sourceId: source.id,

      sourceName: source.name,

      allocated: 0,

      available: source.amount

    }))

  };

  state.recoveryCases.push(recoveryCase);

  state.ledger.push({

    reference: generateId("LED"),

    caseId: recoveryCase.id,

    source: "System",

    type: "Recovery Case Created",

    amount: obligation,

    status: "Active"

  });

  return recoveryCase;
}


/* ============================================================
   TRIGGER FIRST LOSS
============================================================ */

function triggerFirstLoss() {

  if (
    state.recoveryCases.some(
      item => item.manager === "Manager A" &&
      item.status === "Active"
    )
  ) {

    showToast("Manager A already has an active recovery case.");

    return;
  }

  state.primaryAccount.balance = 500000;
  state.primaryAccount.status = "Recovery Mode";

  const primaryAccount = state.accounts.find(
    account => account.id === "CSB-ACC-001"
  );

  if (primaryAccount) {
    primaryAccount.status = "Recovery Mode";
  }

  const recoveryCase = createRecoveryCase(
    "Manager A",
    "CSB-ACC-001"
  );

  state.simulationStep = Math.max(
    state.simulationStep,
    1
  );

  updateUI();

  activateTimeline("timelineLoss");

  showToast(
    `50% loss detected. Recovery Case ${recoveryCase.id} created.`
  );

  openView("recovery");
}


/* ============================================================
   ACTIVATE SB
============================================================ */

function activateSB() {

  if (state.recoveryCases.length === 0) {

    showToast(
      "A qualifying recovery case must exist before SB can activate."
    );

    return;
  }

  if (state.sb.active) {

    showToast(
      "SB continuity is already active."
    );

    return;
  }

  state.sb.active = true;

  state.sb.manager = "Manager B";

  state.sb.portfolio = "CSB-SB-PORTFOLIO-001";

  state.sb.repayment = 500000;

  state.primaryAccount.status = "SB Continuity";

  state.simulationStep = Math.max(
    state.simulationStep,
    2
  );

  state.ledger.push({

    reference: generateId("LED"),

    caseId: state.recoveryCases[0].id,

    source: "SB",

    type: "Continuity Activated",

    amount: 500000,

    status: "Active"

  });

  updateUI();

  activateTimeline("timelineSB");

  showToast(
    "SB activated. Trading continuity established with Manager B."
  );

  openView("sb");
}


/* ============================================================
   TRIGGER SECOND LOSS
============================================================ */

function triggerSecondLoss() {

  if (!state.sb.active) {

    showToast(
      "Activate SB first to create the second portfolio."
    );

    return;
  }

  if (
    state.recoveryCases.some(
      item => item.manager === "Manager B" &&
      item.status === "Active"
    )
  ) {

    showToast(
      "Manager B already has an active recovery case."
    );

    return;
  }

  const secondAccount = {

    id: "CSB-SB-PORTFOLIO-001",

    size: 1000000,

    source: "SB Continuity Portfolio",

    role: "Trading portfolio",

    manager: "Manager B",

    status: "Recovery Mode"

  };

  state.accounts.push(secondAccount);

  const recoveryCase = createRecoveryCase(
    "Manager B",
    secondAccount.id
  );

  state.primaryAccount.status = "Recovery Mode";

  state.simulationStep = Math.max(
    state.simulationStep,
    3
  );

  updateUI();

  showToast(
    `Manager B reached 50% drawdown. Recovery Case ${recoveryCase.id} created.`
  );

  openView("recovery");
}


/* ============================================================
   APPLY RECOVERY
============================================================ */

function applyRecovery() {

  const activeCases = state.recoveryCases.filter(
    item => item.status === "Active"
  );

  if (activeCases.length === 0) {

    showToast(
      "There are no active recovery cases."
    );

    return;
  }

  let totalRecoveredNow = 0;

  activeCases.forEach((recoveryCase, caseIndex) => {

    /*
      Demonstration rule:
      Intercept a percentage of available eligible
      earnings across the participant's economic sources.

      This is simulation logic only.
      Production rules would come from contractual,
      legal and regulatory parameters.
    */

    const interceptionRate =
      caseIndex === 0
        ? 0.18
        : 0.15;

    recoveryCase.sourceRecoveries.forEach(sourceRecovery => {

      if (recoveryCase.remaining <= 0) {
        return;
      }

      const available =
        sourceRecovery.available;

      const interceptable =
        available * interceptionRate;

      const amount =
        Math.min(
          interceptable,
          recoveryCase.remaining
        );

      if (amount <= 0) {
        return;
      }

      sourceRecovery.allocated += amount;

      sourceRecovery.available -= amount;

      recoveryCase.recovered += amount;

      recoveryCase.remaining -= amount;

      totalRecoveredNow += amount;

      state.ledger.push({

        reference: generateId("LED"),

        caseId: recoveryCase.id,

        source: sourceRecovery.sourceName,

        type: "Recovery Interception",

        amount,

        status: "Applied"

      });

    });

    if (recoveryCase.remaining <= 0) {

      recoveryCase.remaining = 0;

      recoveryCase.status = "Completed";

    }

  });

  state.simulationStep = Math.max(
    state.simulationStep,
    4
  );

  updateUI();

  showToast(
    `${money(totalRecoveredNow)} applied across active recovery cases.`
  );
}


/* ============================================================
   SETTLE
============================================================ */

function settleRecovery() {

  const activeCases = state.recoveryCases.filter(
    item => item.status === "Active"
  );

  if (activeCases.length === 0) {

    const completedCases = state.recoveryCases.filter(
      item => item.status === "Completed"
    );

    if (completedCases.length > 0) {

      showToast(
        "All recovery cases are already settled."
      );

    } else {

      showToast(
        "No recovery case exists."
      );

    }

    return;
  }

  activeCases.forEach(recoveryCase => {

    /*
      For prototype demonstration, settlement closes
      remaining obligations.

      A production system would never automatically
      forgive/write off a balance this way without
      defined contractual, legal and financial rules.
    */

    const remainingBeforeSettlement =
      recoveryCase.remaining;

    state.ledger.push({

      reference: generateId("LED"),

      caseId: recoveryCase.id,

      source: "Settlement",

      type: "Case Settlement",

      amount: remainingBeforeSettlement,

      status: "Settled"

    });

    recoveryCase.remaining = 0;

    recoveryCase.status = "Completed";

  });

  state.primaryAccount.status = "Active";

  state.simulationStep = 5;

  updateUI();

  activateTimeline("timelineSettlement");

  showToast(
    "Recovery cases settled in the simulation."
  );
}


/* ============================================================
   RENDER RECOVERY CASES
============================================================ */

function renderRecoveryCases() {

  const container =
    document.getElementById("recoveryCasesContainer");

  if (state.recoveryCases.length === 0) {

    container.innerHTML = `
      <div class="panel">

        <h2>No recovery cases yet.</h2>

        <p style="color:#667085;font-size:11px;">
          Trigger a 50% drawdown from the Overview screen
          to create the first recovery case.
        </p>

      </div>
    `;

    document.getElementById("networkCaseCount").textContent = "0";

    return;
  }

  container.innerHTML = state.recoveryCases.map(recoveryCase => {

    const progress =
      recoveryCase.originalObligation > 0
        ? (
            recoveryCase.recovered /
            recoveryCase.originalObligation
          ) * 100
        : 0;

    return `

      <div class="recovery-case">

        <div class="recovery-case-header">

          <div>

            <div class="case-id">
              ${recoveryCase.id}
            </div>

            <div class="case-title">
              ${recoveryCase.manager}
            </div>

            <div class="case-id">
              Account: ${recoveryCase.accountId}
            </div>

          </div>

          <div class="case-status ${
            recoveryCase.status === "Completed"
              ? "closed"
              : ""
          }">

            ${recoveryCase.status}

          </div>

        </div>


        <div class="recovery-numbers">

          <div class="recovery-number">

            <span>Loss</span>

            <strong>
              ${money(recoveryCase.drawdown)}
            </strong>

          </div>

          <div class="recovery-number">

            <span>Original obligation</span>

            <strong>
              ${money(recoveryCase.originalObligation)}
            </strong>

          </div>

          <div class="recovery-number">

            <span>Recovered</span>

            <strong>
              ${money(recoveryCase.recovered)}
            </strong>

          </div>

          <div class="recovery-number">

            <span>Remaining</span>

            <strong>
              ${money(recoveryCase.remaining)}
            </strong>

          </div>

        </div>


        <div class="progress-container">

          <div class="progress-header">

            <span>
              Recovery progress
            </span>

            <span>
              ${progress.toFixed(1)}%
            </span>

          </div>

          <div class="progress-bar">

            <div
              class="progress-fill"
              style="width:${Math.min(progress, 100)}%"
            ></div>

          </div>

        </div>


        <div style="
          display:flex;
          justify-content:space-between;
          margin-top:15px;
          color:#667085;
          font-size:10px;
        ">

          <span>
            Eligible sources
          </span>

          <strong>
            ${recoveryCase.sourceCount}
          </strong>

        </div>

      </div>

    `;

  }).join("");

  document.getElementById("networkCaseCount").textContent =
    state.recoveryCases.length;
}


/* ============================================================
   RENDER LEDGER
============================================================ */

function renderLedger() {

  const body =
    document.getElementById("ledgerBody");

  if (state.ledger.length === 0) {

    body.innerHTML = `
      <tr>
        <td colspan="6">
          No ledger events yet.
        </td>
      </tr>
    `;

    return;
  }

  body.innerHTML = state.ledger
    .slice()
    .reverse()
    .map(entry => {

      return `

        <tr>

          <td>
            ${entry.reference}
          </td>

          <td>
            ${entry.caseId || "—"}
          </td>

          <td>
            ${entry.source}
          </td>

          <td>
            ${entry.type}
          </td>

          <td>
            ${money(entry.amount)}
          </td>

          <td>
            <span class="ledger-status">
              ${entry.status}
            </span>
          </td>

        </tr>

      `;

    }).join("");
}


/* ============================================================
   UPDATE DASHBOARD
============================================================ */

function updateDashboard() {

  document.getElementById("totalRecovery").textContent =
    money(getTotalRecovery());

  document.getElementById("primaryStatus").textContent =
    state.primaryAccount.status;

  document.getElementById("continuityStatus").textContent =
    state.sb.active
      ? "SB Active"
      : "Available";

  document.getElementById("sbStatus").textContent =
    state.sb.active
      ? "Active"
      : "Not Activated";

  document.getElementById("sbDescription").textContent =
    state.sb.active
      ? "Trader has a continuity pathway with another portfolio manager while recovery continues."
      : "Trigger a qualifying loss to enter the recovery pathway.";

  document.getElementById("sbRecoveryStatus").textContent =
    state.recoveryCases.length > 0
      ? "Recovery running"
      : "Pending";

  document.getElementById("sbTradingStatus").textContent =
    state.sb.active
      ? "Active"
      : "Not active";
}


/* ============================================================
   TIMELINE
============================================================ */

function activateTimeline(id) {

  const item = document.getElementById(id);

  if (!item) {
    return;
  }

  item.classList.add("active");
}


/* ============================================================
   MAIN UI UPDATE
============================================================ */

function updateUI() {

  renderAccounts();

  renderSources();

  renderRecoveryCases();

  renderLedger();

  updateDashboard();

}


/* ============================================================
   RESET
============================================================ */

function resetSimulation() {

  state = deepClone(INITIAL_STATE);

  document
    .querySelectorAll(".timeline-item")
    .forEach(item => {

      item.classList.remove("active");

    });

  updateUI();

  openView("overview");

  showToast(
    "C&SB simulation reset."
  );
}


/* ============================================================
   EVENT LISTENERS
============================================================ */

document
  .getElementById("triggerLossBtn")
  .addEventListener(
    "click",
    triggerFirstLoss
  );

document
  .getElementById("lossBtn")
  .addEventListener(
    "click",
    triggerFirstLoss
  );

document
  .getElementById("activateSBBtn")
  .addEventListener(
    "click",
    activateSB
  );

document
  .getElementById("sbMainBtn")
  .addEventListener(
    "click",
    activateSB
  );

document
  .getElementById("secondLossBtn")
  .addEventListener(
    "click",
    triggerSecondLoss
  );

document
  .getElementById("recoverBtn")
  .addEventListener(
    "click",
    applyRecovery
  );

document
  .getElementById("settleBtn")
  .addEventListener(
    "click",
    settleRecovery
  );

document
  .getElementById("resetBtn")
  .addEventListener(
    "click",
    resetSimulation
  );


/* ============================================================
   INITIAL RENDER
============================================================ */

updateUI();