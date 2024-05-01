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
        const queryField = Object.entries(req.query)
        // console.log('Queryfield: ' + queryField)
        // console.log(`Dit is field 1 ${queryField[0][0]} = ${queryField[0][1]}`)

        // const queryField1 = queryField[0][0]
        // const queryValue1 = queryField[0][1]
        // const queryField2 = queryField[1][0]
        // const queryValue2 = queryField[1][1]

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
                    console.log(`Dit is field 1 ${queryField[0][0]} = ${queryField[0][1]}`)
                    console.log(`Dit is field 2 ${queryField[1][0]} = ${queryField[1][1]}`)
                    const queryField1 = queryField[0][0]
                    let queryValue1 = queryField[0][1]
                    const queryField2 = queryField[1][0]
                    let queryValue2 = queryField[1][1]

                    // if (!queryField1 || !queryValue1 || queryField2 || queryValue2) {
                    //     return res.status(400).json({
                    //         status: 400,
                    //         message: 'Both field and value query parameters are required for filtering.',
                    //         data: {}
                    //     });
                    // }
                    let myBool
                    if(queryField1 === 'isActive' && (queryValue1 === 'true' || queryValue1 === 'false')) {
                        myBool = (queryValue1 === 'true')
                        queryValue1 = myBool
                    } else if(queryField1 === 'id') {
                        myBool = parseInt(queryValue1)
                        queryValue1 = myBool
                    }

                    let myBool2
                    if(queryField2 === 'isActive' && (queryValue2 === 'true' || queryValue2 === 'false')) {
                        myBool2 = (queryValue2 === 'true')
                        queryValue2 = myBool2
                    } else if(queryField2 === 'id') {
                        myBool2 = parseInt(queryValue2)
                        queryValue2 = myBool2
                    }



                    const filteredData = success.data.filter(item => item[queryField1] === queryValue1 && item[queryField2] === queryValue2)

                    if(filteredData.length === 0) {
                        res.status(200).json({
                            status: 200,
                            message: 'Er zijn geen gebruikers die aan uw zoekterm voldoen',
                            data: filteredData
                        })
                    } else {
                        res.status(200).json({
                            status: 200,
                            message: 'Gefilterd op 2 parameters',
                            data: filteredData
                        })
                    }
                } else if(queryField.length === 1) {
                    console.log(`Dit is field 1 ${queryField[0][0]} = ${queryField[0][1]}`)
                    const queryFieldLength1 = queryField[0][0]
                    let queryValueLength1 = queryField[0][1]

                    let myBool1
                    if(queryFieldLength1 === 'isActive' && (queryValueLength1 === 'true' || queryValueLength1 === 'false')) {
                        myBool1 = (queryValueLength1 === 'true')
                        queryValueLength1 = myBool1
                    } else if(queryFieldLength1 === 'id') {
                        myBool1 = parseInt(queryValueLength1)
                        queryValueLength1 = myBool1
                    }
                    
                    // if (!queryField1 || !queryValue1) {
                    //     return res.status(400).json({
                    //         status: 400,
                    //         message: 'Both field and value query parameters are required for filtering.',
                    //         data: {}
                    //     });
                    // }

                    // let myBool = (queryField[0][1] === 'true')
                    // let parameter = queryField[0][0]
                    const filteredData = success.data.filter(item => item[queryFieldLength1] === queryValueLength1)

                    if(filteredData.length === 0) {
                        res.status(200).json({
                            status: 200,
                            message: 'Er zijn geen gebruikers die aan uw zoekterm voldoen',
                            data: filteredData
                        })
                    } else {
                        res.status(200).json({
                            status: 200,
                            message: 'Gefilterd op 1 parameter',
                            data: filteredData
                        })
                    }
                    
                    
                } else if(queryField.length === 0) {
                    res.status(200).json({
                        status: 200,
                        message: 'Overzicht van alle users',
                        data: success.data
                    })
                } else {
                    res.status(200).json({
                        status: 200,
                        message: 'Er zijn geen gebruikers die aan uw zoekterm voldoen',
                        data: {}
                    })
                }

                // res.status(200).json({
                //     status: 200,
                //     message: success.message,
                //     data: success.data
                // })
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
