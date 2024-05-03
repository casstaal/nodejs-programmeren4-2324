const express = require('express')
const router = express.Router()
const mealController = require('../controllers/meal.controller')
const assert = require('assert')

// Meal routes
router.post('/api/meal', mealController.create)
// router.put('/api/meal/:mealId', userController.getAll)
router.get('/api/meal', mealController.getAll)
router.get('/api/meal/:mealId', mealController.getById)
// router.delete('/api/meal/:mealId'  ,userController.changeUser)

module.exports = router
