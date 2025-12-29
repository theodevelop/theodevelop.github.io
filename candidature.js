/**
 * MY PRETTY FAMILY - Formulaire de candidature
 * Validation et soumission du formulaire
 */

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('candidatureForm');
  if (!form) return;

  // Character counter for motivation field
  const motivationField = document.getElementById('motivation');
  if (motivationField) {
    const hint = motivationField.parentElement.querySelector('.form-hint');
    const minChars = 100;
    
    motivationField.addEventListener('input', function() {
      const count = this.value.length;
      if (count < minChars) {
        hint.innerHTML = `<span style="color: #e07070;">${count}/${minChars} caractères minimum</span>`;
      } else {
        hint.innerHTML = `<span style="color: #5a9a6a;">✓ ${count} caractères</span>`;
      }
    });
  }

  // Phone number formatting
  const phoneField = document.getElementById('telephone');
  if (phoneField) {
    phoneField.addEventListener('input', function() {
      // Remove non-digits
      let value = this.value.replace(/\D/g, '');
      
      // Format as XX XX XX XX XX
      if (value.length > 0) {
        value = value.match(/.{1,2}/g).join(' ').substring(0, 14);
      }
      
      this.value = value;
    });
  }

  // Form validation
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Clear previous errors
    document.querySelectorAll('.form-input.error, .form-select.error, .form-textarea.error').forEach(el => {
      el.classList.remove('error');
    });
    document.querySelectorAll('.form-error-message').forEach(el => el.remove());

    let isValid = true;
    let firstError = null;

    // Validate required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        showError(field, 'Ce champ est requis');
        if (!firstError) firstError = field;
      }
    });

    // Validate email
    const emailField = document.getElementById('email');
    if (emailField && emailField.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailField.value)) {
        isValid = false;
        showError(emailField, 'Veuillez entrer une adresse email valide');
        if (!firstError) firstError = emailField;
      }
    }

    // Validate phone (French format)
    if (phoneField && phoneField.value) {
      const phoneDigits = phoneField.value.replace(/\D/g, '');
      if (phoneDigits.length !== 10) {
        isValid = false;
        showError(phoneField, 'Veuillez entrer un numéro de téléphone valide (10 chiffres)');
        if (!firstError) firstError = phoneField;
      }
    }

    // Validate motivation length
    if (motivationField && motivationField.value) {
      if (motivationField.value.length < 100) {
        isValid = false;
        showError(motivationField, 'Votre motivation doit contenir au moins 100 caractères');
        if (!firstError) firstError = motivationField;
      }
    }

    // Validate checkboxes
    const checkboxes = form.querySelectorAll('input[type="checkbox"][required]');
    checkboxes.forEach(checkbox => {
      if (!checkbox.checked) {
        isValid = false;
        const label = checkbox.closest('.form-checkbox');
        if (label && !label.querySelector('.form-error-message')) {
          const errorMsg = document.createElement('span');
          errorMsg.className = 'form-error-message';
          errorMsg.textContent = 'Veuillez confirmer ce point';
          errorMsg.style.display = 'block';
          errorMsg.style.marginTop = '8px';
          label.appendChild(errorMsg);
        }
        if (!firstError) firstError = checkbox;
      }
    });

    // Scroll to first error
    if (!isValid && firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // If valid, show loading state and submit
    if (isValid) {
      const submitBtn = form.querySelector('.form-submit');
      const submitText = submitBtn.querySelector('.submit-text');
      const submitLoading = submitBtn.querySelector('.submit-loading');
      
      submitBtn.disabled = true;
      submitText.style.display = 'none';
      submitLoading.style.display = 'inline';

      // Simulate form submission (replace with actual API call)
      setTimeout(() => {
        showSuccessMessage();
      }, 2000);
    }
  });

  // Helper function to show error
  function showError(field, message) {
    field.classList.add('error');
    
    const errorMsg = document.createElement('p');
    errorMsg.className = 'form-error-message';
    errorMsg.textContent = message;
    
    const parent = field.parentElement;
    const existingError = parent.querySelector('.form-error-message');
    if (!existingError) {
      parent.appendChild(errorMsg);
    }
  }

  // Helper function to show success message
  function showSuccessMessage() {
    const formContainer = document.querySelector('.form-container');
    formContainer.innerHTML = `
      <div class="form-success">
        <div class="form-success-icon">
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <h2>Candidature envoyée !</h2>
        <p>
          Merci pour votre intérêt envers My Pretty Family.<br>
          Nous étudions votre candidature avec attention.<br><br>
          Si votre profil correspond à nos critères actuels, 
          nous vous contacterons sous 7 jours ouvrés.
        </p>
        <a href="./index.html" class="btn-primary" style="margin-top: 32px;">
          Retour à l'accueil
        </a>
      </div>
    `;
    
    // Scroll to top of form
    formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Remove error state on input
  form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(field => {
    field.addEventListener('input', function() {
      this.classList.remove('error');
      const errorMsg = this.parentElement.querySelector('.form-error-message');
      if (errorMsg) errorMsg.remove();
    });
  });

  // Remove error state on checkbox change
  form.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const label = this.closest('.form-checkbox');
      const errorMsg = label.querySelector('.form-error-message');
      if (errorMsg) errorMsg.remove();
    });
  });
});