# Backend pour l'Application de Gardiennage de Plantes

## Introduction

Ce projet est un backend pour une application de gardiennage de plantes. L'application permet aux utilisateurs de voir sur une carte les plantes disponibles à garder à proximité. Les utilisateurs peuvent prendre en charge des plantes, correspondre avec les propriétaires via un chat, et demander des conseils à un botaniste pour l'entretien des plantes.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants sur votre machine :

- Node.js (version 14 ou supérieure)
- npm (version 6 ou supérieure)

## Installation

1. Clonez le dépôt :

    ```bash
    git clone <URL_DU_DEPOT>
    cd <NOM_DU_DEPOT>
    ```

2. Installez les dépendances :

    ```bash
    npm install
    ```

## Configuration

Créez un fichier `.env` à la racine du projet et ajoutez les variables d'environnement suivantes :

```env
dbSecret=exemple_superSecretDb_1234_!
jwtSignSecret=exemple_superSecretToken_1234_!
PORT=8080
```

## Utilisation

Pour démarrer le serveur en mode développement, utilisez la commande suivante :

```bash
npm run dev
```

## Endpoints de l'API

### Utilisateur

- **Inscription**

    ```http
    POST /api/user/signup
    ```

- **Connexion**

    ```http
    POST /api/user/login
    ```

- **Lire un utilisateur**

    ```http
    GET /api/user/:id
    ```

- **Lire tous les utilisateurs**

    ```http
    GET /api/user
    ```

- **Mettre à jour un utilisateur**

    ```http
    PUT /api/user/:id
    ```

- **Supprimer un utilisateur**

    ```http
    DELETE /api/user/:id
    ```

### Adresse

- **Créer une adresse**

    ```http
    POST /api/address/:userId
    ```

- **Supprimer une adresse**

    ```http
    DELETE /api/address/:id
    ```

### Plante

- **Créer une plante**

    ```http
    POST /api/plant/users/:id/plants
    ```

- **Lire les plantes par coordonnées**

    ```http
    GET /api/plant/by-coordinates/:lat/:lng
    ```

- **Lire une plante par ID**

    ```http
    GET /api/plant/:plantId
    ```

- **Lire les plantes pour un gardien**

    ```http
    GET /api/plant/:userId/:addressId
    ```

- **Ajouter un gardien à une plante**

    ```http
    PUT /api/plant/:plantId/addGuardian
    ```

- **Retirer un gardien d'une plante**

    ```http
    PUT /api/plant/:plantId/removeGuardian
    ```

- **Supprimer une plante**

    ```http
    DELETE /api/plant/:id
    ```

### Commentaire

- **Créer un commentaire**

    ```http
    POST /api/comment/users/:id/plants/:plantId/comments
    ```

- **Mettre à jour un commentaire**

    ```http
    PUT /api/comment/:commentId
    ```

- **Supprimer un commentaire**

    ```http
    DELETE /api/comment/:commentId
    ```

## Authentification

L'authentification est gérée à l'aide de JSON Web Tokens (JWT). Voici le middleware d'authentification utilisé :

```javascript
const jwt = require('jsonwebtoken');
const jwtSignSecret = process.env.jwtSignSecret;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, jwtSignSecret);
    const userId = decodedToken.userId;
    const userRole = decodedToken.role;
    req.auth = { userId, userRole };
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Bad User ID';
    } else if (req.body.requiredRole && req.body.requiredRole !== userRole) {
      throw 'Role unauthorized';
    } else {
      next();
    }
  } catch (error) {
    res.status(403).json({ error: error | 'Request needs auth token' });
  }
};
```

## Prisma et Base de Données

Voici le modèle Prisma utilisé pour la base de données :

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./mainBdd.sqlite"
}

model User {
  id            Int        @id @default(autoincrement())
  email         String     @unique
  userName      String?
  password      String
  imageSrc      String?
  plantsOwned   Plant[]    @relation("OwnedPlants")
  plantsGuarded Plant[]    @relation("GuardedPlants")
  address       Address[]
  userRole      UserRole[]
  comment       Comment[]
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
}

model UserRole {
  id     Int   @id @default(autoincrement())
  User   User? @relation(fields: [userId], references: [id])
  userId Int?
  Role   Role? @relation(fields: [roleId], references: [id])
  roleId Int?
}

model Role {
  id        Int        @id @default(autoincrement())
  content   String     @unique
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  userRole  UserRole[]
}

model Plant {
  id              Int       @id @default(autoincrement())
  common_name     String
  scientific_name String
  image_url       String
  ownerId         Int
  guardianId      Int?
  addressId       Int
  owner           User      @relation("OwnedPlants", fields: [ownerId], references: [id])
  guardian        User?     @relation("GuardedPlants", fields: [guardianId], references: [id])
  address         Address   @relation(fields: [addressId], references: [id])
  comment         Comment[]
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model Address {
  id         Int      @id @default(autoincrement())
  number     Int
  street     String
  postalCode Int
  city       String
  country    String
  lat        Float
  lng        Float
  userId     Int
  user       User     @relation(fields: [userId], references: [id])
  plants     Plant[] // Relation pour représenter toutes les plantes associées à l'adresse
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model Comment {
  id        Int      @id @default(autoincrement())
  content   String
  byteImage String
  plantId   Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  User      User?    @relation(fields: [userId], references: [id])
  userId    Int?
  Plant     Plant    @relation(fields: [plantId], references: [id])
}
```

## Tests

Les tests sont configurés avec Jest. Chaque route est testée, et Husky est utilisé pour effectuer des vérifications avant chaque commit pour s'assurer que les tests passent.

Pour exécuter les tests, utilisez la commande suivante :

```bash
npm test
```

## Déploiement

Pour l'instant, il n'y a pas d'instructions spécifiques pour le déploiement. Cela sera ajouté ultérieurement.

## Contribution

Pour contribuer au projet, suivez les étapes ci-dessous :

1. Clonez le projet et installez les dépendances.
2. Créez une nouvelle branche pour vos modifications :

    ```bash
    git checkout -b <nom_de_votre_branche>
    ```

3. Faites vos modifications.
4. Ajoutez vos modifications à l'index :

    ```bash
    git add .
    ```

5. Commitez vos modifications avec un message descriptif :

    ```bash
    git commit -m "feat: <description>"
    ```

6. Rébasez votre branche avec `main` :

    ```bash
    git pull --rebase origin main
    ```

7. Résolvez les conflits si nécessaire et continuez le rebase :

    ```bash
    git rebase --continue
    ```

8. Poussez vos modifications sur votre branche :

    ```bash
    git push -u origin <nom_de_votre_branche>
    ```

9. Créez une Pull Request sur GitHub.
10. Si des modifications sont nécessaires, répétez les étapes 2 à 3 et commitez-les sans modifier le message :

    ```bash
    git commit --amend --no-edit
    ```

11. Répétez les étapes 5 à 6.
12. Poussez les modifications demandées sur votre branche :

    ```bash
    git push origin <nom_de_votre_branche> --force-with-lease
    ```

Pour plus d'informations, vous pouvez consulter cette [cheat sheet](https://quickref.me/git.html).

## Licence

Ce projet est sous licence ISC.