# 🚀 Déploiement Rapide CTFY

## Option 1: Render (Recommandé - 5 minutes)

### 1. Créer un repository GitHub
```bash
# Créer un nouveau repository sur GitHub, puis :
git remote add origin https://github.com/VOTRE_USERNAME/ctfy.git
git branch -M main
git push -u origin main
```

### 2. Déployer sur Render
1. Allez sur [render.com](https://render.com) → Sign up
2. Connectez GitHub
3. **Créer la base de données** :
   - New + → PostgreSQL
   - Name: `ctfy-db`
   - Plan: Free
   - Créer et **COPIER L'URL DE CONNEXION**

4. **Créer l'application** :
   - New + → Web Service
   - Connecter le repository `ctfy`
   - Configuration :
     - **Root Directory**: `ctfy`
     - **Build Command**: `npm install && npx prisma generate && npx prisma db push`
     - **Start Command**: `npm start`

5. **Variables d'environnement** :
   - `DATABASE_URL`: URL de la base de données (étape 3)
   - `ADMIN_TOKEN`: `admin-secret-token-2024`
   - `NODE_ENV`: `production`

6. **Déployer** → Attendre 5-10 minutes

### 3. Tester
- Votre app sera disponible à `https://ctfy-app.onrender.com`
- Testez l'inscription, connexion, challenges, admin

---

## Option 2: Vercel (Alternative)

### 1. Base de données externe
- Créez un compte [Supabase](https://supabase.com)
- Nouveau projet → Copier l'URI de connexion

### 2. Déployer sur Vercel
1. [vercel.com](https://vercel.com) → Import Project
2. Connecter GitHub → Sélectionner `ctfy`
3. Variables d'environnement :
   - `DATABASE_URL`: URI Supabase
   - `ADMIN_TOKEN`: `admin-secret-token-2024`
4. Deploy

---

## 🔧 Configuration finale

### Changer le token admin (IMPORTANT)
```bash
# Générer un token sécurisé
openssl rand -hex 32
```
Puis mettre à jour la variable `ADMIN_TOKEN` dans Render/Vercel.

### Vérifier le déploiement
- ✅ Page d'accueil s'affiche
- ✅ Inscription/connexion fonctionne
- ✅ Création d'équipe fonctionne
- ✅ Page challenges accessible
- ✅ Admin accessible avec le token
- ✅ Upload de fichiers fonctionne

---

## 🆘 Dépannage

### Erreur de build
- Vérifiez les logs dans Render
- Vérifiez que `DATABASE_URL` est correcte

### Base de données
- Vérifiez que l'URL de connexion est complète
- Vérifiez que la base de données est active

### Upload de fichiers
- Vérifiez que le dossier `public/uploads` existe
- Vérifiez les permissions

---

## 📱 Accès depuis un autre PC

Une fois déployé, votre application sera accessible depuis n'importe quel PC à l'URL fournie par Render/Vercel.

**Exemple** : `https://ctfy-app.onrender.com`

Tous les utilisateurs pourront :
- S'inscrire et se connecter
- Créer/rejoindre des équipes
- Voir les challenges
- Soumettre des flags
- Voir le classement

---

## 🎯 Prochaines étapes

1. **Personnaliser** : Modifiez les couleurs, textes, logo
2. **Challenges** : Ajoutez vos premiers challenges via l'admin
3. **Équipes** : Invitez des participants
4. **Monitoring** : Surveillez les logs et performances

**Votre CTF est prêt ! 🎉**
