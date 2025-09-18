# Guide de Déploiement CTFY

## Option 1: Render (Recommandé)

### Étape 1: Préparation du code

1. **Commitez et poussez votre code sur GitHub** :
   ```bash
   git add .
   git commit -m "Préparation pour le déploiement"
   git push origin main
   ```

### Étape 2: Création du compte Render

1. Allez sur [render.com](https://render.com)
2. Créez un compte (gratuit)
3. Connectez votre compte GitHub

### Étape 3: Création de la base de données

1. Dans le dashboard Render, cliquez sur "New +"
2. Sélectionnez "PostgreSQL"
3. Configurez :
   - **Name**: `ctfy-db`
   - **Database**: `ctfy`
   - **User**: `ctfy_user`
   - **Plan**: Free
4. Cliquez sur "Create Database"
5. **IMPORTANT** : Notez l'URL de connexion qui s'affiche

### Étape 4: Déploiement de l'application

1. Dans le dashboard Render, cliquez sur "New +"
2. Sélectionnez "Web Service"
3. Connectez votre repository GitHub
4. Sélectionnez le repository `ctfy`
5. Configurez :
   - **Name**: `ctfy-app`
   - **Environment**: `Node`
   - **Branch**: `main`
   - **Root Directory**: `ctfy`
   - **Build Command**: `npm install && npx prisma generate && npx prisma db push`
   - **Start Command**: `npm start`

### Étape 5: Variables d'environnement

Dans la section "Environment Variables", ajoutez :

- **DATABASE_URL**: L'URL de votre base de données PostgreSQL (copiée à l'étape 3)
- **ADMIN_TOKEN**: `admin-secret-token-2024` (changez-le pour la sécurité !)
- **NODE_ENV**: `production`

### Étape 6: Déploiement

1. Cliquez sur "Create Web Service"
2. Attendez que le build se termine (5-10 minutes)
3. Votre application sera disponible à l'URL fournie

## Option 2: Vercel (Alternative)

### Avantages
- Déploiement plus rapide
- Intégration GitHub excellente
- CDN global

### Inconvénients
- Nécessite une base de données externe (Supabase, PlanetScale, etc.)
- Plus complexe pour les uploads de fichiers

### Configuration Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez votre GitHub
3. Importez le projet
4. Configurez les variables d'environnement
5. Déployez !

## Option 3: Netlify

### Avantages
- Interface simple
- Déploiement continu

### Inconvénients
- Pas optimisé pour Next.js avec API routes
- Nécessite une base de données externe

## Configuration de la base de données

### Avec Render PostgreSQL

L'URL de connexion ressemble à :
```
postgresql://ctfy_user:password@dpg-xxxxx-a.oregon-postgres.render.com/ctfy
```

### Avec Supabase (Alternative)

1. Créez un compte sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Allez dans Settings > Database
4. Copiez l'URI de connexion
5. Remplacez `[YOUR-PASSWORD]` par votre mot de passe

## Vérification du déploiement

1. **Page d'accueil** : Vérifiez que la page d'accueil s'affiche
2. **Inscription** : Testez la création d'un compte
3. **Connexion** : Testez la connexion
4. **Challenges** : Vérifiez que la page challenges fonctionne
5. **Admin** : Testez l'accès admin avec le token
6. **Upload de fichiers** : Testez l'upload dans l'admin

## Maintenance

### Mises à jour

1. Modifiez votre code localement
2. Commitez et poussez sur GitHub
3. Render redéploiera automatiquement

### Sauvegarde de la base de données

Render sauvegarde automatiquement votre base de données, mais vous pouvez aussi :
1. Exporter manuellement via l'interface Render
2. Utiliser `pg_dump` pour des sauvegardes personnalisées

### Monitoring

- **Logs** : Disponibles dans le dashboard Render
- **Métriques** : CPU, mémoire, requêtes
- **Uptime** : Surveillance automatique

## Dépannage

### Erreurs communes

1. **Build failed** : Vérifiez les logs dans Render
2. **Database connection** : Vérifiez l'URL de la base de données
3. **Environment variables** : Vérifiez que toutes les variables sont définies
4. **File uploads** : Vérifiez que le dossier `public/uploads` existe

### Logs utiles

```bash
# Dans Render, section "Logs"
npm install
npx prisma generate
npx prisma db push
npm run build
npm start
```

## Sécurité

### Recommandations

1. **Changez l'ADMIN_TOKEN** : Utilisez un token fort et unique
2. **HTTPS** : Render fournit automatiquement HTTPS
3. **Variables d'environnement** : Ne commitez jamais les vraies valeurs
4. **Base de données** : Limitez l'accès à la base de données

### Token admin sécurisé

Générez un token fort :
```bash
# Sur Linux/Mac
openssl rand -hex 32

# Sur Windows (PowerShell)
[System.Web.Security.Membership]::GeneratePassword(32, 0)
```

## Coûts

### Render (Gratuit)
- **Web Service** : 750 heures/mois gratuites
- **PostgreSQL** : 1 GB gratuit
- **Bandwidth** : 100 GB/mois gratuit

### Limites du plan gratuit
- L'application s'endort après 15 minutes d'inactivité
- Redémarrage en 30 secondes
- Base de données limitée à 1 GB

## Support

- **Documentation Render** : [render.com/docs](https://render.com/docs)
- **Documentation Next.js** : [nextjs.org/docs](https://nextjs.org/docs)
- **Documentation Prisma** : [prisma.io/docs](https://prisma.io/docs)
