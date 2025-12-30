/**
 * MY PRETTY FAMILY - Système de traduction i18n
 * Gère le changement de langue et la persistance
 * Version avec menu mobile 3/4 et popup langue
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
    // data-i18n pour le contenu
    const key = element.getAttribute('data-i18n');
    if (key) {
      const translation = getNestedTranslation(key, lang);
      if (translation) {
        element.innerHTML = translation;
      }
    }

    // data-i18n-placeholder pour les placeholders
    const placeholderKey = element.getAttribute('data-i18n-placeholder');
    if (placeholderKey) {
      const translation = getNestedTranslation(placeholderKey, lang);
      if (translation) {
        element.placeholder = translation;
      }
    }

    // data-i18n-title pour les attributs title
    const titleKey = element.getAttribute('data-i18n-title');
    if (titleKey) {
      const translation = getNestedTranslation(titleKey, lang);
      if (translation) {
        element.title = translation;
      }
    }
  }

  /**
   * Traduit tous les éléments de la page
   */
  function translatePage(lang) {
    const elements = document.querySelectorAll('[data-i18n], [data-i18n-placeholder], [data-i18n-title]');
    elements.forEach(el => translateElement(el, lang));

    // Mettre à jour l'attribut lang du HTML
    document.documentElement.lang = lang;

    // Mettre à jour les sélecteurs de langue
    updateLanguageSelectors(lang);
  }

  /**
   * Met à jour l'affichage des sélecteurs de langue (desktop et mobile)
   */
  function updateLanguageSelectors(lang) {
    const langData = SUPPORTED_LANGUAGES[lang];
    if (!langData) return;

    // Desktop
    const currentFlag = document.querySelector('.lang-current-flag');
    const currentCode = document.querySelector('.lang-current-code');
    if (currentFlag) currentFlag.textContent = langData.flag;
    if (currentCode) currentCode.textContent = lang.toUpperCase();

    // Desktop dropdown
    document.querySelectorAll('.lang-option').forEach(option => {
      option.classList.toggle('active', option.getAttribute('data-lang') === lang);
    });

    // Mobile toggle button
    const mobileToggleFlag = document.querySelector('.lang-mobile-toggle .lang-flag');
    const mobileToggleCurrent = document.querySelector('.lang-mobile-toggle-current');
    if (mobileToggleFlag) mobileToggleFlag.textContent = langData.flag;
    if (mobileToggleCurrent) mobileToggleCurrent.textContent = langData.name;

    // Mobile popup
    document.querySelectorAll('.lang-popup-option').forEach(option => {
      option.classList.toggle('active', option.getAttribute('data-lang') === lang);
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
   * Crée le HTML du sélecteur de langue desktop
   */
  function createDesktopLanguageSelector() {
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
   * Crée le HTML du bouton langue mobile (compact)
   */
  function createMobileLanguageButton() {
    const container = document.createElement('div');
    container.className = 'lang-selector-mobile';
    container.innerHTML = `
      <button class="lang-mobile-toggle" aria-label="Changer de langue">
        <div class="lang-mobile-toggle-content">
          <span class="lang-flag">${SUPPORTED_LANGUAGES[currentLanguage].flag}</span>
          <div class="lang-mobile-toggle-text">
            <span class="lang-mobile-toggle-label">Langue</span>
            <span class="lang-mobile-toggle-current">${SUPPORTED_LANGUAGES[currentLanguage].name}</span>
          </div>
        </div>
        <i class="fa-solid fa-chevron-right lang-mobile-toggle-arrow"></i>
      </button>
    `;
    return container;
  }

  /**
   * Crée le popup de sélection de langue (mobile)
   */
  function createLanguagePopup() {
    const popup = document.createElement('div');
    popup.className = 'lang-popup-overlay';
    popup.id = 'langPopup';
    popup.innerHTML = `
      <div class="lang-popup">
        <div class="lang-popup-handle"><span></span></div>
        <div class="lang-popup-header">
          <h3 class="lang-popup-title" data-i18n="nav.popupChoisirLangue">Choisir la langue</h3>
          <button class="lang-popup-close" aria-label="Fermer">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="lang-popup-list">
          ${Object.entries(SUPPORTED_LANGUAGES).map(([code, data]) => `
            <button class="lang-popup-option ${code === currentLanguage ? 'active' : ''}" data-lang="${code}">
              <span class="lang-flag">${data.flag}</span>
              <div class="lang-popup-option-info">
                <span class="lang-popup-option-name">${data.name}</span>
                <span class="lang-popup-option-code">${code.toUpperCase()}</span>
              </div>
              <span class="lang-popup-option-check">
                <i class="fa-solid fa-check"></i>
              </span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    return popup;
  }

  /**
   * Ouvre le popup de langue
   */
  function openLanguagePopup() {
    const popup = document.getElementById('langPopup');
    if (popup) {
      popup.classList.add('open');
      document.body.classList.add('lang-popup-open');
    }
  }

  /**
   * Ferme le popup de langue
   */
  function closeLanguagePopup() {
    const popup = document.getElementById('langPopup');
    if (popup) {
      popup.classList.remove('open');
      document.body.classList.remove('lang-popup-open');
    }
  }

  /**
   * Injecte les sélecteurs de langue
   */
  function injectLanguageSelectors() {
    // Desktop nav
    const navLinks = document.querySelector('.nav-links');
    if (navLinks && !navLinks.querySelector('.lang-selector')) {
      const selector = createDesktopLanguageSelector();
      navLinks.appendChild(selector);
    }

    // Mobile nav - Bouton compact
    const mobileContent = document.querySelector('.nav-mobile-content');
    if (mobileContent && !mobileContent.querySelector('.lang-selector-mobile')) {
      const mobileButton = createMobileLanguageButton();
      mobileContent.appendChild(mobileButton);
    }

    // Popup langue (ajouté au body)
    if (!document.getElementById('langPopup')) {
      const popup = createLanguagePopup();
      document.body.appendChild(popup);
    }
  }

  /**
   * Initialise les événements des sélecteurs
   */
  function initLanguageSelectorEvents() {
    document.addEventListener('click', function(e) {
      // Desktop toggle
      const toggle = e.target.closest('.lang-toggle');
      if (toggle) {
        e.stopPropagation();
        const dropdown = toggle.nextElementSibling;
        const isOpen = toggle.classList.contains('open');
        
        // Fermer tous
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

      // Desktop option
      const option = e.target.closest('.lang-option');
      if (option) {
        const lang = option.getAttribute('data-lang');
        setLanguage(lang);
        
        // Fermer dropdown
        document.querySelectorAll('.lang-toggle').forEach(t => {
          t.classList.remove('open');
          t.setAttribute('aria-expanded', 'false');
        });
        document.querySelectorAll('.lang-dropdown').forEach(d => d.classList.remove('open'));
        return;
      }

      // Mobile toggle - ouvrir popup
      const mobileToggle = e.target.closest('.lang-mobile-toggle');
      if (mobileToggle) {
        e.stopPropagation();
        openLanguagePopup();
        return;
      }

      // Popup close button
      const popupClose = e.target.closest('.lang-popup-close');
      if (popupClose) {
        closeLanguagePopup();
        return;
      }

      // Popup option
      const popupOption = e.target.closest('.lang-popup-option');
      if (popupOption) {
        const lang = popupOption.getAttribute('data-lang');
        setLanguage(lang);
        closeLanguagePopup();
        return;
      }

      // Clic sur overlay du popup
      const popupOverlay = e.target.closest('.lang-popup-overlay');
      if (popupOverlay && e.target === popupOverlay) {
        closeLanguagePopup();
        return;
      }

      // Clic ailleurs - fermer dropdown desktop
      document.querySelectorAll('.lang-toggle').forEach(t => {
        t.classList.remove('open');
        t.setAttribute('aria-expanded', 'false');
      });
      document.querySelectorAll('.lang-dropdown').forEach(d => d.classList.remove('open'));
    });

    // Escape pour fermer
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        // Fermer dropdown desktop
        document.querySelectorAll('.lang-toggle').forEach(t => {
          t.classList.remove('open');
          t.setAttribute('aria-expanded', 'false');
        });
        document.querySelectorAll('.lang-dropdown').forEach(d => d.classList.remove('open'));
        
        // Fermer popup mobile
        closeLanguagePopup();
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

    // Injecter les sélecteurs
    injectLanguageSelectors();

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
    getSupportedLanguages: () => ({ ...SUPPORTED_LANGUAGES }),
    openLanguagePopup: openLanguagePopup,
    closeLanguagePopup: closeLanguagePopup
  };

  // Lancer l'initialisation
  init();

})();
