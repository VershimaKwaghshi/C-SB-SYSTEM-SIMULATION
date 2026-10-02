// State configuration mapping
const TIER_CONFIGS = {
  'starter-10k': { size: 10000, fee: 100 },
  'pro-50k': { size: 50000, fee: 500 },
  'elite-100k': { size: 100000, fee: 1000 }
};

let currentSelectedTierKey = 'pro-50k';

const managersData = [
  { id: 1, name: "Alpha FX Strategy", channel: "forex", channelName: "6. Forex", roi: "+88.4%", winRate: "81%", region: "West Africa", duration: "19 mos", risk: "Moderate", split: "50% Manager | 50% Account Owner" },
  { id: 2, name: "Apex Alpha", channel: "alpha", channelName: "4. High-Alpha", roi: "+142.5%", winRate: "78%", region: "West Africa", duration: "14 mos", risk: "Moderate-High", split: "50% Manager | 50% Account Owner" },
  { id: 3, name: "SafeHaven Macro", channel: "conservative", channelName: "1. Conservative", roi: "+24.1%", winRate: "89%", region: "Global", duration: "28 mos", risk: "Low", split: "50% Manager | 50% Account Owner" },
  { id: 4, name: "Equinox Balanced", channel: "balanced", channelName: "2. Balanced", roi: "+58.3%", winRate: "72%", region: "East Africa", duration: "11 mos", risk: "Moderate", split: "50% Manager | 50% Account Owner" },
  { id: 5, name: "Crypto Pulse", channel: "crypto", channelName: "5. Crypto", roi: "+210.8%", winRate: "65%", region: "Global", duration: "9 mos", risk: "High", split: "50% Manager | 50% Account Owner" },
  { id: 6, name: "Quantum Growth", channel: "growth", channelName: "3. Growth", roi: "+95.2%", winRate: "74%", region: "Southern Africa", duration: "16 mos", risk: "Moderate-High", split: "50% Manager | 50% Account Owner" }
];

const elements = {
  managersGrid: document.getElementById('managers-grid'),
  modalPurchase: document.getElementById('modal-purchase'),
  btnClosePurchase: document.getElementById('btn-close-purchase'),
  btnConfirmPurchase: document.getElementById('btn-confirm-purchase'),
  modalAllocate: document.getElementById('modal-allocate'),
  btnCloseAllocate: document.getElementById('btn-close-allocate'),
  btnConfirmAllocate: document.getElementById('btn-confirm-allocate'),
  modalSignup: document.getElementById('modal-signup'),
  btnCloseSignup: document.getElementById('btn-close-signup'),
  modalLogin: document.getElementById('modal-login'),
  btnCloseLogin: document.getElementById('btn-close-login'),
  btnOpenLogin: document.getElementById('btn-open-login'),
  btnOpenSignup: document.getElementById('btn-open-signup'),
  btnHeroSignup: document.getElementById('btn-hero-signup'),
  btnHeroLearn: document.getElementById('btn-hero-learn'),
  formSignup: document.getElementById('form-signup'),
  formLogin: document.getElementById('form-login'),
  modalTierSize: document.getElementById('modal-tier-size'),
  modalInitialActive: document.getElementById('modal-initial-active'),
  modalSubSize: document.getElementById('modal-sub-size'),
  modalTotalNetwork: document.getElementById('modal-total-network'),
  modalTierFee: document.getElementById('modal-tier-fee'),
  modalTotalDue: document.getElementById('modal-total-due'),
  modalManagerName: document.getElementById('modal-manager-name'),
  modalManagerChannel: document.getElementById('modal-manager-channel'),
  modalAllocateAmount: document.getElementById('modal-allocate-amount'),
  btnApplySB: document.getElementById('btn-apply-sb')
};

function init() {
  renderManagers('all');
  setupEventListeners();
}

function updateTierModalState(tierKey) {
  currentSelectedTierKey = TIER_CONFIGS[tierKey] ? tierKey : 'pro-50k';
  const config = TIER_CONFIGS[currentSelectedTierKey];

  const totalPayable = config.size + config.fee;
  const maxNetworkCapital = config.size * 6;

  if (elements.modalTierSize) elements.modalTierSize.innerText = `$${config.size.toLocaleString()}`;
  if (elements.modalInitialActive) elements.modalInitialActive.innerText = `$${config.size.toLocaleString()}`;
  if (elements.modalSubSize) elements.modalSubSize.innerText = `$${config.size.toLocaleString()}`;
  if (elements.modalTotalNetwork) elements.modalTotalNetwork.innerText = `$${maxNetworkCapital.toLocaleString()}`;
  if (elements.modalTierFee) elements.modalTierFee.innerText = `$${config.fee.toLocaleString()}`;
  if (elements.modalTotalDue) elements.modalTotalDue.innerText = `$${totalPayable.toLocaleString()}.00`;
}

function renderManagers(filterChannel) {
  if (!elements.managersGrid) return;
  elements.managersGrid.innerHTML = '';

  const filtered = filterChannel === 'all' 
    ? managersData 
    : managersData.filter(m => m.channel === filterChannel);

  filtered.forEach(manager => {
    const card = document.createElement('div');
    card.className = 'manager-card';
    card.innerHTML = `
      <div class="proto-banner">Illustrative Prototype Data</div>
      <div class="manager-meta-line">
        <span>📍 ${manager.region}</span>
        <span>⏱️ ${manager.duration} track record</span>
      </div>
      <h3 style="color:#ffffff; font-size:1.1rem; margin-bottom:4px;">${manager.name}</h3>
      <div style="color:#00ff88; font-size:0.75rem; font-weight:700; margin-bottom:12px;">${manager.channelName}</div>
      
      <div class="manager-stats">
        <div class="stat-box">
          <span class="stat-label">ROI (Historical)</span>
          <span class="stat-value green">${manager.roi}</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Win Rate</span>
          <span class="stat-value">${manager.winRate}</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Risk Profile</span>
          <span class="stat-value">${manager.risk}</span>
        </div>
        <div class="stat-box full-width">
          <span class="stat-label">Primary Profit Split</span>
          <span class="stat-value" style="color:#00ff88; font-size:0.78rem;">${manager.split}</span>
        </div>
      </div>
      <button class="btn-primary-full btn-delegate" data-name="${manager.name}" data-channel="${manager.channelName}">Assign Account To Manager</button>
    `;
    elements.managersGrid.appendChild(card);
  });

  document.querySelectorAll('.btn-delegate').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      const channel = btn.dataset.channel;
      const config = TIER_CONFIGS[currentSelectedTierKey];
      
      if (elements.modalManagerName) elements.modalManagerName.innerText = name;
      if (elements.modalManagerChannel) elements.modalManagerChannel.innerText = channel;
      if (elements.modalAllocateAmount) elements.modalAllocateAmount.innerText = `$${config.size.toLocaleString()}.00`;

      openModal(elements.modalAllocate);
    });
  });
}

function setupEventListeners() {
  document.querySelectorAll('.channel-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.channel-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderManagers(btn.dataset.channel);
    });
  });

  document.querySelectorAll('.btn-buy-account').forEach(btn => {
    btn.addEventListener('click', () => {
      const tierKey = btn.dataset.tier || 'pro-50k';
      updateTierModalState(tierKey);
      openModal(elements.modalPurchase);
    });
  });

  // Navigation and Modal Triggers
  elements.btnOpenLogin?.addEventListener('click', () => openModal(elements.modalLogin));
  elements.btnOpenSignup?.addEventListener('click', () => openModal(elements.modalSignup));
  elements.btnHeroSignup?.addEventListener('click', () => openModal(elements.modalSignup));

  elements.btnHeroLearn?.addEventListener('click', () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  });

  // Modal Close Listeners
  elements.btnClosePurchase?.addEventListener('click', () => closeModal(elements.modalPurchase));
  elements.btnCloseAllocate?.addEventListener('click', () => closeModal(elements.modalAllocate));
  elements.btnCloseSignup?.addEventListener('click', () => closeModal(elements.modalSignup));
  elements.btnCloseLogin?.addEventListener('click', () => closeModal(elements.modalLogin));

  // Action Confirmation Buttons
  elements.btnConfirmPurchase?.addEventListener('click', () => {
    closeModal(elements.modalPurchase);
    const config = TIER_CONFIGS[currentSelectedTierKey];
    if (elements.modalAllocateAmount) elements.modalAllocateAmount.innerText = `$${config.size.toLocaleString()}.00`;
    openModal(elements.modalAllocate);
  });

  elements.btnConfirmAllocate?.addEventListener('click', () => {
    const config = TIER_CONFIGS[currentSelectedTierKey];
    alert(`Capital tier ($${config.size.toLocaleString()}) successfully assigned to ${elements.modalManagerName.innerText}.`);
    closeModal(elements.modalAllocate);
  });

  elements.btnApplySB?.addEventListener('click', () => {
    alert("Social Bond Facility Evaluator: Verifying 50% drawdown status and guarantor consents...");
  });

  elements.formSignup?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert("Account created successfully!");
    closeModal(elements.modalSignup);
  });

  elements.formLogin?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert("Logged in successfully!");
    closeModal(elements.modalLogin);
  });
}

function openModal(modal) {
  if (modal) modal.removeAttribute('hidden');
}

function closeModal(modal) {
  if (modal) modal.setAttribute('hidden', '');
}

document.addEventListener('DOMContentLoaded', init);
