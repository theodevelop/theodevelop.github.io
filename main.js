/**
 * MY PRETTY FAMILY - Mobile Menu Controller
 * Menu mobile 3/4 écran avec overlay
 */

(function() {
  'use strict';

  // Attendre que le DOM soit prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
  } else {
    initMobileMenu();
  }

  function initMobileMenu() {
    console.log('[MPF] Initializing mobile menu...');
    
    const mobileToggle = document.querySelector('.nav-mobile-toggle');
    const navMobile = document.querySelector('.nav-mobile');
    const navMobileClose = document.querySelector('.nav-mobile-close');
    
    if (!navMobile) {
      console.warn('[MPF] .nav-mobile not found');
      return;
    }

    // Créer l'overlay s'il n'existe pas
    let overlay = document.querySelector('.nav-mobile-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'nav-mobile-overlay';
      document.body.appendChild(overlay);
      console.log('[MPF] Overlay created');
    }

    // S'assurer que le menu est fermé au démarrage
    navMobile.classList.remove('open');
    overlay.classList.remove('open');
    document.body.classList.remove('menu-open');

    /**
     * Ouvre le menu mobile
     */
    function openMenu() {
      console.log('[MPF] Opening menu');
      navMobile.classList.add('open');
      overlay.classList.add('open');
      document.body.classList.add('menu-open');
      if (mobileToggle) {
        mobileToggle.setAttribute('aria-expanded', 'true');
      }
    }

    /**
     * Ferme le menu mobile
     */
    function closeMenu() {
      console.log('[MPF] Closing menu');
      navMobile.classList.remove('open');
      overlay.classList.remove('open');
      document.body.classList.remove('menu-open');
      if (mobileToggle) {
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    }

    /**
     * Toggle le menu mobile
     */
    function toggleMenu() {
      if (navMobile.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    // Event: Burger button
    if (mobileToggle) {
      mobileToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
      });
      console.log('[MPF] Burger button listener attached');
    } else {
      console.warn('[MPF] .nav-mobile-toggle not found');
    }

    // Event: Close button
    if (navMobileClose) {
      navMobileClose.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeMenu();
      });
      console.log('[MPF] Close button listener attached');
    } else {
      console.warn('[MPF] .nav-mobile-close not found');
    }

    // Event: Overlay click
    overlay.addEventListener('click', function(e) {
      e.preventDefault();
      closeMenu();
    });

    // Event: Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navMobile.classList.contains('open')) {
        closeMenu();
      }
    });

    // Event: Close on link click
    const menuLinks = navMobile.querySelectorAll('a');
    menuLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        setTimeout(closeMenu, 150);
      });
    });

    // API publique
    window.mobileMenu = {
      open: openMenu,
      close: closeMenu,
      toggle: toggleMenu
    };

    console.log('[MPF] Mobile menu initialized successfully');
  }

})();


/**
 * MY PRETTY FAMILY - FAQ Accordion
 */
(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(function(item) {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      const icon = item.querySelector('.faq-icon');
      
      if (question && answer) {
        question.addEventListener('click', function() {
          const isOpen = item.classList.contains('open');
          
          // Fermer tous les autres
          faqItems.forEach(function(otherItem) {
            if (otherItem !== item) {
              otherItem.classList.remove('open');
              const otherAnswer = otherItem.querySelector('.faq-answer');
              const otherIcon = otherItem.querySelector('.faq-icon');
              if (otherAnswer) otherAnswer.style.maxHeight = null;
              if (otherIcon) otherIcon.textContent = '+';
            }
          });
          
          // Toggle l'item actuel
          if (!isOpen) {
            item.classList.add('open');
            answer.style.maxHeight = answer.scrollHeight + 'px';
            if (icon) icon.textContent = '−';
          } else {
            item.classList.remove('open');
            answer.style.maxHeight = null;
            if (icon) icon.textContent = '+';
          }
        });
      }
    });
  });
})();


/**
 * MY PRETTY FAMILY - Navbar Scroll Effect
 */
(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('.nav');
    
    if (nav) {
      window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
      }, { passive: true });
    }
  });
})();
