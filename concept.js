/**
 * MY PRETTY FAMILY - Page Concept Modern Effects
 * Scroll animations, tilt effect, counters
 */

(function() {
  'use strict';

  // ==================== SCROLL REVEAL FOR FORMULES ====================
  function initFormuleReveal() {
    const formuleBlocks = document.querySelectorAll('.formule-block');
    
    if (!formuleBlocks.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    });

    formuleBlocks.forEach(block => {
      observer.observe(block);
    });
  }

  // ==================== 3D TILT EFFECT ON ADN CARDS ====================
  function initTiltEffect() {
    const cards = document.querySelectorAll('.adn-card');
    
    if (!cards.length || window.innerWidth < 1024) return;

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;
        
        card.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ==================== ANIMATE SECTIONS ON SCROLL ====================
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.section-header, .not-grid, .compare-table-wrapper');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-on-scroll', 'visible');
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -30px 0px'
    });

    animatedElements.forEach(el => {
      el.classList.add('animate-on-scroll');
      observer.observe(el);
    });
  }

  // ==================== PARALLAX ON FORMULE IMAGES ====================
  function initParallaxImages() {
    const images = document.querySelectorAll('.formule-image');
    
    if (!images.length || window.innerWidth < 1024) return;

    window.addEventListener('scroll', () => {
      images.forEach(img => {
        const rect = img.getBoundingClientRect();
        const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        
        if (scrollPercent > 0 && scrollPercent < 1) {
          const translateY = (scrollPercent - 0.5) * 30;
          img.style.transform = `translateY(${translateY}px)`;
        }
      });
    }, { passive: true });
  }

  // ==================== TABLE ROW COUNTER ====================
  function initTableAnimations() {
    const table = document.querySelector('.compare-table');
    if (!table) return;

    // Ajouter un effet de surlignage sur la colonne au hover
    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      cells.forEach((cell, index) => {
        cell.addEventListener('mouseenter', () => {
          // Surligner toute la colonne
          const allRows = table.querySelectorAll('tr');
          allRows.forEach(r => {
            const targetCell = r.children[index];
            if (targetCell) {
              targetCell.classList.add('column-hover');
            }
          });
        });
        
        cell.addEventListener('mouseleave', () => {
          table.querySelectorAll('.column-hover').forEach(c => {
            c.classList.remove('column-hover');
          });
        });
      });
    });
  }

  // ==================== SMOOTH ANCHOR LINKS ====================
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

  // ==================== ADN CARDS STAGGER ON SCROLL ====================
  function initAdnCardsReveal() {
    const adnGrid = document.querySelector('.adn-grid');
    if (!adnGrid) return;

    const cards = adnGrid.querySelectorAll('.adn-card');
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        cards.forEach((card, index) => {
          card.style.animationDelay = `${0.1 + index * 0.15}s`;
          card.style.animationPlayState = 'running';
        });
        observer.unobserve(adnGrid);
      }
    }, {
      threshold: 0.2
    });

    // Pause initial des animations
    cards.forEach(card => {
      card.style.animationPlayState = 'paused';
    });

    observer.observe(adnGrid);
  }

  // ==================== BADGE INTERACTION ====================
  function initBadgeEffects() {
    const badges = document.querySelectorAll('.formule-badge, .compare-badge');
    
    badges.forEach(badge => {
      badge.addEventListener('mouseenter', () => {
        badge.style.transform = 'scale(1.1)';
      });
      
      badge.addEventListener('mouseleave', () => {
        badge.style.transform = '';
      });
    });
  }

  // ==================== CURSOR FOLLOWER ON CTA ====================
  function initCtaCursorEffect() {
    const cta = document.querySelector('.cta-final');
    if (!cta || window.innerWidth < 1024) return;

    const glow = document.createElement('div');
    glow.style.cssText = `
      position: absolute;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
      transform: translate(-50%, -50%);
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    cta.style.position = 'relative';
    cta.appendChild(glow);

    cta.addEventListener('mouseenter', () => {
      glow.style.opacity = '1';
    });

    cta.addEventListener('mouseleave', () => {
      glow.style.opacity = '0';
    });

    cta.addEventListener('mousemove', (e) => {
      const rect = cta.getBoundingClientRect();
      glow.style.left = (e.clientX - rect.left) + 'px';
      glow.style.top = (e.clientY - rect.top) + 'px';
    });
  }

  // ==================== INIT ====================
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    // Vérifier si on est sur la page concept
    if (!document.querySelector('.page-hero') || !document.querySelector('.adn-grid')) {
      return;
    }

    initFormuleReveal();
    initScrollAnimations();
    initSmoothScroll();
    initAdnCardsReveal();
    initBadgeEffects();

    // Effets avancés uniquement sur desktop
    if (window.innerWidth >= 1024) {
      initTiltEffect();
      initParallaxImages();
      initTableAnimations();
      initCtaCursorEffect();
    }

    console.log('✨ Concept page effects initialized');
  }

  init();

})();