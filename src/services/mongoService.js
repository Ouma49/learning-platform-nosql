// Question: Pourquoi créer des services séparés ?
// Réponse: Créer des services séparés permet de centraliser la logique de manipulation des données, de rendre le code plus modulaire et réutilisable, et de faciliter les tests unitaires et la maintenance.

const { ObjectId } = require('mongodb');
const { getDb } = require('../config/db');

function getCollection(collectionName) {
  const db = getDb();
  if (!db) {
    throw new Error('MongoDB connection is not initialized yet.');
  }
  return db.collection(collectionName);
}

// Utility functions for MongoDB
async function findOneById(collectionName, id) {
  try {
    debugger;
    const objectId = new ObjectId(id);
    const collection = getCollection(collectionName);
    const result = await collection.findOne({ _id: objectId });
    return result;
  } catch (error) {
    throw new Error(`Error finding document in collection ${collectionName}: ${error.message}`);
  }
}

async function findOneByField(collectionName, query) {
  try {
    const collection = getCollection(collectionName);
    return await collection.findOne(query);
  } catch (error) {
    console.error(`Error finding document in ${collectionName}:`, error);
    throw error;
  }
}

async function createCourse(course) {
  try {
    const collection = getCollection('courses');
    const result = await collection.insertOne(course);
    const createdCourse = { ...course, _id: result.insertedId };
    return createdCourse;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
}

async function findAll(collectionName) {
  try {
    const collection = getCollection(collectionName);
    const result = await collection.find({}).toArray();
    return result;
  } catch (error) {
    console.error(`Error retrieving documents from collection ${collectionName}:`, error);
    throw new Error('Error retrieving data');
  }
}

async function updateOneById(collectionName, id, updatedFields) {
  try {
    const objectId = new ObjectId(id);
    const collection = getCollection(collectionName);
    const result = await collection.updateOne(
      { _id: objectId },
      { $set: updatedFields }
    );

    if (result.matchedCount === 0) {
      return null;
    }

    return await findOneById(collectionName, id);
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw new Error('Error updating data');
  }
}

async function deleteOneById(collectionName, id) {
  try {
    const objectId = new ObjectId(id);
    const collection = getCollection(collectionName);
    const result = await collection.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return null;
    }

    return true;
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw new Error('Error deleting data');
  }
}
// In mongoService.js, add this new function:
async function countDocumentsWithIds(collectionName) {
  try {
    const collection = getCollection(collectionName);
    const documents = await collection.find({}, { projection: { title: 1 } }).toArray();
    console.log('Documents:', documents);
    const titles = documents.map(doc => doc.title);
    return {
      count: documents.length,
      titleCourse: titles
    };
  } catch (error) {
    console.error(`Error counting documents in ${collectionName}:`, error);
    throw new Error('Error counting documents');
  }
}



// Export services
module.exports = {
  findOneById,
  findOneByField,
  createCourse,
  findAll,
  updateOneById,
  deleteOneById,
  countDocumentsWithIds,
};