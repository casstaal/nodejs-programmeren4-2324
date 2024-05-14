const mealService = require('../services/meal.service')
const assert = require('assert')
const logger = require('../util/logger')

let mealController = {
    create: (req, res, next) => {
        const meal = req.body
        const userId = req.userId
        //
        // Todo: Validate user input
        //
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

    getById: (req, res, next) => {
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
    
    // Todo: Implement the update and delete methods
    deleteMeal: (req, res, next) => {
        let mealId = req.params.mealId
        let myMealId = mealId.substring(1)
        const numberMealId = parseInt(myMealId)

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
    },

    // changeMeal: (req, res, next) => {
    //     const mealId = req.params.mealId
    //     const myMealId = mealId[1]
    //     const numberMealId = parseInt(myMealId)
    //     const meal = req.body

    //     mealService.changeMeal(meal, numberMealId, (error, success) => {
    //         if (error) {
    //             return next({
    //                 status: error.status,
    //                 message: error.message,
    //                 data: {}
    //             })
    //         }
    //         if (success) {
    //             res.status(200).json({
    //                 status: success.status,
    //                 message: success.message,
    //                 data: success.data
    //             })
    //         }
    //     })
    // }
}

module.exports = mealController
