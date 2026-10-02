const managersData = [
  { id: 1, name: "Apex Alpha", channel: "alpha", channelName: "4. High-Alpha", roi: "+142.5%", winRate: "78%", assets: "$1.2M", investors: 342 },
  { id: 2, name: "SafeHaven Macro", channel: "conservative", channelName: "1. Conservative", roi: "+24.1%", winRate: "89%", assets: "$4.5M", investors: 812 },
  { id: 3, name: "Equinox Balanced", channel: "balanced", channelName: "2. Balanced", roi: "+58.3%", winRate: "72%", assets: "$2.1M", investors: 490 },
  { id: 4, name: "Crypto Pulse", channel: "crypto", channelName: "5. Crypto", roi: "+210.8%", winRate: "65%", assets: "$980K", investors: 512 },
  { id: 5, name: "FX Velocity", channel: "forex", channelName: "6. Forex", roi: "+88.4%", winRate: "81%", assets: "$1.8M", investors: 295 },
  { id: 6, name: "Social Bond Pool A", channel: "social", channelName: "7. Social Bond", roi: "+45.0%", winRate: "94%", assets: "$3.4M", investors: 1200 },
  { id: 7, name: "Quantum Growth", channel: "growth", channelName: "3. Growth", roi: "+95.2%", winRate: "74%", assets: "$1.5M", investors: 388 }
]

const elements = {
  managersGrid: document.getElementById('managers-grid'),
  modalAllocate: document.getElementById('modal-allocate'),
  btnCloseAllocate: document.getElementById('btn-close-allocate'),
  btnConfirmAllocate: document.getElementById('btn-confirm-allocate'),
  modalManagerName: document.getElementById('modal-manager-name'),
  modalManagerChannel: document.getElementById('modal-manager-channel')
}

function init() {
  renderManagers('all')
  setupEventListeners()
}

function renderManagers(filterChannel) {
  if (!elements.managersGrid) return
  elements.managersGrid.innerHTML = ''

  const filtered = filterChannel === 'all' 
    ? managersData 
    : managersData.filter(m => m.channel === filterChannel)

  filtered.forEach(manager => {
    const card = document.createElement('div')
    card.className = 'manager-card'
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
    `
    elements.managersGrid.appendChild(card)
  })

  // Attach allocation triggers
  document.querySelectorAll('.btn-allocate').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const name = e.target.getAttribute('data-name')
      const channel = e.target.getAttribute('data-channel')
      
      elements.modalManagerName.innerText = name
      elements.modalManagerChannel.innerText = channel
      openAllocateModal()
    })
  })
}

function setupEventListeners() {
  // Filter Buttons
  const filterBtns = document.querySelectorAll('.channel-btn')
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'))
      e.target.classList.add('active')
      const channel = e.target.getAttribute('data-channel')
      renderManagers(channel)
    })
  })

  // Modal Controls
  if (elements.btnCloseAllocate) {
    elements.btnCloseAllocate.addEventListener('click', closeAllocateModal)
  }

  if (elements.btnConfirmAllocate) {
    elements.btnConfirmAllocate.addEventListener('click', () => {
      alert(`Capital successfully delegated to ${elements.modalManagerName.innerText}!`)
      closeAllocateModal()
    })
  }
}

function openAllocateModal() {
  if (elements.modalAllocate) elements.modalAllocate.removeAttribute('hidden')
}

function closeAllocateModal() {
  if (elements.modalAllocate) elements.modalAllocate.setAttribute('hidden', '')
}

document.addEventListener('DOMContentLoaded', init)
