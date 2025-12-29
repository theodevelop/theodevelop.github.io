/* ==========================================
   MY PRETTY FAMILY - Scripts
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {
  
  // ==================== MOBILE MENU ====================
  const mobileToggle = document.querySelector('.nav-mobile-toggle');
  const mobileMenu = document.querySelector('.nav-mobile');
  const mobileLinks = document.querySelectorAll('.nav-mobile-link, .nav-mobile-cta');
  const body = document.body;

  // Toggle menu
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', function() {
      const isOpen = mobileToggle.classList.contains('active');
      
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Fermer le menu quand on clique sur un lien
    mobileLinks.forEach(link => {
      link.addEventListener('click', function() {
        closeMenu();
      });
    });

    // Fermer le menu avec Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileToggle.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  function openMenu() {
    mobileToggle.classList.add('active');
    mobileToggle.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('active');
    body.classList.add('menu-open');
  }

  function closeMenu() {
    mobileToggle.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('active');
    body.classList.remove('menu-open');
  }

  // ==================== FAQ ACCORDION ====================
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    if (question) {
      question.addEventListener('click', function(e) {
        e.preventDefault();
        item.classList.toggle('open');
      });
    }
  });

  // ==================== SMOOTH SCROLL ====================
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
  
  smoothScrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href === '#' || href === '') return;
      
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        
        const nav = document.querySelector('.nav');
        const navHeight = nav ? nav.offsetHeight : 80;
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

  // ==================== NAVBAR SHADOW ON SCROLL ====================
  const nav = document.querySelector('.nav');
  
  function updateNavBackground() {
    if (nav) {
      if (window.scrollY > 50) {
        nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
      } else {
        nav.style.boxShadow = 'none';
      }
    }
  }
  
  window.addEventListener('scroll', updateNavBackground);
  updateNavBackground();

  // ==================== FORM VALIDATION ====================
  const form = document.querySelector('form');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
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
        const submitBtn = form.querySelector('.form-submit');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.disabled = true;
        
        // Simulation d'envoi (à remplacer par l'intégration réelle)
        setTimeout(() => {
          submitBtn.textContent = 'Candidature envoyée ✓';
          submitBtn.style.background = '#5a9a6a';
          
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

});