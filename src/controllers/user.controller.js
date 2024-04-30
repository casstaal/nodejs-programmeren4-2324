const userService = require('../services/user.service')
const assert = require('assert')

let userController = {
    create: (req, res, next) => {
        const user = req.body
        //
        // Todo: Validate user input
        //
        userService.create(user, (error, success) => {
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
        // const queryField = Object.entries(req.query)

        userService.getAll((error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                // console.log(`Dit is field 1: ${queryField[0][0]} = ${queryField[0][1]}`)
                res.status(200).json({
                    status: 200,
                    message: success.message,
                    data: success.data
                })
            }
        })
    },

    getById: (req, res, next) => {
        const userId = req.params.userId
        const myUserId = userId[1]
        // console.log('userid:' + userId)
        const numberUserId = parseInt(myUserId)
        console.log('correct userid: ' + numberUserId)

        userService.getById(numberUserId, (error, success) => {
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
    deleteUser: (req, res, next) => {
        const userId = req.params.userId
        const myUserId = userId[1]

        const numberUserId = parseInt(myUserId)
        console.log('correct userid: ' + numberUserId)

        userService.deleteUser(numberUserId, (error, success) => {
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

    changeUser: (req, res, next) => {
        const userId = req.params.userId
        const myUserId = userId[1]

        const numberUserId = parseInt(myUserId)
        console.log('correct userid: ' + numberUserId)

        const user = req.body

        userService.changeUser(user, numberUserId, (error, success) => {
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

module.exports = userController
