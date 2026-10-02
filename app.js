const elements = {
  btnOpenSignup: document.getElementById('btn-open-signup'),
  btnHeroSignup: document.getElementById('btn-hero-signup'),
  btnCloseSignup: document.getElementById('btn-close-signup'),
  modalSignup: document.getElementById('modal-signup'),
  btnTypeIndividual: document.getElementById('btn-type-individual'),
  btnTypeBusiness: document.getElementById('btn-type-business'),
  formSignup: document.getElementById('form-signup')
}

function init() {
  setupEventListeners()
}

function setupEventListeners() {
  if (elements.btnOpenSignup) {
    elements.btnOpenSignup.addEventListener('click', openSignupModal)
  }

  if (elements.btnHeroSignup) {
    elements.btnHeroSignup.addEventListener('click', openSignupModal)
  }

  if (elements.btnCloseSignup) {
    elements.btnCloseSignup.addEventListener('click', closeSignupModal)
  }

  if (elements.modalSignup) {
    elements.modalSignup.addEventListener('click', (e) => {
      if (e.target === elements.modalSignup) {
        closeSignupModal()
      }
    })
  }

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
  if (elements.modalSignup) {
    elements.modalSignup.removeAttribute('hidden')
  }
}

function closeSignupModal() {
  if (elements.modalSignup) {
    elements.modalSignup.setAttribute('hidden', '')
  }
}

document.addEventListener('DOMContentLoaded', init)
