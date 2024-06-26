const express = require('express')
const router = express.Router()
const registrationController = require('../controllers/registration.controller')
const assert = require('assert')

// Registration routes
router.post('/api/meal/:mealId/participate', registrationController.createRegistration)
router.delete('/api/meal/:mealId/participate', registrationController.deleteRegistration)
router.get('/api/meal/:mealId/participants', registrationController.getAllParticipants)
router.get('/api/meal/:mealId/participants/:participantId', registrationController.getParticipantById)


module.exports = router
