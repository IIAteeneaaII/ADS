const express = require('express');
const router = express.Router();
const {
  createCustomHabit,
  updateHabit,
  deleteHabit
} = require('../controllers/habitController');
const { validateCreateHabit } = require('../middlewares/validateCreateHabit');

const { authMiddleware } = require('../middlewares/authMiddleware');

// Crear hábito personalizado
router.post('/personalizado', authMiddleware, createCustomHabit);

// Editar hábito
router.put('/:id', authMiddleware, updateHabit);

// Eliminar hábito
router.delete('/:id', authMiddleware, deleteHabit);


module.exports = router;
