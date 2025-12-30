# Système de traductions i18n - My Pretty Family

## Structure des fichiers

```
/i18n/
  modules/
    nav.js            (59 lignes)   - Navigation
    footer.js         (59 lignes)   - Footer
    home.js           (1061 lignes) - Page d'accueil
    concept.js        (952 lignes)  - Page concept
    configurateur.js  (482 lignes)  - Page configurateur
    clients.js        (185 lignes)  - Page clients
    common.js         (14 lignes)   - Clés partagées
  translations.js     (38 lignes)   - Assemblage des modules
```

## Comment l'utiliser dans le HTML

### Pour TOUTES les pages (chargement complet)

```html
<!-- À la fin du body, AVANT i18n.js -->

<!-- Modules de traduction -->
<script src="./i18n/modules/nav.js"></script>
<script src="./i18n/modules/footer.js"></script>
<script src="./i18n/modules/common.js"></script>
<script src="./i18n/modules/home.js"></script>
<script src="./i18n/modules/concept.js"></script>
<script src="./i18n/modules/configurateur.js"></script>
<script src="./i18n/modules/clients.js"></script>

<!-- Assemblage -->
<script src="./i18n/translations.js"></script>

<!-- Système i18n -->
<script src="./i18n.js"></script>
```

### Chargement optimisé par page (optionnel)

Si tu veux charger uniquement les modules nécessaires :

**index.html :**
```html
<script src="./i18n/modules/nav.js"></script>
<script src="./i18n/modules/footer.js"></script>
<script src="./i18n/modules/common.js"></script>
<script src="./i18n/modules/home.js"></script>
<script src="./i18n/translations.js"></script>
<script src="./i18n.js"></script>
```

**concept.html :**
```html
<script src="./i18n/modules/nav.js"></script>
<script src="./i18n/modules/footer.js"></script>
<script src="./i18n/modules/common.js"></script>
<script src="./i18n/modules/concept.js"></script>
<script src="./i18n/translations.js"></script>
<script src="./i18n.js"></script>
```

## Avantages

1. **Modifications ciblées** - Pour modifier la page concept, je ne touche que `concept.js`
2. **Fichiers lisibles** - Chaque module fait 50-1000 lignes max
3. **Moins de risques** - Syntaxe isolée par fichier
4. **Flexibilité** - Possibilité de ne charger que ce qui est nécessaire

## Ajouter une nouvelle clé

1. Identifier le module concerné (ex: `home.js` pour index.html)
2. Ajouter la clé dans le module :
```javascript
nouvelleClé: {
  fr: "Texte français",
  en: "English text",
  it: "Testo italiano",
  es: "Texto español",
  pt: "Texto português",
  de: "Deutscher Text",
  nl: "Nederlandse tekst"
}
```
3. Utiliser dans le HTML : `data-i18n="home.nouvelleClé"`

## Ajouter une nouvelle page

1. Créer `/i18n/modules/nouvellepage.js`
2. Définir `const nouvellepageTranslations = { ... };`
3. Ajouter dans `translations.js` :
```javascript
nouvellepage: typeof nouvellepageTranslations !== 'undefined' ? nouvellepageTranslations : {},
```
4. Charger le script dans le HTML
