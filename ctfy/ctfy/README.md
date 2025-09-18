# CTFY - Capture The Flag Platform

Une plateforme CTF moderne construite avec Next.js, TypeScript, et PostgreSQL.

## Fonctionnalités

- 🔐 Authentification utilisateur (email/mot de passe)
- 👥 Gestion d'équipes avec codes d'invitation
- 🏆 Challenges organisés par catégories et difficultés
- 📊 Classement en temps réel
- 🛡️ Panel d'administration sécurisé
- 📁 Upload de fichiers pour les challenges
- 🏅 Système de points et de soumissions

## Technologies

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de données**: PostgreSQL avec Prisma ORM
- **Authentification**: bcryptjs pour le hachage des mots de passe
- **Déploiement**: Render

## Installation locale

1. Clonez le repository
2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez la base de données :
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

5. Ouvrez [http://localhost:3000](http://localhost:3000)

## Déploiement sur Render

1. Connectez votre repository GitHub à Render
2. Créez une base de données PostgreSQL sur Render
3. Configurez les variables d'environnement :
   - `DATABASE_URL` : URL de votre base de données PostgreSQL
   - `ADMIN_TOKEN` : Token d'administration (changez-le !)
   - `NODE_ENV` : production

4. Déployez !

## Configuration

### Variables d'environnement

- `DATABASE_URL` : URL de connexion à la base de données PostgreSQL
- `ADMIN_TOKEN` : Token pour accéder au panel d'administration
- `NODE_ENV` : Environnement (development/production)

### Base de données

Le schéma Prisma inclut :
- **Users** : Utilisateurs avec authentification
- **Teams** : Équipes avec codes d'invitation
- **Challenges** : Défis avec fichiers joints
- **Submissions** : Soumissions de flags

## Utilisation

1. **Inscription/Connexion** : Créez un compte ou connectez-vous
2. **Gestion d'équipe** : Créez une équipe ou rejoignez-en une avec un code
3. **Challenges** : Résolvez les défis et soumettez vos flags
4. **Classement** : Consultez le classement des équipes
5. **Administration** : Gérez les challenges et équipes (token requis)

## Structure du projet

```
ctfy/
├── src/
│   ├── app/                 # Pages Next.js
│   │   ├── api/            # API Routes
│   │   ├── admin/          # Panel d'administration
│   │   ├── challenges/     # Page des challenges
│   │   ├── leaderboard/    # Classement
│   │   └── profile/        # Profil utilisateur
│   ├── components/         # Composants réutilisables
│   └── lib/               # Utilitaires (Prisma, auth)
├── prisma/
│   └── schema.prisma      # Schéma de base de données
└── public/
    └── uploads/           # Fichiers uploadés
```

## Support

Pour toute question ou problème, consultez la documentation ou créez une issue.