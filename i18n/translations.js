/**
 * MY PRETTY FAMILY - Système de traductions multi-langues
 * Langues supportées : FR, EN, IT, ES, PT, DE, NL
 * 
 * Architecture modulaire :
 * - Chaque page/section a son propre fichier dans /i18n/modules/
 * - Ce fichier assemble tous les modules
 */

// Les modules sont chargés via des balises <script> dans le HTML
// avant ce fichier. Ils définissent :
// - navTranslations
// - footerTranslations
// - homeTranslations
// - conceptTranslations
// - fonctionnementTranslations
// - configurateurTranslations
// - candidatureTranslations
// - clientsTranslations
// - confidentialiteTranslations
// - mentionsLegalesTranslations
// - commonTranslations

const translations = {
  nav: typeof navTranslations !== 'undefined' ? navTranslations : {},
  footer: typeof footerTranslations !== 'undefined' ? footerTranslations : {},
  home: typeof homeTranslations !== 'undefined' ? homeTranslations : {},
  concept: typeof conceptTranslations !== 'undefined' ? conceptTranslations : {},
  fonctionnement: typeof fonctionnementTranslations !== 'undefined' ? fonctionnementTranslations : {},
  configurateur: typeof configurateurTranslations !== 'undefined' ? configurateurTranslations : {},
  candidature: typeof candidatureTranslations !== 'undefined' ? candidatureTranslations : {},
  clients: typeof clientsTranslations !== 'undefined' ? clientsTranslations : {},
  confidentialite: typeof confidentialiteTranslations !== 'undefined' ? confidentialiteTranslations : {},
  mentionsLegales: typeof mentionsLegalesTranslations !== 'undefined' ? mentionsLegalesTranslations : {},
  common: typeof commonTranslations !== 'undefined' ? commonTranslations : {}
};

// Expose globally
if (typeof window !== 'undefined') {
  window.translations = translations;
}

// Export for modules (Node.js)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = translations;
}
