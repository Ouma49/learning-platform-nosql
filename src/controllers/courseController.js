// Question: Quelle est la différence entre un contrôleur et une route ?
// Réponse: Un contrôleur contient la logique métier de l'application, tandis qu'une route définit les points d'entrée de l'API et délègue les requêtes aux contrôleurs appropriés.
// Question : Pourquoi séparer la logique métier des routes ?
// Réponse : Séparer la logique métier des routes permet de rendre le code plus modulaire, réutilisable et plus facile à tester. Cela permet également de maintenir une séparation claire des préoccupations.


const { ObjectId } = require('mongodb');
const db = require('../config/db');
const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');
const { findAll } = require('../services/mongoService');

// Create a Course
async function createCourse(req, res) {
  try {
    const { title, description, instructorId } = req.body;

    if (!title || !description || !instructorId) {
      return res.status(400).json({ message: 'Title, description, and instructor are required' });
    }

    const existingCourse = await mongoService.findOneByField('courses', { title });
    if (existingCourse) {
      return res.status(409).json({ message: 'A course with this title already exists.' });
    }

    const newCourse = await mongoService.createCourse({ title, description, instructorId });

    const cacheKey = `course:${newCourse._id}`;
    await redisService.cacheData(cacheKey, newCourse, 3600);

    return res.status(201).json(newCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    return res.status(500).json({ message: 'An error occurred.' });
  }
}

// Get one course
async function getCourse(req, res) {
  try {
    const { id } = req.params;
    console.log('id', id);
    const course = await mongoService.findOneById("courses",id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    return res.status(200).json(course);
  } catch (error) {
    console.error('Error retrieving course:', error);
    return res.status(500).json({ message: 'An error occurred.' });
  }
}

// Get all courses
async function getAllCourses(req, res) {
  try {
    const courses = await findAll('courses');
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error retrieving courses:', error);
    res.status(500).json({ message: 'Error retrieving courses' });
  }
}

// Update a course
async function updateCourse(req, res) {
  try {
    const { id } = req.params;
    const { title, description, instructorId } = req.body;

    if (!title && !description && !instructorId) {
      return res.status(400).json({ message: 'At least one field is required for update.' });
    }

    const updatedFields = {};
    if (title) updatedFields.title = title;
    if (description) updatedFields.description = description;
    if (instructorId) updatedFields.instructorId = instructorId;

    const updatedCourse = await mongoService.updateOneById('courses', id, updatedFields);

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    return res.status(200).json({ message: 'Course updated successfully.', updatedCourse });
  } catch (error) {
    console.error('Error updating course:', error);
    return res.status(500).json({ message: 'An error occurred.' });
  }
}

// Delete a course
async function deleteCourse(req, res) {
  try {
    const { id } = req.params;

    const deletedCourse = await mongoService.deleteOneById('courses', id);

    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    return res.status(200).json({ message: 'Course deleted successfully.' });
  } catch (error) {
    console.error('Error deleting course:', error);
    return res.status(500).json({ message: 'An error occurred.' });
  }
}


// In courseController.js, add this new function:
async function getCourseStats(req, res) {
  try {
    const result = await mongoService.countDocumentsWithIds('courses');
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error counting courses:', error);
    return res.status(500).json({ message: 'An error occurred while counting courses.' });
  }
}
// Export des contrôleurs
module.exports = {
  createCourse,
  getCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
  getCourseStats,
};