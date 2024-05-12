const database = require('../dao/inmem-db')
const db = require('../dao/mysql-db')
var logger = require('tracer').console()

const mealService = {
    create: (meal, cookId, callback) => {
        // database.addMeal(meal, (err, data) => {
        //     if (err) {
        //         callback(err, null)
        //     } else {
        //         callback(null, {
        //             message: `Meal created with id ${data.id}.`,
        //             data: data
        //         })
        //     }
        // })
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

        // database.checkUserData(user, false)
        
        db.getConnection(function (err, connection) {

            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }


            connection.query(
                'INSERT INTO `meal` (isActive, isVega, isVegan, isToTakeHome, dateTime, maxAmountOfParticipants, price, imageUrl, cookId, name, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [isActive, isVega, isVegan, isToTakeHome, dateTime, maxAmountOfParticipants, price, imageUrl, cookID, name, description],
                function (error, results, fields) {
                    connection.release()

                    if (error) {
                        logger.error(error)
                        callback(error, null)
                    } else {
                        logger.debug(results)
                        callback(null, {
                            message: `Added new meal: ${name}`,
                            data: results
                        })
                    }
                }
            )
        })
    },

    getAll: (callback) => {
        // database.getAllMeals((err, data) => {
        //     if (err) {
        //         callback(err, null)
        //     } else {
        //         console.log(data)
        //         callback(null, {
        //             message: `Found ${data.length} meals.`,
        //             data: data
        //         })
        //     }
        // })
        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            connection.query(
                'SELECT * FROM `meal`',
                // 'SELECT id, firstName, lastName FROM `user`',
                function (error, results, fields) {
                    connection.release()

                    if (error) {
                        logger.error(error)
                        callback(error, null)
                    } else {
                        logger.debug(results)
                        callback(null, {
                            message: `Found ${results.length} meals.`,
                            data: results
                        })
                    }
                }
            )
        })
    },

    getById: (mealId, callback) => {
        // database.getMealById(mealId, (err, data) => {
        //     if (err) {
        //         callback(err, null)
        //     } else {
        //         callback(null, {
        //             message: `Found meal with id ${mealId}`,
        //             data: data
        //         })
        //     }
        // })
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
                            'SELECT * FROM `meal` WHERE id = ?', [mealId],
                            function (error, results, fields) {
                                connection.release()
            
                                if (error) {
                                    logger.error(error)
                                    callback(error, null)
                                } else {
                                    logger.debug(results)
                                    callback(null, {
                                        message: `Found meal with id ${mealId} .`,
                                        data: results
                                    })
                                }
                            }
                        )
                    } else {
                        logger.debug(results)
                        callback(null, {
                            message: `The mealID: ${mealId} does not exist`,
                            data: {}
                         })
                    }
                }
            )
        })
    },

    deleteMeal: (mealId, callback) => {
        database.deleteMeal(mealId, (err, data) => {
            if (err) {
                callback(err, null)
            } else {
                callback(null, {
                    message: `Meal deleted with id ${mealId}.`,
                    data: data
                })
            }
        })
    },

    changeMeal: (meal, mealId, callback) => {
        database.changeMeal(meal, mealId, (err, data) => {
            if (err) {
                callback(err, null)
            } else {
                callback(null, {
                    message: `Meal changed with id ${mealId}.`,
                    data: data
                })
            }
        })
    }
}

module.exports = mealService
