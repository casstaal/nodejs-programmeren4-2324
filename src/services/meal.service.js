const database = require('../dao/inmem-db')
const db = require('../dao/mysql-db')
var logger = require('tracer').console()

const mealService = {
    create: (meal, cookId, callback) => {
        
        const isActive = meal.isActive
        const isVega = meal.isVega
        const isVegan = meal.isVegan
        const isToTakeHome = meal.isToTakeHome
        const dateTime = meal.dateTime
        const maxAmountOfParticipants = meal.maxAmountOfParticipants
        const price = meal.price
        const imageUrl = meal.imageUrl
        const cookID = cookId
        const name = meal.name
        const description = meal.description
        // const allergenes = meal.allergenes
        
        db.getConnection(function (err, connection) {

            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }


            connection.query(
                'INSERT INTO `meal` (isActive, isVega, isVegan, isToTakeHome, dateTime, maxAmountOfParticipants, price, imageUrl, cookId, name, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [isActive, isVega, isVegan, isToTakeHome, dateTime, maxAmountOfParticipants, price, imageUrl, cookID, name, description],
                function (error, results, fields) {

                    if (error) {
                        connection.release()
                        logger.error(error)
                        callback(error, null)
                    } else {
                        const mealId = results.insertId

                        connection.query(
                            'SELECT * FROM `meal` WHERE id = ?', [mealId],
                            function (error, mealResults, fields) {
                                connection.release()
                                if (error) {
                                    logger.error(error)
                                    callback(error, null)
                                } else {
                                    logger.debug(mealResults[0])
                                    callback(null, {
                                        status: 201,
                                        message: `Added new meal: ${name}`,
                                        data: mealResults[0]
                                    })
                                }
                            }
                        )
                    }
                }
            )
        })
    },

    getAll: (callback) => {
        
        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            connection.query(
                //Using a LEFT JOIN to ensure that every meal is returned.
                'SELECT * FROM `meal` LEFT JOIN `user` ON meal.cookId = user.id',
                function (error, results, fields) {
                    connection.release()

                    if (error) {
                        logger.error(error)
                        callback(error, null)
                    } else {
                        //Get the results that you want to return
                        const formattedResults = results.map(meal => {
                            return {
                                id: meal.id,
                                isActive: meal.isActive,
                                isVega: meal.isVega,
                                isVegan: meal.isVegan,
                                isToTakeHome: meal.isToTakeHome,
                                dateTime: meal.dateTime,
                                maxAmountOfParticipants: meal.maxAmountOfParticipants,
                                price: meal.price,
                                imageUrl: meal.imageUrl,
                                cook: {
                                    id: meal.cookId,
                                    firstName: meal.firstName,
                                    lastName: meal.lastName,
                                    email: meal.emailAdress,
                                    phoneNumber: meal.phoneNumber,
                                    roles: meal.roles,
                                    street: meal.street,
                                    city: meal.city
                                },
                                createDate: meal.createDate,
                                updateDate: meal.updateDate,
                                name: meal.name,
                                description: meal.description,
                                allergenes: meal.allergenes
                            };
                        });
                        logger.debug(results)
                        callback(null, {
                            status: 200,
                            message: `Found ${formattedResults.length} meals.`,
                            data: formattedResults
                        })
                    }
                }
            )
        })
    },

    getById: (mealId, callback) => {
        
        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            connection.query(
                'SELECT COUNT(*) AS count FROM `meal` WHERE id = ?', [mealId],
                function (error, results, fields) {
                    connection.release()

                    if (error) {
                        logger.error(error)
                        callback(error, null)
                    } 
                    
                    //If the count is greater than 0, than the ID exists
                    if(results[0].count > 0){
                        connection.query(
                            'SELECT * FROM `meal` LEFT JOIN `user` ON meal.cookId = user.id WHERE meal.id = ?', [mealId],
                            function (error, results, fields) {
                                connection.release()
            
                                if (error) {
                                    logger.error(error)
                                    callback(error, null)
                                } else {
                                    //Get the results that you want to return
                                    const formattedResults = results.map(meal => {
                                        return {
                                            id: meal.id,
                                            isActive: meal.isActive,
                                            isVega: meal.isVega,
                                            isVegan: meal.isVegan,
                                            isToTakeHome: meal.isToTakeHome,
                                            dateTime: meal.dateTime,
                                            maxAmountOfParticipants: meal.maxAmountOfParticipants,
                                            price: meal.price,
                                            imageUrl: meal.imageUrl,
                                            cook: {
                                                id: meal.cookId,
                                                firstName: meal.firstName,
                                                lastName: meal.lastName,
                                                email: meal.emailAdress,
                                                phoneNumber: meal.phoneNumber,
                                                roles: meal.roles,
                                                street: meal.street,
                                                city: meal.city
                                            },
                                            createDate: meal.createDate,
                                            updateDate: meal.updateDate,
                                            name: meal.name,
                                            description: meal.description,
                                            allergenes: meal.allergenes
                                        };
                                    });
                                    logger.debug(results)
                                    callback(null, {
                                        status: 200,
                                        message: `Found meal with id ${mealId} .`,
                                        data: formattedResults
                                    })
                                }
                            }
                        )
                    } else {
                        logger.debug(results)
                        callback(null, {
                            status: 404,
                            message: `The meal with ID ${mealId} does not exist`,
                            data: {}
                         })
                    }
                }
            )
        })
    },

    deleteMeal: (mealId, userIdFromToken, callback) => {

        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

                        connection.query(
                            'SELECT COUNT(*) AS count FROM `meal` WHERE id = ?', [mealId],
                            function (error, results, fields) {
                                connection.release()
            
                                if (error) {
                                    logger.error(error)
                                    callback(error, null)
                                } 
                                
                                //If the count is greater than 0, than the ID exists
                                if(results[0].count > 0){
                                    connection.query(
                                        'SELECT cookId FROM `meal` WHERE id = ?', [mealId],
                                        function (error, results, fields) {
                                            connection.release()

                                            if (error) {
                                                logger.error(error)
                                                callback(error, null)
                                            }
                                            // console.log(results[0].cookId + " " + results[0].cookID + " " + userIdFromToken)
                                            if(results[0].cookId === userIdFromToken) {
                                                connection.query(
                                                    'DELETE FROM `meal` WHERE id = ?', [mealId],
                                                    function (error, results, fields) {
                                                        connection.release()
                                    
                                                        if (error) {
                                                            logger.error(error)
                                                            callback(error, null)
                                                        } else {
                                                            logger.debug(results)
                                                            callback(null, {
                                                                status: 200,
                                                                message: `Maaltijd met ID ${mealId} is verwijderd.`,
                                                                data: {}
                                                            })
                                                        }
                                                    }
                                                )
                                            } else {
                                                logger.debug(results)
                                                callback(null, {
                                                    status: 403,
                                                    message: `The user with ${userIdFromToken} doesn't have the authorization to delete this meal.`,
                                                    data: {}
                                                })
                                            }
                                        }
                                    )
                                    
                                } else {
                                    logger.debug(results)
                                    callback(null, {
                                        status: 404,
                                        message: `The meal with ID ${mealId} does not exist`,
                                        data: {}
                                     })
                                }
                            }
                        )
                    

            
        })
    }
}

module.exports = mealService
