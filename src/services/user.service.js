const { dailyfile } = require('tracer')
const database = require('../dao/inmem-db')
const db = require('../dao/mysql-db')
const logger = require('tracer').console()
// const logger = require('../util/logger')
const assert = require('assert')


const userService = {
    create: (user, callback) => {
        const firstName = user.firstName
        const lastName = user.lastName
        const isActive = true
        const emailAdress = user.emailAdress
        const password = user.password
        const phoneNumber = user.phoneNumber
        const roles = user.roles
        const street = user.street
        const city = user.city

        database.checkUserData(user)
        
        db.getConnection(function (err, connection) {

            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            connection.query(
                'INSERT INTO `user` (firstName, lastName, isActive, emailAdress, password, phoneNumber, roles, street, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [firstName, lastName, isActive, emailAdress, password, phoneNumber, roles, street, city],
                function (error, results, fields) {

                    if (error) {
                        connection.release()
                        logger.error(error)
                        callback(error, null)
                    } else {
                        const userId = results.insertId
                        connection.query(
                            'SELECT * FROM `user` WHERE id = ?', [userId],
                            function(error, userResults, fields) {
                                connection.release()
                                if (error) {
                                    logger.error(error)
                                    callback(error, null)
                                } else {
                                    logger.debug(userResults[0])
                                    callback(null, {
                                        status: 201,
                                        message: `Added new user: ${firstName + " " + lastName} with id ${userId}`,
                                        data: userResults[0]
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
        logger.info('getAll')

        // Nieuwe manier van werken: met de MySQL database
        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            connection.query(
                'SELECT `id`, `firstName`, `lastName`, `isActive`, `emailAdress`, `phoneNumber`, `roles`, `street`, `city` FROM `user`',
                function (error, results, fields) {
                    connection.release()

                    if (error) {
                        logger.error(error)
                        callback(error, null)
                    } else {
                        logger.debug(results)
                        callback(null, {
                            status: 200,
                            message: `Found ${results.length} users.`,
                            data: results
                        })
                    }
                }
            )
        })
    },

    getById: (userId, userIdFromToken, callback) => {

        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            connection.query(
                'SELECT COUNT(*) AS count FROM `user` WHERE id = ?', [userId],
                function (error, results, fields) {
                    connection.release()

                    if (error) {
                        logger.error(error)
                        callback(error, null)
                    } 
                    
                    //If the count is greater than 0, than the ID exists
                    if(results[0].count > 0){

                        //If user is owner of the id, then show password
                        if(userId === userIdFromToken) {
                            connection.query(
                                'SELECT `id`, `firstName`, `lastName`, `isActive`, `emailAdress`, `password`, `phoneNumber`, `roles`, `street`, `city` FROM `user` WHERE id = ?', [userId],
                               
                                function (error, userResults, fields) {
                                    connection.release()
                
                                    if (error) {
                                        logger.error(error)
                                        callback(error, null)
                                    } 
                
                                    connection.query(
                                        'SELECT * FROM meal WHERE cookId = ?',
                                        [userId],
                                        function (error, mealResults, fields) {
                                            connection.release()
                        
                                            if (error) {
                                                logger.error(error)
                                                callback(error, null)
                                            } 
                                           
                                            const profileData = {
                                                user: userResults[0], // Assuming there's only one user with the given ID
                                                meals: mealResults
                                            }
                                            callback(null, {
                                                status: 200,
                                                message: `Found user and ${mealResults.length} meals for user ${userId}.`,
                                                data: profileData
                                            })
                                        }
                                    )
                                }
                            )
                        } else {
                            connection.query(
                                'SELECT `id`, `firstName`, `lastName`, `isActive`, `emailAdress`, `phoneNumber`, `roles`, `street`, `city` FROM `user` WHERE id = ?', [userId],
                               
                                function (error, userResults, fields) {
                                    connection.release()
                
                                    if (error) {
                                        logger.error(error)
                                        callback(error, null)
                                    } 
                
                                    connection.query(
                                        'SELECT * FROM meal WHERE cookId = ?',
                                        [userId],
                                        function (error, mealResults, fields) {
                                            connection.release()
                        
                                            if (error) {
                                                logger.error(error)
                                                callback(error, null)
                                            } 
                                           
                                            const profileData = {
                                                user: userResults[0], // Assuming there's only one user with the given ID
                                                meals: mealResults
                                            }
                                            callback(null, {
                                                status: 200,
                                                message: `Found user and ${mealResults.length} meals for user ${userId}.`,
                                                data: profileData
                                            })
                                        }
                                    )
                                }
                            )
                        }
                        
                    } else {
                        logger.debug(results)
                        callback(null, {
                            status: 404,
                            message: `The user with ID ${userId} does not exist`,
                            data: {}
                         })
                    }
                }
            )
        })
    },

    deleteUser: (userId, userIdFromToken, callback) => {

        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            connection.query(
                'SELECT COUNT(*) AS count FROM `user` WHERE id = ?', [userId],
                function (error, countResults, fields) {
                    connection.release()

                    if (error) {
                        logger.error(error)
                        callback(error, null)
                    } 
                    
                    //If the count is greater than 0, than the ID exists
                    if(countResults[0].count > 0){
                        if(userId === userIdFromToken) {
                            connection.query(
                                'DELETE FROM `user` WHERE id = ?', [userId],
                                function (error, deleteResults, fields) {
                                    connection.release()
                
                                    if (error) {
                                        logger.error(error)
                                        callback(error, null)
                                    } else {
                                        logger.debug(deleteResults)
                                        callback(null, {
                                            status: 200,
                                            message: `User met ID ${userId} is verwijderd.`,
                                            data: {}
                                        })
                                    }
                                }
                            )
                        } else {
                            logger.debug(deleteResults)
                            callback(null, {
                                status: 403,
                                message: `The user ${userIdFromToken} is not the owner of user ${userId}`,
                                data: {}
                            })
                        }
                        
                    } else {
                        logger.debug(countResults)
                        callback(null, {
                            status: 404,
                            message: `The user with ID ${userId} does not exist`,
                            data: {}
                         })
                    }
                }
            )
        })
    },

    changeUser: (user, userId, userIdFromToken, callback) => {

        const firstName = user.firstName
        const lastName = user.lastName
        const isActive = true
        const emailAdress = user.emailAdress
        const password = user.password
        const phoneNumber = user.phoneNumber
        const roles = user.roles
        const street = user.street
        const city = user.city

        database.checkUserData(user)        

        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            connection.query(
                'SELECT COUNT(*) AS count FROM `user` WHERE id = ?', [userId],
                function (error, results, fields) {
                    connection.release()

                    if (error) {
                        logger.error(error)
                        callback(error, null)
                    } 
                    
                    //If the count is greater than 0, than the ID exists
                    if(results[0].count > 0){

                        if(userId === userIdFromToken) {

                            connection.query(
                                'UPDATE `user` SET firstName = ?, lastName = ?, isActive = ?, emailAdress = ?, password = ?, phoneNumber = ?, roles = ?, street = ?, city = ? WHERE id = ?', [firstName, lastName, isActive, emailAdress, password, phoneNumber, roles, street, city, userId],
                                function (error, results, fields) {
                                    if (error) {
                                        connection.release()
                                        logger.error(error)
                                        callback(error, null)
                                    } else {
                                        connection.query(
                                            'SELECT * FROM `user` WHERE id = ?', [userId],
                                            function(error, userResults, fields) {
                                                connection.release()
                                                if (error) {
                                                    logger.error(error)
                                                    callback(error, null)
                                                } else {
                                                    logger.debug(userResults[0])
                                                    callback(null, {
                                                        status: 201,
                                                        message: `Updated user with id ${userId}`,
                                                        data: userResults[0]
                                                    })
                                                }
                                            }
                                            
                                        )
                                        
                                    }
                                }
                            )
                        } else {
                            logger.debug(results)
                            callback(null, {
                                status: 403,
                                message: `The user ${userIdFromToken} is not the owner of user ${userId}`,
                                data: {}
                            })
                        }
                        
                        
                    } else {
                        logger.debug(results)
                        callback(null, {
                            status: 404,
                            message: `The user with ID ${userId} does not exist`,
                            data: {}
                         })
                    }
                }
            )
        })
    },

    getProfile: (userId, callback) => {
        logger.info('getProfile userId:', userId)

        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            connection.query(
                'SELECT * FROM `user` WHERE id = ?',
                [userId],
                function (error, userResults, fields) {
                    connection.release()

                    if (error) {
                        logger.error(error)
                        callback(error, null)
                    } 

                    connection.query(
                        'SELECT * FROM meal WHERE cookId = ?',
                        [userId],
                        function (error, mealResults, fields) {
                            connection.release()
        
                            if (error) {
                                logger.error(error)
                                callback(error, null)
                            } 
                           
                            const profileData = {
                                user: userResults[0], // Assuming there's only one user with the given ID. Als het goed is kan je [0] ook weglaten
                                meals: mealResults
                            }
                            callback(null, {
                                status: 200,
                                message: `Found user and ${mealResults.length} meals for user ${userId}.`,
                                data: profileData
                            })
                        }
                    )
                }
            )

        })
    }
}

module.exports = userService
