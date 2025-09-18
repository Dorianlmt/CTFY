# 🌐 Déploiement Netlify pour CTFY

## ⚠️ Important : Limitations Netlify

Netlify ne supporte **PAS** les API routes Next.js. Vous avez 3 options :

## Option 1: Netlify + Vercel Backend (Recommandé)

### Étape 1: Déployer le backend sur Vercel

1. **Créez un nouveau repository** pour le backend :
   ```bash
   mkdir ctfy-backend
   cd ctfy-backend
   # Copiez tous les fichiers sauf les pages frontend
   ```

2. **Déployez sur Vercel** :
   - Allez sur [vercel.com](https://vercel.com)
   - Importez le repository backend
   - Configurez les variables d'environnement
   - Notez l'URL : `https://ctfy-backend.vercel.app`

### Étape 2: Configurer le frontend pour Netlify

1. **Modifiez `next.config.js`** :
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     trailingSlash: true,
     images: { unoptimized: true },
     async redirects() {
       return [{
         source: '/api/:path*',
         destination: 'https://ctfy-backend.vercel.app/api/:path*',
         permanent: false,
       }]
     },
   }
   module.exports = nextConfig
   ```

2. **Modifiez `package.json`** :
   ```json
   {
     "scripts": {
       "build": "next build",
       "export": "next export",
       "build:netlify": "next build && next export"
     }
   }
   ```

### Étape 3: Déployer sur Netlify

1. **Allez sur [netlify.com](https://netlify.com)**
2. **Connectez votre GitHub**
3. **Sélectionnez le repository** `ctfy`
4. **Configuration** :
   - **Build command**: `npm run build:netlify`
   - **Publish directory**: `out`
   - **Node version**: `18`

5. **Variables d'environnement** :
   - `NEXT_PUBLIC_API_URL`: `https://ctfy-backend.vercel.app`

6. **Déployez !**

---

## Option 2: Netlify + Supabase

### Étape 1: Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez l'URL et l'API key

### Étape 2: Migrer les API vers Supabase Functions

1. **Créez les Edge Functions** dans Supabase :
   ```bash
   # Dans votre projet Supabase
   supabase functions new auth
   supabase functions new challenges
   supabase functions new teams
   supabase functions new submissions
   supabase functions new upload
   ```

2. **Copiez le code des API routes** dans les fonctions Supabase

### Étape 3: Configurer Netlify

1. **Utilisez `netlify-supabase.toml`**
2. **Déployez sur Netlify**

---

## Option 3: Netlify + Serverless Functions

### Étape 1: Convertir en Serverless Functions

1. **Créez un dossier `netlify/functions/`**
2. **Convertissez vos API routes** en fonctions Netlify
3. **Utilisez `netlify.toml`** pour la configuration

### Exemple de fonction Netlify :

```javascript
// netlify/functions/auth.js
exports.handler = async (event, context) => {
  // Votre logique d'authentification
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Success' })
  }
}
```

---

## 🔧 Configuration finale

### Variables d'environnement Netlify

- `NEXT_PUBLIC_API_URL`: URL de votre backend
- `NEXT_PUBLIC_SUPABASE_URL`: URL Supabase (si utilisé)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Clé publique Supabase

### Fichiers de configuration

- `netlify.toml` - Configuration Netlify
- `next.config.netlify.js` - Configuration Next.js pour Netlify
- `package.netlify.json` - Dépendances optimisées

---

## 🚀 Avantages Netlify

- ✅ **CDN global** - Chargement rapide partout
- ✅ **Déploiement continu** - Mise à jour automatique
- ✅ **HTTPS automatique** - Sécurité intégrée
- ✅ **Formulaires** - Gestion des soumissions
- ✅ **Gratuit** - Plan gratuit généreux

---

## ⚠️ Inconvénients

- ❌ **Pas d'API routes** - Backend séparé requis
- ❌ **Pas de base de données** - Service externe requis
- ❌ **Upload limité** - Pas de stockage persistant
- ❌ **Complexité** - Plus de configuration

---

## 🎯 Recommandation

**Pour votre CTF, je recommande Render** car :
- ✅ API routes intégrées
- ✅ Base de données PostgreSQL incluse
- ✅ Upload de fichiers supporté
- ✅ Configuration plus simple
- ✅ Parfait pour Next.js

**Netlify est mieux pour** :
- Sites statiques
- Applications frontend uniquement
- Sites avec backend séparé

---

## 📞 Support

Si vous voulez absolument utiliser Netlify, je peux vous aider à :
1. Séparer le frontend du backend
2. Configurer les redirections
3. Migrer vers Supabase Functions
4. Optimiser pour l'export statique

**Mais Render reste la solution la plus simple pour votre CTF ! 🎯**
