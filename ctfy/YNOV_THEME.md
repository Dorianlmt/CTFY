# Thème Ynov Campus Rennes - CTFY

## 🎨 Palette de couleurs

### Couleurs principales
- **Primaire** : `#1d1d1e` (Noir Ynov)
- **Secondaire** : `#23b2a4` (Turquoise Ynov)
- **Cyber** : `#5affb6` (Vert Cyber Security)

### Couleurs dérivées
- **Primaire clair** : `#2a2a2b`
- **Primaire foncé** : `#141415`
- **Secondaire clair** : `#2dd4bf`
- **Secondaire foncé** : `#0f766e`
- **Cyber clair** : `#86ffc7`
- **Cyber foncé** : `#22d3ee`

## 🎯 Utilisation

### Classes CSS disponibles

#### Couleurs de fond
```css
.ynov-bg-primary     /* Fond principal (#1d1d1e) */
.ynov-bg-secondary   /* Fond secondaire (#23b2a4) */
.ynov-bg-cyber       /* Fond cyber (#5affb6) */
```

#### Couleurs de texte
```css
.ynov-text-primary     /* Texte principal (blanc) */
.ynov-text-secondary   /* Texte secondaire (gris) */
.ynov-text-cyber       /* Texte cyber (#5affb6) */
.ynov-text-accent      /* Texte accent (#23b2a4) */
```

#### Bordures
```css
.ynov-border-cyber     /* Bordure cyber (#5affb6) */
.ynov-border-accent    /* Bordure accent (#23b2a4) */
```

#### Gradients
```css
.ynov-gradient-primary  /* Gradient principal */
.ynov-gradient-cyber    /* Gradient cyber */
.ynov-gradient-accent   /* Gradient accent */
```

#### Boutons
```css
.ynov-btn-primary      /* Bouton principal (gradient cyber) */
.ynov-btn-secondary    /* Bouton secondaire (gradient accent) */
```

#### Inputs
```css
.ynov-input            /* Input avec style Ynov */
```

#### Cartes
```css
.ynov-card             /* Carte avec style Ynov */
```

#### Badges
```css
.ynov-badge-cyber      /* Badge cyber */
.ynov-badge-accent     /* Badge accent */
```

#### Effets de survol
```css
.ynov-hover-cyber      /* Survol cyber */
.ynov-hover-accent     /* Survol accent */
```

#### Effets spéciaux
```css
.ynov-glow             /* Effet de lueur cyber */
```

## 🏫 Branding Ynov Campus Rennes

### Logo et identité
- **Logo** : "Y" dans un carré avec gradient cyber
- **Titre** : "CTFY" avec sous-titre "Ynov Campus Rennes"
- **Couleurs** : Respect de la charte graphique Ynov

### Éléments visuels
- **Icônes** : Style moderne et épuré
- **Typographie** : Geist (sans-serif moderne)
- **Espacement** : Cohérent avec le design system Ynov

## 🎨 Catégories de challenges

### Couleurs des catégories
- **Web** : Bleu (`#3b82f6`)
- **Crypto** : Violet (`#8b5cf6`)
- **Reverse** : Orange (`#f59e0b`)
- **Forensics** : Rose (`#ec4899`)
- **Pwn** : Rouge (`#ef4444`)
- **Misc** : Gris (`#6b7280`)
- **Osint** : Vert (`#10b981`)
- **Stegano** : Indigo (`#6366f1`)
- **Other** : Jaune (`#f59e0b`)

## 🚀 Mise en œuvre

### 1. Import du thème
```typescript
import "../styles/ynov-theme.css";
```

### 2. Utilisation des classes
```jsx
<div className="ynov-card">
  <h1 className="ynov-text-primary">Titre</h1>
  <p className="ynov-text-secondary">Description</p>
  <button className="ynov-btn-primary">Action</button>
</div>
```

### 3. Variables CSS personnalisées
```css
:root {
  --ynov-primary: #1d1d1e;
  --ynov-secondary: #23b2a4;
  --ynov-cyber: #5affb6;
  /* ... autres variables */
}
```

## 📱 Responsive Design

Le thème est entièrement responsive et s'adapte à tous les écrans :
- **Mobile** : < 768px
- **Tablet** : 768px - 1024px
- **Desktop** : > 1024px

## 🎯 Accessibilité

- **Contraste** : Respect des standards WCAG 2.1
- **Couleurs** : Palette accessible pour tous les utilisateurs
- **Focus** : Indicateurs visuels clairs
- **Navigation** : Structure logique et intuitive

## 🔧 Personnalisation

### Modifier les couleurs
Éditez le fichier `src/styles/ynov-theme.css` et modifiez les variables CSS :

```css
:root {
  --ynov-primary: #votre-couleur;
  --ynov-secondary: #votre-couleur;
  --ynov-cyber: #votre-couleur;
}
```

### Ajouter de nouvelles classes
```css
.votre-classe {
  background: var(--ynov-cyber);
  color: var(--ynov-primary);
  /* ... autres propriétés */
}
```

## 📚 Documentation

- **Tailwind CSS** : Framework de base
- **CSS Variables** : Système de couleurs centralisé
- **Responsive Design** : Mobile-first approach
- **Accessibility** : Standards WCAG 2.1

## 🎨 Exemples d'utilisation

### Header
```jsx
<header className="ynov-bg-primary border-b border-gray-800">
  <div className="flex items-center space-x-3">
    <div className="w-10 h-10 ynov-gradient-cyber rounded-lg flex items-center justify-center">
      <span className="text-ynov-primary font-bold text-xl">Y</span>
    </div>
    <h1 className="text-xl font-bold ynov-text-primary">CTFY</h1>
  </div>
</header>
```

### Carte de challenge
```jsx
<div className="ynov-card p-6">
  <h3 className="text-xl font-bold ynov-text-primary">{title}</h3>
  <p className="ynov-text-secondary">{description}</p>
  <span className="ynov-text-cyber font-bold">{points} pts</span>
  <button className="ynov-btn-primary">Voir le détail</button>
</div>
```

### Formulaire
```jsx
<form className="space-y-6">
  <div>
    <label className="block text-sm font-medium ynov-text-secondary mb-2">
      Titre
    </label>
    <input className="ynov-input w-full" />
  </div>
  <button type="submit" className="ynov-btn-primary">
    Créer
  </button>
</form>
```

---

**Développé pour Ynov Campus Rennes - Filière Cyber Security**  
*Mentor : Dorian*
