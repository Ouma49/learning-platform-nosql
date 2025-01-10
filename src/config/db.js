// Question : Pourquoi créer un module séparé pour les connexions aux bases de données ?
// Réponse : Cela permet de centraliser la gestion des connexions aux bases de données, facilitant ainsi la maintenance et la réutilisation du code. Cela permet également de séparer les préoccupations, rendant le code plus modulaire et plus facile à tester.
// Question : Comment gérer proprement la fermeture des connexions ?
// Réponse : On peut gérer la fermeture des connexions en écoutant les événements de fermeture de l'application (comme process.on('SIGINT')) et en appelant les méthodes de fermeture des clients MongoDB et Redis.

const { MongoClient } = require('mongodb');
const redis = require('redis');
const config = require('./env');

let mongoClient, redisClient, db;

async function connectMongo(retries = 5) {
  try {
    console.log('Attempting to connect to MongoDB with URI:', config.MONGODB_URI);
    mongoClient = await MongoClient.connect(config.MONGODB_URI, { useUnifiedTopology: true });
    db = mongoClient.db(config.learning_platform);
    console.log('Successfully connected to MongoDB, database:', db.databaseName);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    if (retries > 0) {
      console.log(`Retrying in 5 seconds... (${retries} retries left)`);
      setTimeout(() => connectMongo(retries - 1), 5000);
    } else {
      console.log('Exhausted all retries for MongoDB');
    }
  }
}

async function connectRedis(retries = 5) {
  return new Promise((resolve, reject) => {
    console.log('Attempting to connect to Redis with URI:', config.REDIS_URI);
    redisClient = redis.createClient({
      url: config.REDIS_URI,
    });

    redisClient.on('connect', () => {
      console.log('Successfully connected to Redis');
      resolve();
    });

    redisClient.on('error', (error) => {
      console.error('Error connecting to Redis:', error);
      if (retries > 0) {
        console.log(`Retrying in 5 seconds... (${retries} retries left)`);
        setTimeout(() => connectRedis(retries - 1).then(resolve).catch(reject), 5000);
      } else {
        console.log('Exhausted all retries for Redis');
        reject(error);
      }
    });

    redisClient.connect().catch((error) => reject(error));
  });
}

// Function to close connections properly
async function closeConnections() {
  try {
    if (mongoClient) {
      await mongoClient.close();
      console.log('MongoDB connection closed');
    }
    if (redisClient) {
      await redisClient.quit();
      console.log('Redis connection closed');
    }
  } catch (error) {
    console.error('Error closing connections:', error);
  }
}

// Export functions and clients
module.exports = {
  connectMongo,
  connectRedis,
  closeConnections,
  getMongoClient: () => mongoClient,
  getRedisClient: () => redisClient,
  getDb: () => db,
};