const mealService = require('../services/meal.service')
const assert = require('assert')
const logger = require('../util/logger')

let mealController = {
    //Handles create meal requests.
    create: (req, res, next) => {
        //Gets the user from the raw json body
        const meal = req.body

        //Gets the userId from the token passed as the authorization header
        const userId = req.userId
        
        mealService.create(meal, userId, (error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                res.status(201).json({
                    status: 201,
                    message: success.message,
                    data: success.data
                })
            }
        })
    },

    //Handles getAll meals requests
    getAll: (req, res, next) => {

        mealService.getAll((error, success) => {
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

    //Handles get meal by id requests
    getById: (req, res, next) => {
        //Gets the id passed as a parameter key, deletes the : and makes it an integer
        let mealId = req.params.mealId
        let myMealId = mealId.substring(1)
        const numberMealId = parseInt(myMealId)

        mealService.getById(numberMealId, (error, success) => {
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
    
    //Handles delete meal requests
    deleteMeal: (req, res, next) => {
        //Gets the id passed as a parameter key, deletes the : and makes it an integer
        let mealId = req.params.mealId
        let myMealId = mealId.substring(1)
        const numberMealId = parseInt(myMealId)

        //Gets the userId from the token passed as the authorization header
        const tokenUserId = req.userId

        mealService.deleteMeal(numberMealId, tokenUserId, (error, success) => {
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
    }
}

module.exports = mealController
