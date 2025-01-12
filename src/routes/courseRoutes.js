// Question: Pourquoi séparer les routes dans différents fichiers ?
// Réponse : Séparer les routes dans différents fichiers permet de mieux organiser le code, de le rendre plus lisible et de faciliter la maintenance. Cela permet également de regrouper les routes par fonctionnalité ou par module, ce qui respecte le principe de séparation des responsabilités.
// Question : Comment organiser les routes de manière cohérente ?
// Réponse: Organiser les routes de manière cohérente implique de regrouper les routes par fonctionnalité ou par module, d'utiliser des noms de chemins clairs et descriptifs, et de suivre une structure RESTful pour les méthodes HTTP.

const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// Routes pour les cours
router.get('/stats', courseController.getCourseStats);

router.post('/', courseController.createCourse);
router.get('/:id', courseController.getCourse);
router.get('/', courseController.getAllCourses);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

module.exports = router;