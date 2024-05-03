const mealService = require('../services/meal.service')
const assert = require('assert')

let mealController = {
    create: (req, res, next) => {
        const meal = req.body
        //
        // Todo: Validate user input
        //
        mealService.create(meal, (error, success) => {
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

        mealService.deleteMeal(numberMealId, (error, success) => {
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

    // changeUser: (req, res, next) => {
    //     const userId = req.params.userId
    //     const myUserId = userId[1]
    //     const numberUserId = parseInt(myUserId)
    //     const user = req.body

    //     userService.changeUser(user, numberUserId, (error, success) => {
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
