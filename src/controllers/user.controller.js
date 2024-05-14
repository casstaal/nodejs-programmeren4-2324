const userService = require('../services/user.service')
const assert = require('assert')
const logger = require('../util/logger')


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
                res.status(201).json({
                    status: success.status,
                    message: success.message,
                    data: success.data
                })
            }
        })
    },

    getAll: (req, res, next) => {
        const queryField = Object.entries(req.query)

        userService.getAll((error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                if(queryField.length === 2) {
                    console.log(`This is field 1 ${queryField[0][0]} = ${queryField[0][1]}`)
                    console.log(`This is field 2 ${queryField[1][0]} = ${queryField[1][1]}`)
                    const queryField1 = queryField[0][0]
                    let queryValue1 = queryField[0][1]
                    const queryField2 = queryField[1][0]
                    let queryValue2 = queryField[1][1]

                    let myBool
                    // if(queryField1 === 'isActive' && (queryValue1 === 'true' || queryValue1 === 'false')) {
                    //     myBool = (queryValue1 === 'true')
                    //     queryValue1 = myBool
                    // } 
                    if(queryField1 === 'id' || queryField1 === 'isActive') {
                        myBool = parseInt(queryValue1)
                        queryValue1 = myBool
                    }

                    let myBool2
                    // if(queryField2 === 'isActive' && (queryValue2 === 'true' || queryValue2 === 'false')) {
                    //     myBool2 = (queryValue2 === 'true')
                    //     queryValue2 = myBool2
                    // }  
                    if(queryField2 === 'id' || queryField2 === 'isActive') {
                        myBool2 = parseInt(queryValue2)
                        queryValue2 = myBool2
                    }

                    const filteredData = success.data.filter(item => item[queryField1] === queryValue1 && item[queryField2] === queryValue2)

                    if(filteredData.length === 0) {
                        res.status(200).json({
                            status: 200,
                            message: 'There are no users matching your search term',
                            data: filteredData
                        })
                    } else {
                        res.status(200).json({
                            status: 200,
                            message: 'Filtered on 2 parameters: ' + queryField1 + " = " + queryValue1 + " and " + queryField2 + " = " + queryValue2,
                            data: filteredData
                        })
                    }
                } else if(queryField.length === 1) {
                    console.log(`Dit is field 1 ${queryField[0][0]} = ${queryField[0][1]}`)
                    const queryFieldLength1 = queryField[0][0]
                    let queryValueLength1 = queryField[0][1]

                    let myBool1
                    // if(queryFieldLength1 === 'isActive' && (queryValueLength1 === 'true' || queryValueLength1 === 'false')) {
                    //     myBool1 = (queryValueLength1 === 'true')
                    //     queryValueLength1 = myBool1
                    // } 
                    if(queryFieldLength1 === 'id' || queryFieldLength1 === 'isActive') {
                        myBool1 = parseInt(queryValueLength1)
                        queryValueLength1 = myBool1
                    }
                    
                    const filteredData = success.data.filter(item => item[queryFieldLength1] === queryValueLength1)

                    if(filteredData.length === 0) {
                        res.status(200).json({
                            status: 200,
                            message: 'There are no users matching your search term',
                            data: filteredData
                        })
                    } else {
                        res.status(200).json({
                            status: 200,
                            message: 'Filtered on 1 parameter: ' + queryFieldLength1 + " = " + queryValueLength1,
                            data: filteredData
                        })
                    }
                    
                    
                } else if(queryField.length === 0) {
                    res.status(200).json({
                        status: 200,
                        message: 'Overview of all users',
                        data: success.data
                    })
                } else {
                    res.status(200).json({
                        status: 200,
                        message: 'There are no users matching your search term',
                        data: {}
                    })
                }
            }
        })
    },

    getById: (req, res, next) => {
        let userId = req.params.userId
        let myUserId = userId.substring(1)
        const numberUserId = parseInt(myUserId)

        const userIdFromToken = req.userId

        userService.getById(numberUserId, userIdFromToken, (error, success) => {
            if (error) {
                return next({
                    status: 404,
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
        let userId = req.params.userId
        let myUserId = userId.substring(1)
        const numberUserId = parseInt(myUserId)

        const userIdFromToken = req.userId

        userService.deleteUser(numberUserId, userIdFromToken, (error, success) => {
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
        const myUserId = userId.substring(1)
        const numberUserId = parseInt(myUserId)
        const user = req.body

        const userIdFromToken = req.userId


        userService.changeUser(user, numberUserId, userIdFromToken, (error, success) => {
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

    getProfile: (req, res, next) => {
        const userId = req.userId
        logger.trace('getProfile for userId', userId)
        userService.getProfile(userId, (error, success) => {
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

module.exports = userController
