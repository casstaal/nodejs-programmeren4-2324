const express = require('express')
const router = express.Router()
const mealController = require('../controllers/meal.controller')
const assert = require('assert')
const validateToken = require('./authentication.routes').validateToken

const validateMeal = (req, res, next) => {
    let meal = req.body
    let {
        name,
        description,
        isActive,
        isVega,
        isVegan,
        isToTakeHome,
        dateTime,
        maxAmountOfParticipants,
        price,
        imageUrl,
        allergenes,
        participants
    } = meal
    try {
        assert(
            typeof name === 'string',
            'Name is missing or is not a string'
        )
        assert(
            typeof description === 'string',
            'Description is missing or is not a string'
        )
        assert(
            typeof isActive === 'number',
            'IsActive is missing or is not a number (0 = false / 1 = true)'
        )
        assert(
            typeof isVega === 'number',
            'IsVega is missing or is not a number (0 = false / 1 = true)'
        )
        assert(
            typeof isVegan === 'number',
            'IsVegan is missing or is not a number (0 = false / 1 = true)'
        )
        assert(
            typeof isToTakeHome === 'number',
            'IsToTakeHome is missing or is not a number (0 = false / 1 = true)'
        )
        assert(typeof price === 'number', 'Price is missing or is not a number')
        assert(typeof dateTime === 'string', 'DateTime is missing or is not a string')
        assert(typeof maxAmountOfParticipants === 'number', 'MaxAmountOfParticipants is missing or is not a number')
        assert(
            typeof imageUrl === 'string',
            'ImageUrl is missing or is not a string'
        )
        assert(Array.isArray(allergenes), 'Allergenes is missing or is not an array')
        // Moet als het goed is automatisch toegevoegd worden bij het aanmaken van een maaltijd
        // assert(typeof cook === 'object', 'Cook is missing or is not an object')
        // assert(Array.isArray(participants), 'Participants is missing or is not an array')
        next()
    } catch (err) {
        console.log(err)
        
        return next({
            // error wordt doorgestuurd naar de error handler in index.js
            status: 400,
            message: err.message,
            data: {}
        })
    }
}

// Meal routes
router.post('/api/meal', validateToken, validateMeal, mealController.create)
// router.put('/api/meal/:mealId', validateMeal ,mealController.changeMeal)
router.get('/api/meal', mealController.getAll)
router.get('/api/meal/:mealId', mealController.getById)
router.delete('/api/meal/:mealId', validateToken, mealController.deleteMeal)

module.exports = router
