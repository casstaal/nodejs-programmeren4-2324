const { dailyfile } = require('tracer')
const validater = require('../dao/validation')
const db = require('../dao/mysql-db')
const logger = require('tracer').console()

const userService = {
    //Creates a new meal in the database
    create: (user, callback) => {
        //Sets the user values from the raw JSON body from the client request
        const firstName = user.firstName
        const lastName = user.lastName
        const isActive = true
        const emailAdress = user.emailAdress
        const password = user.password
        const phoneNumber = user.phoneNumber
        const roles = user.roles
        const street = user.street
        const city = user.city

        //Checks if the userdata, such as password, email and phonenumber is valid
        validater.checkUserData(user)
        
        //Create database connection
        db.getConnection(function (err, connection) {

            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            //Execute insert query
            connection.query(
                'INSERT INTO `user` (firstName, lastName, isActive, emailAdress, password, phoneNumber, roles, street, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [firstName, lastName, isActive, emailAdress, password, phoneNumber, roles, street, city],
                function (error, results, fields) {

                    if (error) {
                        connection.release()
                        logger.error(error)
                        callback(error, null)
                    } else {
                        const userId = results.insertId
                        //Execute select query to get the newly created user to display it in the JSON object
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

    //Gets all the users from the database
    getAll: (callback) => {
        logger.info('getAll')

        //Create database connection
        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            //Execute select query. Returns everything from the user except the password.
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

    //Gets an user by ID from the database
    getById: (userId, userIdFromToken, callback) => {

        //Create database connection
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
                            //Execute select query to get the user
                            connection.query(
                                'SELECT `id`, `firstName`, `lastName`, `isActive`, `emailAdress`, `password`, `phoneNumber`, `roles`, `street`, `city` FROM `user` WHERE id = ?', [userId],
                               
                                function (error, userResults, fields) {
                                    connection.release()
                
                                    if (error) {
                                        logger.error(error)
                                        callback(error, null)
                                    } 
                
                                    //Execute select query to get the meals from the user
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
                            //If user is no the owner of the id, then don't show the password
                            //Execute select query to get the user
                            connection.query(
                                'SELECT `id`, `firstName`, `lastName`, `isActive`, `emailAdress`, `phoneNumber`, `roles`, `street`, `city` FROM `user` WHERE id = ?', [userId],
                               
                                function (error, userResults, fields) {
                                    connection.release()
                
                                    if (error) {
                                        logger.error(error)
                                        callback(error, null)
                                    } 
                
                                    //Execute select query to get the meals from the user
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

    //Deletes an user from the database
    deleteUser: (userId, userIdFromToken, callback) => {

        //Create database connection
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
                        //If the userId passed as the user that the client wants to delete is the same as the userId from the authorization token. Than the user can be deleted.
                        if(userId === userIdFromToken) {
                            //Execute delete query
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
                            logger.debug(countResults)
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

    //Changes a user in the database
    changeUser: (user, userId, userIdFromToken, callback) => {

        //Sets the new user values from the raw JSON body from the client request
        const firstName = user.firstName
        const lastName = user.lastName
        const isActive = true
        const emailAdress = user.emailAdress
        const password = user.password
        const phoneNumber = user.phoneNumber
        const roles = user.roles
        const street = user.street
        const city = user.city

        //Checks if the password, email and phonenumber are valid
        validater.checkUserData(user)        

        //Create database connection
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
                        //If the userId passed as the user that the client wants to change is the same as the userId from the authorization token. Than the user can be changed.
                        if(userId === userIdFromToken) {
                            //Execute update query
                            connection.query(
                                'UPDATE `user` SET firstName = ?, lastName = ?, isActive = ?, emailAdress = ?, password = ?, phoneNumber = ?, roles = ?, street = ?, city = ? WHERE id = ?', [firstName, lastName, isActive, emailAdress, password, phoneNumber, roles, street, city, userId],
                                function (error, results, fields) {
                                    if (error) {
                                        connection.release()
                                        logger.error(error)
                                        callback(error, null)
                                    } else {
                                        //Execute select query to get the new user values from the database to display in the JSON object
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
                                                        status: 200,
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

    //Gets an user profile from the database
    getProfile: (userId, callback) => {
        logger.info('getProfile userId:', userId)

        //Create database connection
        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            //Execute select query to get user info from the database
            connection.query(
                'SELECT * FROM `user` WHERE id = ?',
                [userId],
                function (error, userResults, fields) {
                    connection.release()

                    if (error) {
                        logger.error(error)
                        callback(error, null)
                    } 

                    //Execute select query to get meals from the user from the database
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
                                user: userResults[0], // Assuming there's only one user with the given ID. 
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
