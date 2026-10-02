const state = {
  revenue: {
    serviceCharge: 0,
    withdrawFee: 0,
    brokerRebate: 0,
    sbProtocolFee: 0
  },

  ledger: [],
  txCounter: 1001,
  account: null,

  sb: {
    active: false,
    facilitatorAdvanced: 0,
    lienPerBonder: 0,
    recoveryTarget: 0,
    recoveredAmount: 0
  },

  bonders: Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Bonder ${i + 1}`,
    equity: 6000,
    lien: 0
  }))
};

const elements = {
  sysServiceRevenue: document.getElementById('sys-service-revenue'),
  sysWithdrawRevenue: document.getElementById('sys-withdraw-revenue'),
  sysRebates: document.getElementById('sys-rebates'),
  sysSbRevenue: document.getElementById('sys-sb-revenue'),
  sysEquity: document.getElementById('sys-equity'),
  sysLiens: document.getElementById('sys-liens'),

  capitalForm: document.getElementById('capital-form'),
  userName: document.getElementById('user-name'),
  accountPrice: document.getElementById('account-price'),
  purchaseType: document.getElementById('purchase-type'),
  capitalStatus: document.getElementById('capital-status'),
  installmentPayAmt: document.getElementById('installment-pay-amt'),
  btnPayInstallment: document.getElementById('btn-pay-installment'),
  withdrawAmt: document.getElementById('withdraw-amt'),
  btnWithdraw: document.getElementById('btn-withdraw'),

  managementStatus: document.getElementById('management-status'),
  btnAssignSubmanager: document.getElementById('btn-assign-submanager'),
  lotsTraded: document.getElementById('lots-traded'),
  tradePct: document.getElementById('trade-pct'),
  btnRunTrade: document.getElementById('btn-run-trade'),

  sbStatus: document.getElementById('sb-status'),
  btnTriggerSb: document.getElementById('btn-trigger-sb'),
  btnExpireSb: document.getElementById('btn-expire-sb'),

  interceptSource: document.getElementById('intercept-source'),
  interceptAmount: document.getElementById('intercept-amount'),
  btnProcessIntercept: document.getElementById('btn-process-intercept'),
  interceptStatus: document.getElementById('intercept-status'),

  bondersList: document.getElementById('bonders-list'),
  ledgerRows: document.getElementById('ledger-rows')
};

function init() {
  setupEventListeners();
  render();
}

function recordLedger(src, dst, amt, desc) {
  const entry = {
    txId: `TX-${state.txCounter++}`,
    timestamp: new Date().toLocaleTimeString(),
    src,
    dst,
    amt: parseFloat(amt).toFixed(2),
    desc
  };
  state.ledger.unshift(entry);
}

function setupEventListeners() {
  elements.capitalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const baseSize = parseFloat(elements.accountPrice.value);
    const serviceFee = baseSize * 0.01;
    const totalCost = baseSize + serviceFee;
    const method = elements.purchaseType.value;
    const initialPaid = method === 'direct' ? totalCost : totalCost * 0.25;

    state.account = {
      traderName: elements.userName.value,
      baseline: baseSize,
      equity: baseSize,
      totalCost: totalCost,
      totalPaid: initialPaid,
      isFullyPaid: method === 'direct',
      managerAssigned: `Manager ${Math.floor(100 + Math.random() * 900)}`,
      subManagerAssigned: null
    };

    state.revenue.serviceCharge += serviceFee;
    recordLedger('TRADER', 'CSB TREASURY', initialPaid, `Account Purchase ${method.toUpperCase()} with 1 Percent Service Fee`);
    recordLedger('SYSTEM', 'PARTNER BROKER', baseSize, `Random Manager ${state.account.managerAssigned} Enforced`);

    render();
  });

  elements.btnPayInstallment.addEventListener('click', () => {
    if (!state.account || state.account.isFullyPaid) return;

    const payment = parseFloat(elements.installmentPayAmt.value);
    state.account.totalPaid += payment;

    recordLedger('TRADER', 'CSB TREASURY', payment, 'Installment Payment Received');

    if (state.account.totalPaid >= state.account.totalCost) {
      state.account.isFullyPaid = true;
      recordLedger('CSB TREASURY', 'TRADER', 0, 'Purchase Completed. Account Unlocked');
    }

    render();
  });

  elements.btnWithdraw.addEventListener('click', () => {
    if (!state.account) return;
    const reqAmt = parseFloat(elements.withdrawAmt.value);
    const withdrawable = state.account.isFullyPaid 
      ? state.account.equity 
      : Math.max(0, state.account.equity - state.account.baseline);

    if (reqAmt > withdrawable) return;

    const fee = reqAmt * 0.15;
    const netPayout = reqAmt - fee;

    state.account.equity -= reqAmt;
    state.revenue.withdrawFee += fee;

    recordLedger('ACCOUNT EQUITY', 'CSB REVENUE', fee, '15 Percent Withdrawal Fee Retained');
    recordLedger('ACCOUNT EQUITY', 'TRADER BANK', netPayout, 'Net Profit Withdrawal Dispatched');

    render();
  });

  elements.btnAssignSubmanager.addEventListener('click', () => {
    if (!state.account) return;
    state.account.subManagerAssigned = `SubManager ${Math.floor(1000 + Math.random() * 9000)}`;
    recordLedger('MANAGER', state.account.subManagerAssigned, 0, 'Delegated Account to Submanager');
    render();
  });

  elements.btnRunTrade.addEventListener('click', () => {
    if (!state.account) return;
    const lots = parseFloat(elements.lotsTraded.value);
    const pct = parseFloat(elements.tradePct.value) / 100;
    
    const rebate = lots * 12;
    state.revenue.brokerRebate += rebate;
    recordLedger('PARTNER BROKER', 'CSB REVENUE', rebate, `Brokerage Rebate Earned for ${lots} Lots`);

    const change = state.account.equity * pct;
    state.account.equity += change;
    recordLedger('MARKET', 'ACCOUNT EQUITY', change, `Trade Results Execution`);

    if (state.account.equity <= (state.account.baseline * 0.50)) {
      recordLedger('PARTNER BROKER', 'SYSTEM', 0, '50 Percent Drawdown Breach! Manager Isolated');
    }

    render();
  });

  elements.btnTriggerSb.addEventListener('click', () => {
    if (!state.account || state.sb.active) return;

    const sbAmount = state.account.baseline * 0.50;
    const facilitatorReturn = sbAmount * 0.08;
    const bonderTotalFee = sbAmount * 0.08;
    const csbFee = sbAmount * 0.04;

    state.sb.active = true;
    state.sb.facilitatorAdvanced = sbAmount;
    state.sb.lienPerBonder = sbAmount * 0.10;
    state.sb.recoveryTarget = sbAmount;
    state.sb.recoveredAmount = 0;

    state.account.equity += sbAmount;
    state.revenue.sbProtocolFee += csbFee;

    const feePerBonder = bonderTotalFee / 10;
    state.bonders.forEach(b => {
      b.lien = state.sb.lienPerBonder;
      b.equity += feePerBonder;
    });

    recordLedger('FACILITATOR', 'ACCOUNT EQUITY', sbAmount, 'Social Bond Credit Advanced');
    recordLedger('ACCOUNT EQUITY', 'FACILITATOR', facilitatorReturn, 'Facilitator Return Dispersal');
    recordLedger('ACCOUNT EQUITY', 'BONDERS POOL', bonderTotalFee, 'Bonder Dispersal');
    recordLedger('ACCOUNT EQUITY', 'CSB REVENUE', csbFee, 'CSB Fee Retained');

    render();
  });

  elements.btnExpireSb.addEventListener('click', () => {
    if (!state.sb.active) return;

    const unrecovered = state.sb.recoveryTarget - state.sb.recoveredAmount;

    if (unrecovered > 0) {
      const liquidCollateral = Math.min(state.account.equity, unrecovered);
      state.account.equity -= liquidCollateral;
      
      const unrecoveredBalance = unrecovered - liquidCollateral;
      if (unrecoveredBalance > 0) {
        const bonderLiq = unrecoveredBalance / 10;
        state.bonders.forEach(b => {
          b.equity -= bonderLiq;
          b.lien = 0;
        });
        recordLedger('BONDERS POOL', 'FACILITATOR', unrecoveredBalance, '30 Day Contract Expired Executed Bonder Liens');
      }
      recordLedger('ACCOUNT COLLATERAL', 'FACILITATOR', liquidCollateral, '30 Day Contract Expired Liquidated Account Collateral');
    } else {
      state.bonders.forEach(b => b.lien = 0);
      recordLedger('SYSTEM', 'BONDERS POOL', 0, '30 Day Contract Settled Liens Released');
    }

    state.sb.active = false;
    render();
  });

  elements.btnProcessIntercept.addEventListener('click', () => {
    if (!state.sb.active) return;

    const amt = parseFloat(elements.interceptAmount.value);
    const source = elements.interceptSource.value;

    state.sb.recoveredAmount += amt;

    recordLedger(`MANAGER ${source}`, 'ACCOUNT OWNER', amt, '100 Percent Intercepted Revenue Dispatched to Recovery');

    if (state.sb.recoveredAmount >= state.sb.recoveryTarget) {
      state.sb.active = false;
      state.bonders.forEach(b => b.lien = 0);
      recordLedger('INTERCEPT ENGINE', 'SYSTEM', 0, 'Full Recovery Achieved SB Event Completed');
    }

    render();
  });
}

function render() {
  elements.sysServiceRevenue.textContent = `$${state.revenue.serviceCharge.toFixed(2)}`;
  elements.sysWithdrawRevenue.textContent = `$${state.revenue.withdrawFee.toFixed(2)}`;
  elements.sysRebates.textContent = `$${state.revenue.brokerRebate.toFixed(2)}`;
  elements.sysSbRevenue.textContent = `$${state.revenue.sbProtocolFee.toFixed(2)}`;
  elements.sysEquity.textContent = state.account ? `$${state.account.equity.toFixed(2)}` : '$0.00';
  
  const totalLiens = state.bonders.reduce((acc, b) => acc + b.lien, 0);
  elements.sysLiens.textContent = `$${totalLiens.toFixed(2)}`;

  if (!state.account) {
    elements.capitalStatus.textContent = "No active purchase";
    elements.managementStatus.textContent = "No accounts active";
    elements.btnPayInstallment.disabled = true;
    elements.btnWithdraw.disabled = true;
    elements.btnAssignSubmanager.disabled = true;
    elements.btnRunTrade.disabled = true;
  } else {
    elements.btnPayInstallment.disabled = state.account.isFullyPaid;
    
    const withdrawable = state.account.isFullyPaid 
      ? state.account.equity 
      : Math.max(0, state.account.equity - state.account.baseline);
    
    elements.btnWithdraw.disabled = withdrawable <= 0;
    elements.btnAssignSubmanager.disabled = state.account.subManagerAssigned !== null;
    elements.btnRunTrade.disabled = false;

    elements.capitalStatus.innerHTML = `
      Trader Name: ${state.account.traderName}<br>
      Base Capital: $${state.account.baseline.toFixed(2)}<br>
      Total Price with 1 Percent Fee: $${state.account.totalCost.toFixed(2)}<br>
      Amount Paid: $${state.account.totalPaid.toFixed(2)} of $${state.account.totalCost.toFixed(2)}<br>
      Status: ${state.account.isFullyPaid ? 'PURCHASE COMPLETE' : 'INSTALLMENT PLAN'}<br>
      Current Equity: $${state.account.equity.toFixed(2)}<br>
      Withdrawable Profit: $${withdrawable.toFixed(2)}
    `;

    elements.managementStatus.innerHTML = `
      Assigned Manager: ${state.account.managerAssigned}<br>
      Submanager Status: ${state.account.subManagerAssigned || 'Direct Management'}<br>
      Reciprocal Account: Active
    `;
  }

  if (!state.account) {
    elements.sbStatus.textContent = "Funded account required";
    elements.btnTriggerSb.disabled = true;
    elements.btnExpireSb.disabled = true;
  } else {
    const isFiftyPctDrawdown = state.account.equity <= (state.account.baseline * 0.50);
    elements.btnTriggerSb.disabled = !isFiftyPctDrawdown || state.sb.active;
    elements.btnExpireSb.disabled = !state.sb.active;

    if (state.sb.active) {
      elements.sbStatus.innerHTML = `
        ACTIVE SOCIAL BOND CONTRACT<br>
        Facilitator Advanced: $${state.sb.facilitatorAdvanced.toFixed(2)}<br>
        Lien per Bonder: $${state.sb.lienPerBonder.toFixed(2)}<br>
        Intercept Progress: $${state.sb.recoveredAmount.toFixed(2)} of $${state.sb.recoveryTarget.toFixed(2)}
      `;
    } else if (isFiftyPctDrawdown) {
      elements.sbStatus.innerHTML = `50 Percent Drawdown Breach Manager Isolated SB Ready`;
    } else {
      elements.sbStatus.textContent = "Account operating normally";
    }
  }

  elements.btnProcessIntercept.disabled = !state.sb.active;
  if (state.sb.active) {
    elements.interceptStatus.innerHTML = `Intercepting manager channels Unrecovered $${(state.sb.recoveryTarget - state.sb.recoveredAmount).toFixed(2)}`;
  } else {
    elements.interceptStatus.textContent = "Intercept engine idle";
  }

  elements.bondersList.innerHTML = state.bonders.map(b => `
    <div class="bonder-card ${b.lien > 0 ? 'lien-active' : ''}">
      ${b.name}<br>
      Equity: $${b.equity.toFixed(2)}<br>
      Lien: $${b.lien.toFixed(2)}
    </div>
  `).join('');

  elements.ledgerRows.innerHTML = state.ledger.map(row => `
    <tr>
      <td>${row.txId}</td>
      <td>${row.timestamp}</td>
      <td>${row.src}</td>
      <td>${row.dst}</td>
      <td>$${row.amt}</td>
      <td>${row.desc}</td>
    </tr>
  `).join('');
}

document.addEventListener('DOMContentLoaded', init);
