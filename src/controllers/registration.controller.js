const registrationService = require('../services/registration.service')
const assert = require('assert')

let registrationController = {
    createRegistration: (req, res, next) => {
        // const meal = req.body
        // console.log('Meal body: ' + req.body)

        let mealId = req.params.mealId
        let myMealId = mealId.substring(1)
        const numberMealId = parseInt(myMealId)
        console.log(numberMealId)
        console.log(mealId)
        
        registrationService.createRegistration(numberMealId, (error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                res.status(200).json({
                    status: success.status,
                    message: success.message,
                    data: success.data
                })
            }
        })
    },
    
    // Todo: Implement the update and delete methods
    deleteRegistration: (req, res, next) => {
        let mealId = req.params.mealId
        let myMealId = mealId.substring(1)
        const numberMealId = parseInt(myMealId)

        registrationService.deleteRegistration(numberMealId, (error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                res.status(200).json({
                    status: success.status,
                    message: success.message,
                    data: success.data
                })
            }
        })
    },

    getAllParticipants: (req, res, next) => {
        let mealId = req.params.mealId
        let myMealId = mealId.substring(1)
        const numberMealId = parseInt(myMealId)

        registrationService.getAllParticipants(numberMealId, (error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                res.status(200).json({
                    status: 200,
                    message: success.message,
                    data: success.data
                })
            }
        })
    },

    getParticipantById: (req, res, next) => {
        let mealId = req.params.mealId
        let myMealId = mealId.substring(1)
        const numberMealId = parseInt(myMealId)

        let participantId = req.params.participantId
        let myParticipantId = participantId.substring(1)
        const numberParticipantId = parseInt(myParticipantId)

        registrationService.getParticipantById(numberMealId, numberParticipantId, (error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                res.status(200).json({
                    status: 200,
                    message: success.message,
                    data: success.data
                })
            }
        })
    }
}

module.exports = registrationController
