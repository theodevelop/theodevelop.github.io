/**
 * MY PRETTY FAMILY - Système de traduction i18n
 * Gère le changement de langue et la persistance
 */

(function() {
  'use strict';

  // Configuration des langues supportées
  const SUPPORTED_LANGUAGES = {
    fr: { name: 'Français', flag: '🇫🇷', code: 'fr' },
    en: { name: 'English', flag: '🇬🇧', code: 'en' },
    it: { name: 'Italiano', flag: '🇮🇹', code: 'it' },
    es: { name: 'Español', flag: '🇪🇸', code: 'es' },
    pt: { name: 'Português', flag: '🇵🇹', code: 'pt' },
    de: { name: 'Deutsch', flag: '🇩🇪', code: 'de' },
    nl: { name: 'Nederlands', flag: '🇳🇱', code: 'nl' }
  };

  const DEFAULT_LANGUAGE = 'fr';
  const STORAGE_KEY = 'mpf_language';

  // État actuel
  let currentLanguage = DEFAULT_LANGUAGE;

  /**
   * Récupère la langue sauvegardée ou détecte la langue du navigateur
   */
  function getInitialLanguage() {
    // 1. Vérifier le localStorage
    const savedLang = localStorage.getItem(STORAGE_KEY);
    if (savedLang && SUPPORTED_LANGUAGES[savedLang]) {
      return savedLang;
    }

    // 2. Détecter la langue du navigateur
    const browserLang = navigator.language?.substring(0, 2).toLowerCase();
    if (browserLang && SUPPORTED_LANGUAGES[browserLang]) {
      return browserLang;
    }

    // 3. Langue par défaut
    return DEFAULT_LANGUAGE;
  }

  /**
   * Sauvegarde la langue dans le localStorage
   */
  function saveLanguage(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      console.warn('Unable to save language preference:', e);
    }
  }

  /**
   * Récupère une traduction imbriquée à partir d'un chemin (ex: "home.heroTitle")
   */
  function getNestedTranslation(path, lang) {
    if (!window.translations) {
      console.warn('Translations not loaded');
      return null;
    }

    const keys = path.split('.');
    let result = window.translations;

    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        return null;
      }
    }

    // Si on arrive à un objet de traductions par langue
    if (result && typeof result === 'object' && lang in result) {
      return result[lang];
    }

    return null;
  }

  /**
   * Traduit un élément DOM
   */
  function translateElement(element, lang) {
    const key = element.getAttribute('data-i18n');
    if (!key) return;

    const translation = getNestedTranslation(key, lang);
    if (translation) {
      // Vérifier si c'est un placeholder
      if (element.hasAttribute('placeholder')) {
        element.placeholder = translation;
      } 
      // Vérifier si c'est un attribut title
      else if (element.hasAttribute('data-i18n-attr') && element.getAttribute('data-i18n-attr') === 'title') {
        element.title = translation;
      }
      // Sinon, remplacer le contenu HTML
      else {
        element.innerHTML = translation;
      }
    }
  }

  /**
   * Traduit tous les éléments de la page
   */
  function translatePage(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => translateElement(el, lang));

    // Mettre à jour l'attribut lang du HTML
    document.documentElement.lang = lang;

    // Mettre à jour le sélecteur de langue
    updateLanguageSelector(lang);
  }

  /**
   * Met à jour l'affichage du sélecteur de langue
   */
  function updateLanguageSelector(lang) {
    const currentFlag = document.querySelector('.lang-current-flag');
    const currentCode = document.querySelector('.lang-current-code');
    
    if (currentFlag && SUPPORTED_LANGUAGES[lang]) {
      currentFlag.textContent = SUPPORTED_LANGUAGES[lang].flag;
    }
    if (currentCode && SUPPORTED_LANGUAGES[lang]) {
      currentCode.textContent = lang.toUpperCase();
    }

    // Mettre à jour l'état actif dans le dropdown
    document.querySelectorAll('.lang-option').forEach(option => {
      option.classList.remove('active');
      if (option.getAttribute('data-lang') === lang) {
        option.classList.add('active');
      }
    });
  }

  /**
   * Change la langue
   */
  function setLanguage(lang) {
    if (!SUPPORTED_LANGUAGES[lang]) {
      console.warn('Unsupported language:', lang);
      return;
    }

    currentLanguage = lang;
    saveLanguage(lang);
    translatePage(lang);

    // Émettre un événement personnalisé
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
  }

  /**
   * Crée le HTML du sélecteur de langue
   */
  function createLanguageSelector() {
    const selector = document.createElement('div');
    selector.className = 'lang-selector';
    selector.innerHTML = `
      <button class="lang-toggle" aria-label="Changer de langue" aria-expanded="false">
        <span class="lang-current-flag">${SUPPORTED_LANGUAGES[currentLanguage].flag}</span>
        <span class="lang-current-code">${currentLanguage.toUpperCase()}</span>
        <i class="fa-solid fa-chevron-down lang-arrow"></i>
      </button>
      <div class="lang-dropdown">
        ${Object.entries(SUPPORTED_LANGUAGES).map(([code, data]) => `
          <button class="lang-option ${code === currentLanguage ? 'active' : ''}" data-lang="${code}">
            <span class="lang-flag">${data.flag}</span>
            <span class="lang-name">${data.name}</span>
          </button>
        `).join('')}
      </div>
    `;
    return selector;
  }

  /**
   * Injecte le sélecteur de langue dans la navigation
   */
  function injectLanguageSelector() {
    // Desktop nav
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
      const selector = createLanguageSelector();
      navLinks.appendChild(selector);
    }

    // Mobile nav
    const mobileLinks = document.querySelector('.nav-mobile-links');
    if (mobileLinks) {
      const mobileSelectorContainer = document.createElement('div');
      mobileSelectorContainer.className = 'lang-selector-mobile';
      mobileSelectorContainer.innerHTML = `
        <div class="lang-mobile-grid">
          ${Object.entries(SUPPORTED_LANGUAGES).map(([code, data]) => `
            <button class="lang-mobile-option ${code === currentLanguage ? 'active' : ''}" data-lang="${code}">
              <span class="lang-flag">${data.flag}</span>
              <span class="lang-code">${code.toUpperCase()}</span>
            </button>
          `).join('')}
        </div>
      `;
      mobileLinks.appendChild(mobileSelectorContainer);
    }
  }

  /**
   * Initialise les événements du sélecteur
   */
  function initLanguageSelectorEvents() {
    // Desktop toggle
    document.addEventListener('click', function(e) {
      const toggle = e.target.closest('.lang-toggle');
      const dropdown = document.querySelector('.lang-dropdown');
      
      if (toggle) {
        e.stopPropagation();
        const isOpen = toggle.classList.contains('open');
        
        // Fermer tous les dropdowns
        document.querySelectorAll('.lang-toggle').forEach(t => t.classList.remove('open'));
        document.querySelectorAll('.lang-dropdown').forEach(d => d.classList.remove('open'));
        
        if (!isOpen) {
          toggle.classList.add('open');
          toggle.setAttribute('aria-expanded', 'true');
          if (dropdown) dropdown.classList.add('open');
        } else {
          toggle.setAttribute('aria-expanded', 'false');
        }
        return;
      }

      // Sélection d'une langue (desktop)
      const option = e.target.closest('.lang-option');
      if (option) {
        const lang = option.getAttribute('data-lang');
        setLanguage(lang);
        
        // Fermer le dropdown
        document.querySelectorAll('.lang-toggle').forEach(t => {
          t.classList.remove('open');
          t.setAttribute('aria-expanded', 'false');
        });
        document.querySelectorAll('.lang-dropdown').forEach(d => d.classList.remove('open'));
        return;
      }

      // Sélection d'une langue (mobile)
      const mobileOption = e.target.closest('.lang-mobile-option');
      if (mobileOption) {
        const lang = mobileOption.getAttribute('data-lang');
        setLanguage(lang);
        
        // Mettre à jour l'état actif mobile
        document.querySelectorAll('.lang-mobile-option').forEach(opt => opt.classList.remove('active'));
        mobileOption.classList.add('active');
        return;
      }

      // Clic ailleurs - fermer le dropdown
      document.querySelectorAll('.lang-toggle').forEach(t => {
        t.classList.remove('open');
        t.setAttribute('aria-expanded', 'false');
      });
      document.querySelectorAll('.lang-dropdown').forEach(d => d.classList.remove('open'));
    });

    // Fermer avec Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.lang-toggle').forEach(t => {
          t.classList.remove('open');
          t.setAttribute('aria-expanded', 'false');
        });
        document.querySelectorAll('.lang-dropdown').forEach(d => d.classList.remove('open'));
      }
    });
  }

  /**
   * Initialisation principale
   */
  function init() {
    // Attendre que le DOM soit prêt
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    // Récupérer la langue initiale
    currentLanguage = getInitialLanguage();

    // Injecter le sélecteur
    injectLanguageSelector();

    // Initialiser les événements
    initLanguageSelectorEvents();

    // Traduire la page
    translatePage(currentLanguage);
  }

  // API publique
  window.i18n = {
    setLanguage: setLanguage,
    getCurrentLanguage: () => currentLanguage,
    translate: (key) => getNestedTranslation(key, currentLanguage),
    getSupportedLanguages: () => ({ ...SUPPORTED_LANGUAGES })
  };

  // Lancer l'initialisation
  init();

})();