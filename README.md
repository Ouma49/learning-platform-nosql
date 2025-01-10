# Projet de Backend pour une Plateforme d'Apprentissage en Ligne

Ce projet consiste à créer une API backend pour une plateforme d'apprentissage en ligne. Le code est structuré de manière modulaire pour faciliter la maintenance et l'évolution du projet. Cette API utilise MongoDB pour la gestion des données et Redis pour la gestion du cache.

###  Questions / Réponses :

**Question** : Pourquoi créer un module séparé pour les connexions aux bases de données ?

**Réponse** : Cela permet de centraliser la gestion des connexions aux bases de données, facilitant ainsi la maintenance et la réutilisation du code. Cela permet également de séparer les préoccupations, rendant le code plus modulaire et plus facile à tester.

**Question** : Comment gérer proprement la fermeture des connexions ?

**Réponse** : On  peut gérer la fermeture des connexions en écoutant les événements de fermeture de l'application (comme process.on('SIGINT')) et en appelant les méthodes de fermeture des clients MongoDB et Redis.

**Question** : Pourquoi est-il important de valider les variables d'environnement au démarrage ?

**Réponse** :  Valider les variables d'environnement au démarrage permet de s'assurer que toutes les configurations nécessaires sont présentes avant que l'application ne commence à fonctionner. Cela évite des erreurs inattendues pendant l'exécution et facilite le débogage.

**Question** : Que se passe-t-il si une variable requise est manquante ?

**Réponse** :  Si une variable requise est manquante, l'application doit lever une erreur explicative et arrêter son exécution. Cela permet de corriger le problème avant que l'application ne soit utilisée.



# Configuration du projet

1. Cloner le dépôt

git clone https://github.com/Ouma49/learning-platform-nosqllearning-platform-nosql

cd learning-platform-template

2. Installation des dépendances

Pour installer les dépendances nécessaires au projet, exécutez la commande suivante:

npm install

3. Lancer les services requis

    Pour démarrer la base de données MongoDB, utilisez la commande suivante :

     mongod

Pour démarrer le serveur Redis, exécutez cette commande :

    redis-server


# Structure du projet

Le projet est organisé de manière claire et logique pour faciliter son développement et sa gestion. Voici un détail des différents fichiers et dossiers :

src/
├── config/
│   ├── db.js            # Connexion MongoDB et Redis
│   └── env.js           # Chargement des variables d'environnement
├── controllers/
│   ├── userController.js # Gestion des utilisateurs
│   └── courseController.js # Gestion des cours
├── routes/
│   ├── userRoutes.js     # Routes des utilisateurs
│   └── courseRoutes.js   # Routes des cours
├── services/
│   ├── mongoService.js   # Fonctions MongoDB
│   └── redisService.js   # Gestion du cache Redis
└── app.js               # Point d'entrée principal

src/config :

    db.js : Ce fichier gère les connexions aux bases de données MongoDB et Redis.

    env.js : Il est responsable de la gestion des variables d'environnement, en les chargeant depuis le fichier .env.

src/controllers :

    courseController.js : Ce fichier contient la logique métier associée aux cours, comme la gestion de leur création, modification, et suppression.

src/routes :

    courseRoutes.js : Il définit les routes API permettant d'interagir avec les ressources liées aux cours.

src/services :

    mongoService.js : Ce service regroupe les fonctions permettant d'interagir avec MongoDB.
    
    redisService.js : Ce service est dédié aux interactions avec Redis pour gérer le cache.

src/app.js : C'est le point d'entrée de l'application. Il initialise le serveur, configure les middlewares et enregistre les routes.

.env : Ce fichier contient des informations sensibles comme les URI des bases de données et les clés API, afin de les protéger dans le code source.

package.json : Ce fichier décrit les dépendances du projet et fournit des scripts pour faciliter le développement et le déploiement.