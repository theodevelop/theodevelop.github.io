/* ==========================================
   MY PRETTY FAMILY - Scripts
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {
  
  // ==================== FAQ ACCORDION ====================
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Fermer les autres items (optionnel - décommenter pour accordion exclusif)
      // faqItems.forEach(otherItem => {
      //   if (otherItem !== item) {
      //     otherItem.classList.remove('open');
      //   }
      // });
      
      // Toggle l'item actuel
      item.classList.toggle('open');
    });
  });

  // ==================== SMOOTH SCROLL ====================
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
  
  smoothScrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Ignorer les liens vides ou "#"
      if (href === '#' || href === '') return;
      
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        
        const navHeight = document.querySelector('.nav').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==================== NAVIGATION ACTIVE STATE ====================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  function updateActiveNav() {
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  
  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  // ==================== NAVBAR BACKGROUND ON SCROLL ====================
  const nav = document.querySelector('.nav');
  
  function updateNavBackground() {
    if (window.scrollY > 50) {
      nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
    } else {
      nav.style.boxShadow = 'none';
    }
  }
  
  window.addEventListener('scroll', updateNavBackground);
  updateNavBackground();

  // ==================== FORM VALIDATION FEEDBACK ====================
  const form = document.querySelector('form');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Vérification basique
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;
      
      requiredFields.forEach(field => {
        if (!field.value.trim() && field.type !== 'checkbox') {
          isValid = false;
          field.style.borderColor = '#e07070';
        } else if (field.type === 'checkbox' && !field.checked) {
          isValid = false;
        } else {
          field.style.borderColor = '#e0e0e0';
        }
      });
      
      if (isValid) {
        // Ici vous pouvez ajouter l'envoi du formulaire
        // Pour l'instant, on affiche juste un message
        const submitBtn = form.querySelector('.form-submit');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.disabled = true;
        
        // Simulation d'envoi
        setTimeout(() => {
          submitBtn.textContent = 'Candidature envoyée ✓';
          submitBtn.style.background = '#5a9a6a';
          
          // Reset après quelques secondes (optionnel)
          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '#6A8FB9';
            submitBtn.disabled = false;
            form.reset();
          }, 3000);
        }, 1500);
      }
    });
    
    // Reset border on focus
    const formInputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
    formInputs.forEach(input => {
      input.addEventListener('focus', function() {
        this.style.borderColor = '#6A8FB9';
      });
      input.addEventListener('blur', function() {
        if (this.value.trim()) {
          this.style.borderColor = '#e0e0e0';
        }
      });
    });
  }

  // ==================== GALLERY PAUSE ON TAB INACTIVE ====================
  const galleryTrack = document.querySelector('.gallery-track');
  
  if (galleryTrack) {
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        galleryTrack.style.animationPlayState = 'paused';
      } else {
        galleryTrack.style.animationPlayState = 'running';
      }
    });
  }

  // ==================== LAZY LOADING IMAGES (optionnel) ====================
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window && lazyImages.length > 0) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px'
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  }

});
