const express = require('express')
const router = express.Router()
const mealController = require('../controllers/meal.controller')
const assert = require('assert')

// Meal routes
router.post('/api/meal', mealController.create)
router.put('/api/meal/:mealId', mealController.changeMeal)
router.get('/api/meal', mealController.getAll)
router.get('/api/meal/:mealId', mealController.getById)
router.delete('/api/meal/:mealId', mealController.deleteMeal)

module.exports = router
