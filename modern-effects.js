/**
 * MY PRETTY FAMILY - Modern UI Effects
 * Scroll animations, counters, parallax, micro-interactions
 */

(function() {
  'use strict';

  // ==================== CONFIGURATION ====================
  const CONFIG = {
    revealThreshold: 0.15,
    revealRootMargin: '0px 0px -50px 0px',
    counterDuration: 2000,
    counterEasing: 'easeOutExpo',
    parallaxStrength: 0.3
  };

  // ==================== SCROLL REVEAL ====================
  function initScrollReveal() {
    // Ajouter les classes reveal aux éléments
    const revealSelectors = [
      { selector: '.section-header', class: 'reveal' },
      { selector: '.video-wrapper', class: 'reveal-scale' },
      { selector: '.testimonial', class: 'reveal' },
      { selector: '.home-testimonials-grid', class: 'reveal-stagger' },
      { selector: '.concept-block .concept-content', class: 'reveal-left' },
      { selector: '.concept-block .concept-visual', class: 'reveal-right' },
      { selector: '.configurator-block .configurator-visual', class: 'reveal-left' },
      { selector: '.configurator-block .configurator-content', class: 'reveal-right' },
      { selector: '.profiles-grid', class: 'reveal-stagger' },
      { selector: '.partner-inclus', class: 'reveal-stagger' },
      { selector: '.cta-final-inner', class: 'reveal' },
      { selector: '.features-grid', class: 'reveal-stagger' },
      { selector: '.values-grid', class: 'reveal-stagger' },
      { selector: '.reasons-grid', class: 'reveal-stagger' }
    ];

    revealSelectors.forEach(item => {
      document.querySelectorAll(item.selector).forEach(el => {
        if (!el.classList.contains('reveal') && 
            !el.classList.contains('reveal-left') && 
            !el.classList.contains('reveal-right') &&
            !el.classList.contains('reveal-scale') &&
            !el.classList.contains('reveal-stagger')) {
          el.classList.add(item.class);
        }
      });
    });

    // Observer
    const observerOptions = {
      threshold: CONFIG.revealThreshold,
      rootMargin: CONFIG.revealRootMargin
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Optionnel : arrêter d'observer après révélation
          // revealObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observer tous les éléments avec les classes reveal
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger').forEach(el => {
      revealObserver.observe(el);
    });
  }

  // ==================== ANIMATED COUNTER ====================
  function animateCounter(element, target, duration) {
    const start = 0;
    const startTime = performance.now();
    
    // Easing function
    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const current = Math.floor(start + (target - start) * easedProgress);
      
      // Formater avec espaces (250 000)
      element.textContent = current.toLocaleString('fr-FR').replace(/,/g, ' ');
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  function initCounters() {
    // Trouver les éléments avec des nombres à animer
    const counterElements = document.querySelectorAll('[data-counter]');
    
    // Aussi chercher le titre "250 000 portraits"
    const proofTitle = document.querySelector('#preuves .section-title, .section-title[data-i18n="home.proofTitle"]');
    if (proofTitle) {
      const text = proofTitle.textContent;
      const match = text.match(/(\d[\d\s]*\d)/);
      if (match) {
        const number = parseInt(match[1].replace(/\s/g, ''));
        const prefix = text.substring(0, text.indexOf(match[1]));
        const suffix = text.substring(text.indexOf(match[1]) + match[1].length);
        
        // Créer un span pour le nombre
        proofTitle.innerHTML = `${prefix}<span class="counter-animated" data-target="${number}">0</span>${suffix}`;
      }
    }

    // Observer pour déclencher l'animation
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          const target = parseInt(entry.target.getAttribute('data-target'));
          animateCounter(entry.target, target, CONFIG.counterDuration);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.counter-animated, [data-counter]').forEach(el => {
      counterObserver.observe(el);
    });
  }

  // ==================== HERO SHAPES ====================
  function initHeroShapes() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Vérifier si les shapes existent déjà
    if (hero.querySelector('.hero-shapes')) return;

    const shapesContainer = document.createElement('div');
    shapesContainer.className = 'hero-shapes';
    shapesContainer.innerHTML = `
      <div class="hero-shape"></div>
      <div class="hero-shape"></div>
      <div class="hero-shape"></div>
      <div class="hero-shape"></div>
    `;
    
    hero.insertBefore(shapesContainer, hero.firstChild);
  }

  // ==================== SCROLL INDICATOR ====================
  function initScrollIndicator() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Vérifier si l'indicateur existe déjà
    if (hero.querySelector('.scroll-indicator')) return;

    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    indicator.innerHTML = `
      <a href="#video">
        <i class="fa-solid fa-chevron-down"></i>
      </a>
    `;
    
    hero.appendChild(indicator);

    // Masquer l'indicateur au scroll
    let hidden = false;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100 && !hidden) {
        indicator.style.opacity = '0';
        indicator.style.pointerEvents = 'none';
        hidden = true;
      } else if (window.scrollY <= 100 && hidden) {
        indicator.style.opacity = '1';
        indicator.style.pointerEvents = 'auto';
        hidden = false;
      }
    }, { passive: true });
  }

  // ==================== SMOOTH PARALLAX ====================
  function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Désactiver sur mobile
    if (window.innerWidth < 768) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          const heroHeight = hero.offsetHeight;
          
          if (scrolled < heroHeight) {
            const parallaxValue = scrolled * CONFIG.parallaxStrength;
            hero.style.backgroundPositionY = `calc(50% + ${parallaxValue}px)`;
          }
          
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ==================== MAGNETIC BUTTONS ====================
  function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-white, .nav-cta');
    
    buttons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // ==================== TILT EFFECT ON CARDS ====================
  function initTiltEffect() {
    const cards = document.querySelectorAll('.home-testimonial-card, .value-card');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ==================== CURSOR GLOW EFFECT ====================
  function initCursorGlow() {
    // Créer l'élément glow
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.style.cssText = `
      position: fixed;
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(106, 143, 185, 0.15) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(glow);

    // Suivre le curseur uniquement dans certaines sections
    const glowSections = document.querySelectorAll('.section-alt, .cta-final');
    
    glowSections.forEach(section => {
      section.addEventListener('mouseenter', () => {
        glow.style.opacity = '1';
      });
      
      section.addEventListener('mouseleave', () => {
        glow.style.opacity = '0';
      });
      
      section.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
      });
    });
  }

  // ==================== NAVBAR SCROLL EFFECT ====================
  function initNavbarScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      
      // Ajouter une ombre au scroll
      if (currentScroll > 50) {
        nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
      } else {
        nav.style.boxShadow = 'none';
      }
      
      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ==================== SMOOTH ANCHOR SCROLL ====================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ==================== TYPING EFFECT (optionnel) ====================
  function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle || heroTitle.classList.contains('typed')) return;
    
    // Désactivé par défaut, décommenter pour activer
    /*
    heroTitle.classList.add('typed');
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.opacity = '1';
    
    let i = 0;
    function type() {
      if (i < text.length) {
        heroTitle.textContent += text.charAt(i);
        i++;
        setTimeout(type, 50);
      }
    }
    
    setTimeout(type, 500);
    */
  }

  // ==================== PRELOADER ====================
  function initPreloader() {
    document.body.classList.add('page-loading');
    
    window.addEventListener('load', () => {
      setTimeout(() => {
        document.body.classList.remove('page-loading');
      }, 100);
    });
  }

  // ==================== INTERSECTION OBSERVER POLYFILL CHECK ====================
  function checkIntersectionObserver() {
    if (!('IntersectionObserver' in window)) {
      // Fallback : afficher tout directement
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger').forEach(el => {
        el.classList.add('revealed');
      });
      return false;
    }
    return true;
  }

  // ==================== INIT ====================
  function init() {
    // Attendre que le DOM soit prêt
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    // Vérifier le support IntersectionObserver
    if (!checkIntersectionObserver()) {
      console.warn('IntersectionObserver not supported, animations disabled');
      return;
    }

    // Initialiser tous les effets
    initPreloader();
    initHeroShapes();
    initScrollIndicator();
    initScrollReveal();
    initCounters();
    initParallax();
    initNavbarScroll();
    initSmoothScroll();
    
    // Effets avancés (peuvent impacter les performances sur mobile)
    if (window.innerWidth > 1024) {
      initMagneticButtons();
      initTiltEffect();
      initCursorGlow();
    }

    console.log('✨ Modern UI Effects initialized');
  }

  // Lancer l'initialisation
  init();

})();