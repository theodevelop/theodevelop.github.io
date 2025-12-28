/* ==========================================
   MY PRETTY FAMILY - Candidature Form
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {
  
  const form = document.getElementById('candidatureForm');
  
  if (!form) return;
  
  // ==================== FORM VALIDATION ====================
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Reset errors
    resetErrors();
    
    // Validate
    const isValid = validateForm();
    
    if (isValid) {
      submitForm();
    }
  });
  
  // ==================== VALIDATION FUNCTIONS ====================
  function validateForm() {
    let isValid = true;
    
    // Required text fields
    const textFields = form.querySelectorAll('input[required]:not([type="radio"]):not([type="checkbox"]), select[required], textarea[required]');
    
    textFields.forEach(field => {
      if (!field.value.trim()) {
        showError(field, 'Ce champ est requis');
        isValid = false;
      } else if (field.type === 'email' && !isValidEmail(field.value)) {
        showError(field, 'Veuillez entrer un email valide');
        isValid = false;
      } else if (field.id === 'telephone' && !isValidPhone(field.value)) {
        showError(field, 'Veuillez entrer un numéro valide');
        isValid = false;
      } else if (field.id === 'motivation' && field.value.trim().length < 100) {
        showError(field, 'Minimum 100 caractères requis (' + field.value.trim().length + '/100)');
        isValid = false;
      }
    });
    
    // Required radio groups
    const radioGroups = ['budget_pret', 'demarrage'];
    radioGroups.forEach(name => {
      const radios = form.querySelectorAll(`input[name="${name}"]`);
      const isChecked = Array.from(radios).some(r => r.checked);
      if (!isChecked) {
        const container = radios[0].closest('.form-group');
        container.classList.add('has-error');
        isValid = false;
      }
    });
    
    // Required checkboxes
    const checkboxes = form.querySelectorAll('input[type="checkbox"][required]');
    checkboxes.forEach(checkbox => {
      if (!checkbox.checked) {
        checkbox.closest('.form-checkbox').classList.add('has-error');
        isValid = false;
      }
    });
    
    // Scroll to first error
    if (!isValid) {
      const firstError = form.querySelector('.has-error, .error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    
    return isValid;
  }
  
  function showError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.form-error-message');
    if (existingError) existingError.remove();
    
    // Add error message
    const errorEl = document.createElement('p');
    errorEl.className = 'form-error-message';
    errorEl.textContent = message;
    field.parentNode.appendChild(errorEl);
  }
  
  function resetErrors() {
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    form.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
    form.querySelectorAll('.form-error-message').forEach(el => el.remove());
  }
  
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  function isValidPhone(phone) {
    // Accept French phone formats
    const cleaned = phone.replace(/[\s.-]/g, '');
    return /^(\+33|0)[1-9][0-9]{8}$/.test(cleaned);
  }
  
  // ==================== SUBMIT FORM ====================
  function submitForm() {
    const submitBtn = form.querySelector('.form-submit');
    const submitText = submitBtn.querySelector('.submit-text');
    const submitLoading = submitBtn.querySelector('.submit-loading');
    
    // Show loading state
    submitText.style.display = 'none';
    submitLoading.style.display = 'inline-flex';
    submitBtn.disabled = true;
    
    // Collect form data
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    
    // Simulate API call (replace with real endpoint)
    setTimeout(() => {
      // Success - show confirmation
      showSuccess();
      
      // Track conversion (if analytics available)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
          'event_category': 'candidature',
          'event_label': 'partner_application'
        });
      }
      
    }, 2000);
    
    // For real implementation, use:
    /*
    fetch('/api/candidature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        showSuccess();
      } else {
        showSubmitError(result.message);
      }
    })
    .catch(error => {
      showSubmitError('Une erreur est survenue. Veuillez réessayer.');
    });
    */
  }
  
  function showSuccess() {
    const formContainer = document.querySelector('.form-container');
    
    formContainer.innerHTML = `
      <div class="form-success">
        <div class="form-success-icon">
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <h2>Candidature envoyée !</h2>
        <p>
          Merci pour votre candidature. Nous l'étudions avec attention et 
          reviendrons vers vous sous 7 jours ouvrés si votre profil correspond 
          à nos critères actuels.
        </p>
        <a href="./index.html" class="btn-outline" style="margin-top: 32px;">
          Retour à l'accueil
        </a>
      </div>
    `;
    
    // Scroll to top of form
    formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  function showSubmitError(message) {
    const submitBtn = form.querySelector('.form-submit');
    const submitText = submitBtn.querySelector('.submit-text');
    const submitLoading = submitBtn.querySelector('.submit-loading');
    
    // Reset button
    submitText.style.display = 'inline';
    submitLoading.style.display = 'none';
    submitBtn.disabled = false;
    
    // Show error
    alert(message || 'Une erreur est survenue. Veuillez réessayer.');
  }
  
  // ==================== LIVE VALIDATION ====================
  // Remove error state on input
  form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(field => {
    field.addEventListener('input', function() {
      this.classList.remove('error');
      const errorMsg = this.parentNode.querySelector('.form-error-message');
      if (errorMsg) errorMsg.remove();
    });
  });
  
  // Character counter for motivation
  const motivationField = document.getElementById('motivation');
  if (motivationField) {
    const hint = motivationField.parentNode.querySelector('.form-hint');
    const originalHint = hint.textContent;
    
    motivationField.addEventListener('input', function() {
      const count = this.value.trim().length;
      if (count < 100) {
        hint.textContent = `${count}/100 caractères minimum`;
        hint.style.color = count > 50 ? '#888' : '#e07070';
      } else {
        hint.textContent = `✓ ${count} caractères`;
        hint.style.color = '#5a9a6a';
      }
    });
  }
  
  // Remove error on radio/checkbox change
  form.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
    input.addEventListener('change', function() {
      this.closest('.form-group, .form-checkbox')?.classList.remove('has-error');
    });
  });
  
});