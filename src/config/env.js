// Question: Pourquoi est-il important de valider les variables d'environnement au démarrage ?
// Réponse : Valider les variables d'environnement au démarrage permet de s'assurer que toutes les configurations nécessaires sont présentes avant que l'application ne commence à fonctionner. Cela évite des erreurs inattendues pendant l'exécution et facilite le débogage.
// Question: Que se passe-t-il si une variable requise est manquante ?
// Réponse : Si une variable requise est manquante, l'application doit lever une erreur explicative et arrêter son exécution. Cela permet de corriger le problème avant que l'application ne soit utilisée.


const dotenv = require('dotenv');
dotenv.config();

const requiredEnvVars = [
  'MONGODB_URI',
  'MONGODB_DB_NAME',
  'REDIS_URI'
];

// Validation des variables d'environnement
function validateEnv() {
   // TODO: Implémenter la validation
  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(`The following environment variables are missing: ${missingVars.join(', ')}`);
  }
}

// Appel de la fonction de validation au démarrage
validateEnv();

module.exports = {
  mongodb: {
    uri: process.env.MONGODB_URI,
    dbName: process.env.MONGODB_DB_NAME
  },
  redis: {
    uri: process.env.REDIS_URI
  },
  port: process.env.PORT || 3000
};