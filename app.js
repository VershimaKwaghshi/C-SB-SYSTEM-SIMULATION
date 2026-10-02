let selectedTier = {
  size: 50000,
  fee: 500
}

const elements = {
  btnOpenSignup: document.getElementById('btn-open-signup'),
  btnHeroSignup: document.getElementById('btn-hero-signup'),
  btnCloseSignup: document.getElementById('btn-close-signup'),
  modalSignup: document.getElementById('modal-signup'),
  
  btnTypeIndividual: document.getElementById('btn-type-individual'),
  btnTypeBusiness: document.getElementById('btn-type-business'),
  formSignup: document.getElementById('form-signup'),

  modalPurchase: document.getElementById('modal-purchase'),
  btnClosePurchase: document.getElementById('btn-close-purchase'),
  btnConfirmPurchase: document.getElementById('btn-confirm-purchase'),
  modalTierSize: document.getElementById('modal-tier-size'),
  modalTierFee: document.getElementById('modal-tier-fee'),
  modalTotalDue: document.getElementById('modal-total-due'),
  activeAccountSize: document.getElementById('active-account-size')
}

function init() {
  setupEventListeners()
}

function setupEventListeners() {
  // Signup Modal Triggers
  if (elements.btnOpenSignup) elements.btnOpenSignup.addEventListener('click', openSignupModal)
  if (elements.btnHeroSignup) elements.btnHeroSignup.addEventListener('click', openSignupModal)
  if (elements.btnCloseSignup) elements.btnCloseSignup.addEventListener('click', closeSignupModal)

  // Purchase Modal Triggers
  if (elements.btnClosePurchase) elements.btnClosePurchase.addEventListener('click', closePurchaseModal)

  // Tier Selection Buttons
  const tierButtons = document.querySelectorAll('.btn-select-tier')
  tierButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const size = e.target.getAttribute('data-size')
      const fee = e.target.getAttribute('data-fee')
      
      selectedTier.size = Number(size)
      selectedTier.fee = Number(fee)

      elements.modalTierSize.innerText = `$${selectedTier.size.toLocaleString()}`
      elements.modalTierFee.innerText = `$${selectedTier.fee.toLocaleString()}`
      elements.modalTotalDue.innerText = `$${selectedTier.fee.toLocaleString()}.00`

      openPurchaseModal()
    })
  })

  // Confirm Purchase Button
  if (elements.btnConfirmPurchase) {
    elements.btnConfirmPurchase.addEventListener('click', () => {
      elements.activeAccountSize.innerText = `$${selectedTier.size.toLocaleString()}`
      alert(`Account activated successfully! You are now trading with a $${selectedTier.size.toLocaleString()} funded account.`)
      closePurchaseModal()
    })
  }

  // Toggle Account Type
  if (elements.btnTypeIndividual && elements.btnTypeBusiness) {
    elements.btnTypeIndividual.addEventListener('click', () => {
      elements.btnTypeIndividual.classList.add('active')
      elements.btnTypeBusiness.classList.remove('active')
    })

    elements.btnTypeBusiness.addEventListener('click', () => {
      elements.btnTypeBusiness.classList.add('active')
      elements.btnTypeIndividual.classList.remove('active')
    })
  }

  // Form Submission
  if (elements.formSignup) {
    elements.formSignup.addEventListener('submit', (e) => {
      e.preventDefault()
      const name = document.getElementById('input-name').value
      const email = document.getElementById('input-email').value
      alert(`Account created successfully for ${name} using ${email}`)
      closeSignupModal()
    })
  }
}

function openSignupModal() {
  if (elements.modalSignup) elements.modalSignup.removeAttribute('hidden')
}

function closeSignupModal() {
  if (elements.modalSignup) elements.modalSignup.setAttribute('hidden', '')
}

function openPurchaseModal() {
  if (elements.modalPurchase) elements.modalPurchase.removeAttribute('hidden')
}

function closePurchaseModal() {
  if (elements.modalPurchase) elements.modalPurchase.setAttribute('hidden', '')
}

document.addEventListener('DOMContentLoaded', init)
