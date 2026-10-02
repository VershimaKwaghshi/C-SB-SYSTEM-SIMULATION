const managersData = [
  { id: 1, name: "Apex Alpha", channel: "alpha", channelName: "4. High-Alpha", roi: "+142.5%", winRate: "78%", assets: "$1.2M", investors: 342 },
  { id: 2, name: "SafeHaven Macro", channel: "conservative", channelName: "1. Conservative", roi: "+24.1%", winRate: "89%", assets: "$4.5M", investors: 812 },
  { id: 3, name: "Equinox Balanced", channel: "balanced", channelName: "2. Balanced", roi: "+58.3%", winRate: "72%", assets: "$2.1M", investors: 490 },
  { id: 4, name: "Crypto Pulse", channel: "crypto", channelName: "5. Crypto", roi: "+210.8%", winRate: "65%", assets: "$980K", investors: 512 },
  { id: 5, name: "FX Velocity", channel: "forex", channelName: "6. Forex", roi: "+88.4%", winRate: "81%", assets: "$1.8M", investors: 295 },
  { id: 6, name: "Social Bond Pool A", channel: "social", channelName: "7. Social Bond", roi: "+45.0%", winRate: "94%", assets: "$3.4M", investors: 1200 },
  { id: 7, name: "Quantum Growth", channel: "growth", channelName: "3. Growth", roi: "+95.2%", winRate: "74%", assets: "$1.5M", investors: 388 }
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
  btnOpenSignup: document.getElementById('btn-open-signup'),
  btnHeroSignup: document.getElementById('btn-hero-signup'),
  btnBuyAccount: document.getElementById('btn-buy-account'),
  formSignup: document.getElementById('form-signup'),
  modalTierSize: document.getElementById('modal-tier-size'),
  modalTierFee: document.getElementById('modal-tier-fee'),
  modalTotalDue: document.getElementById('modal-total-due'),
  modalManagerName: document.getElementById('modal-manager-name'),
  modalManagerChannel: document.getElementById('modal-manager-channel')
};

function init() {
  renderManagers('all');
  setupEventListeners();
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
      <div class="manager-header">
        <div class="manager-info">
          <h3>${manager.name}</h3>
          <div class="manager-channel-tag">${manager.channelName}</div>
        </div>
      </div>
      <div class="manager-stats">
        <div class="stat-box">
          <span class="stat-label">Total ROI</span>
          <span class="stat-value green">${manager.roi}</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Win Rate</span>
          <span class="stat-value">${manager.winRate}</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Assets</span>
          <span class="stat-value">${manager.assets}</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Investors</span>
          <span class="stat-value">${manager.investors}</span>
        </div>
      </div>
      <button class="btn-primary-full btn-allocate" data-name="${manager.name}" data-channel="${manager.channelName}">Delegate Capital</button>
    `;
    elements.managersGrid.appendChild(card);
  });

  document.querySelectorAll('.btn-allocate').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const name = e.target.getAttribute('data-name');
      const channel = e.target.getAttribute('data-channel');
      
      if (elements.modalManagerName) elements.modalManagerName.innerText = name;
      if (elements.modalManagerChannel) elements.modalManagerChannel.innerText = channel;
      openModal(elements.modalAllocate);
    });
  });
}

function setupEventListeners() {
  // Channel Filters
  document.querySelectorAll('.channel-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.channel-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderManagers(e.target.getAttribute('data-channel'));
    });
  });

  // Tier Selection
  document.querySelectorAll('.btn-select-tier').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const size = parseInt(e.target.getAttribute('data-size')).toLocaleString();
      const fee = parseInt(e.target.getAttribute('data-fee')).toLocaleString();

      if (elements.modalTierSize) elements.modalTierSize.innerText = `$${size}`;
      if (elements.modalTierFee) elements.modalTierFee.innerText = `$${fee}`;
      if (elements.modalTotalDue) elements.modalTotalDue.innerText = `$${fee}.00`;

      openModal(elements.modalPurchase);
    });
  });

  // Modal Closers
  if (elements.btnClosePurchase) elements.btnClosePurchase.addEventListener('click', () => closeModal(elements.modalPurchase));
  if (elements.btnCloseAllocate) elements.btnCloseAllocate.addEventListener('click', () => closeModal(elements.modalAllocate));
  if (elements.btnCloseSignup) elements.btnCloseSignup.addEventListener('click', () => closeModal(elements.modalSignup));

  // Signup Triggers
  if (elements.btnOpenSignup) elements.btnOpenSignup.addEventListener('click', () => openModal(elements.modalSignup));
  if (elements.btnHeroSignup) elements.btnHeroSignup.addEventListener('click', () => openModal(elements.modalSignup));

  // Confirmations
  if (elements.btnConfirmPurchase) {
    elements.btnConfirmPurchase.addEventListener('click', () => {
      alert("Funded Account Request Received! Proceeding to Payment...");
      closeModal(elements.modalPurchase);
    });
  }

  if (elements.btnConfirmAllocate) {
    elements.btnConfirmAllocate.addEventListener('click', () => {
      alert(`Capital successfully delegated to ${elements.modalManagerName.innerText}!`);
      closeModal(elements.modalAllocate);
    });
  }

  if (elements.formSignup) {
    elements.formSignup.addEventListener('submit', (e) => {
      e.preventDefault();
      alert("Account created successfully!");
      closeModal(elements.modalSignup);
    });
  }
}

function openModal(modal) {
  if (modal) modal.removeAttribute('hidden');
}

function closeModal(modal) {
  if (modal) modal.setAttribute('hidden', '');
}

document.addEventListener('DOMContentLoaded', init);
