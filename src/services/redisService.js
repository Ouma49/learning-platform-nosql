// Question : Comment gérer efficacement le cache avec Redis ?
// Réponse : Utiliser des fonctions utilitaires pour mettre en cache et récupérer les données, gérer les TTL (time-to-live) pour les clés, et s'assurer que le client Redis est correctement initialisé.
// Question: Quelles sont les bonnes pratiques pour les clés Redis ?
// Réponse : Utiliser des noms de clés clairs et descriptifs, inclure des préfixes pour les regrouper par fonctionnalité, et gérer les TTL pour éviter une utilisation excessive de la mémoire.


const { getRedisClient } = require('../config/db');

// Fonctions utilitaires pour Redis
async function cacheData(key, data, ttl) {
  const redisClient = getRedisClient();
  
  if (!redisClient) {
    console.error("Redis client not initialized.");
    throw new Error("Redis client not initialized.");
  }


  try {
    await redisClient.setEx(key, ttl, JSON.stringify(data));
    console.log(`Data successfully cached under key ${key}`);
  } catch (error) {
    console.error("Error storing data in Redis cache:", error);
    throw new Error("Error caching data in Redis");
  }
}

// Retrieve data from cache
async function getCacheData(key) {
  const redisClient = getRedisClient();

  if (!redisClient) {
    console.error("Redis client not initialized.");
    throw new Error("Redis client not initialized.");
  }

  try {
    const cachedData = await redisClient.get(key);

    if (cachedData) {
      return JSON.parse(cachedData);
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error retrieving data from Redis cache: ${error.message}`);
    throw new Error('Error retrieving data from Redis cache');
  }
}

module.exports = {
  cacheData,
  getCacheData,
};