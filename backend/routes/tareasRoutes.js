const express = require('express');
const router = express.Router();
const {
    getTareas,
    createTareas,
    updateTareas,
    deleteTareas
} = require('../controllers/tareasControllers');
const { protect } = require('../middleware/authMiddleware');

// Todas las rutas de tareas están protegidas por el middleware protect
router.route('/').get(protect, getTareas).post(protect, createTareas);
router.route('/:id').put(protect, updateTareas).delete(protect, deleteTareas);

module.exports = router;
