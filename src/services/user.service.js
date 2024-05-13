const { dailyfile } = require('tracer')
const database = require('../dao/inmem-db')
const db = require('../dao/mysql-db')
const logger = require('tracer').console()
// const logger = require('../util/logger')
const assert = require('assert')


const userService = {
    create: (user, callback) => {
        // database.add(user, (err, data) => {
        //     if (err) {
        //         callback(err, null)
        //     } else {
        //         callback(null, {
        //             message: `User created with id ${data.id}.`,
        //             data: data
        //         })
        //     }
        // })
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

        // assert.ok(
        //     !this.checkIfEmailExists(emailAdress),
        //     'An user with this emailaddress already exists'
        // )
        // this.checkIfEmailExists(emailAdress, (err, emailExists) => {
        //     if (err) {
        //         console.error('Error: ' + err)
        //         return
        //     }
        //     console.log('Email exists: ' + emailExists)
        // })
        
        db.getConnection(function (err, connection) {

            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }


            connection.query(
                'INSERT INTO `user` (firstName, lastName, isActive, emailAdress, password, phoneNumber, roles, street, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [firstName, lastName, isActive, emailAdress, password, phoneNumber, roles, street, city],
                function (error, results, fields) {
                    connection.release()

                    if (error) {
                        logger.error(error)
                        callback(error, null)
                    } else {
                        logger.debug(results)
                        callback(null, {
                            status: 200,
                            message: `Added new user: ${firstName + " " + lastName}`,
                            data: results
                        })
                    }
                }
            )
        })
    },

    getAll: (callback) => {
        logger.info('getAll')
        // Deprecated: de 'oude' manier van werken, met de inmemory database
        // database.getAll((err, data) => {
        //     if (err) {
        //         callback(err, null)
        //     } else {
        //         console.log(data)
        //         callback(null, {
        //             message: `Found ${data.length} users.`,
        //             data: data
        //         })
        //     }
        // })
        // Nieuwe manier van werken: met de MySQL database
        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            connection.query(
                'SELECT `id`, `firstName`, `lastName`, `isActive`, `emailAdress`, `phoneNumber`, `roles`, `street`, `city` FROM `user`',
                // 'SELECT id, firstName, lastName FROM `user`',
                function (error, results, fields) {
                    connection.release()

                    if (error) {
                        logger.error(error)
                        callback(error, null)
                    } else {
                        logger.debug(results)
                        callback(null, {
                            message: `Found ${results.length} users.`,
                            data: results
                        })
                    }
                }
            )
        })
    },

    getById: (userId, callback) => {
        // database.getById(userId, (err, data) => {
        //     if (err) {
        //         callback(err, null)
        //     } else {
        //         console.log(data)
        //         callback(null, {
        //             message: `Found user with id ${userId}`,
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
                'SELECT COUNT(*) AS count FROM `user` WHERE id = ?', [userId],
                function (error, results, fields) {
                    connection.release()

                    if (error) {
                        logger.error(error)
                        callback(error, null)
                    } 
                    
                    //If the count is greater than 0, than the ID exists
                    if(results[0].count > 0){
                        connection.query(
                            'SELECT `id`, `firstName`, `lastName`, `isActive`, `emailAdress`, `phoneNumber`, `roles`, `street`, `city` FROM `user` WHERE id = ?', [userId],
                            // function (error, results, fields) {
                            //     connection.release()
            
                            //     if (error) {
                            //         logger.error(error)
                            //         callback(error, null)
                            //     } else {
                            //         logger.debug(results)
                            //         callback(null, {
                            //             message: `Found user with id ${userId} .`,
                            //             data: results
                            //         })
                            //     }
                            // }
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
                                        // else {
                                        //     logger.debug(results)
                                        //     callback(null, {
                                        //         message: `Found ${results.length} meals for user ${userId}.`,
                                        //         data: results
                                        //     })
                                        // }
                                        const profileData = {
                                            user: userResults[0], // Assuming there's only one user with the given ID
                                            meals: mealResults
                                        }
                                        callback(null, {
                                            message: `Found user and ${mealResults.length} meals for user ${userId}.`,
                                            data: profileData
                                        })
                                    }
                                )
                                
                                
                                // else {
                                //     logger.debug(results)
                                //     callback(null, {
                                //         message: `Found ${results.length} user.`,
                                //         data: results
                                //     })
                                // }
                            }
                        )
                    } else {
                        logger.debug(results)
                        callback(null, {
                            message: `The ID: ${userId} does not exist`,
                            data: {}
                         })
                    }
                }
            )
        })
    },

    deleteUser: (userId, userIdFromToken, callback) => {
        // database.delete(userId, (err, data) => {
        //     if (err) {
        //         callback(err, null)
        //     } else {
        //         callback(null, {
        //             message: `User deleted with id ${userId}.`,
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
                                            message: `Deleted user with id ${userId} .`,
                                            data: deleteResults
                                        })
                                    }
                                }
                            )
                        } else {
                            logger.debug(deleteResults)
                            callback(null, {
                                message: `The user ${userIdFromToken} is not the owner of user ${userId}`,
                                data: {}
                            })
                        }
                        
                    } else {
                        logger.debug(countResults)
                        callback(null, {
                            message: `The ID: ${userId} does not exist`,
                            data: {}
                         })
                    }
                }
            )
        })
    },

    changeUser: (user, userId, userIdFromToken, callback) => {
        // database.change(user, userId, (err, data) => {
        //     if (err) {
        //         callback(err, null)
        //     } else {
        //         callback(null, {
        //             message: `User changed with id ${userId}.`,
        //             data: data
        //         })
        //     }
        // })

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

        // const oldEmail = this.getEmailById(userId, (error, succes))
        // const newEmail = emailAdress

        // if(oldEmail === newEmail) {
        //     this.checkUserData(user, true)
        // } else {
        //     this.checkUserData(user, false)
        // }
        

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
                        // this.getEmailById(userId, function(error, oldEmail) {
                        //     if (error) {
                        //         console.error('Error: ' + error)
                        //         return
                        //     }

                        //     const newEmail = emailAdress

                        //     if(oldEmail === newEmail) {
                        //         this.checkUserData(user, true)
                        //     } else {
                        //         this.checkUserData(user, false)
                        //     }
                        // })


                        if(userId === userIdFromToken) {

                            connection.query(
                                'UPDATE `user` SET firstName = ?, lastName = ?, isActive = ?, emailAdress = ?, password = ?, phoneNumber = ?, roles = ?, street = ?, city = ? WHERE id = ?', [firstName, lastName, isActive, emailAdress, password, phoneNumber, roles, street, city, userId],
                                function (error, results, fields) {
                                    connection.release()
                
                                    if (error) {
                                        logger.error(error)
                                        callback(error, null)
                                    } else {
                                        logger.debug(results)
                                        callback(null, {
                                            message: `Updated user with ID: ${userId}`,
                                            data: results
                                        })
                                    }
                                }
                            )
                        } else {
                            logger.debug(results)
                            callback(null, {
                                message: `The user ${userIdFromToken} is not the owner of user ${userId}`,
                                data: {}
                            })
                        }
                        
                        
                    } else {
                        logger.debug(results)
                        callback(null, {
                            message: `The ID: ${userId} does not exist`,
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
                            // else {
                            //     logger.debug(results)
                            //     callback(null, {
                            //         message: `Found ${results.length} meals for user ${userId}.`,
                            //         data: results
                            //     })
                            // }
                            const profileData = {
                                user: userResults[0], // Assuming there's only one user with the given ID. Als het goed is kan je [0] ook weglaten
                                meals: mealResults
                            }
                            callback(null, {
                                message: `Found user and ${mealResults.length} meals for user ${userId}.`,
                                data: profileData
                            })
                        }
                    )
                    
                    
                    // else {
                    //     logger.debug(results)
                    //     callback(null, {
                    //         message: `Found ${results.length} user.`,
                    //         data: results
                    //     })
                    // }
                }
            )

        })
    }

    // checkIfEmailExists(emailaddress, callback) {
    //     try {
    //         db.getConnection(function (err, connection) {
    //             if (err) {
    //                 logger.error(err)
    //                 callback(err, null)
    //                 return
    //             }
    
    //             connection.query(
    //                 'SELECT COUNT(*) AS count FROM `user` WHERE emailAdress = ?', [emailaddress],
    //                 function (error, results, fields) {
    //                     connection.release()
    
    //                     if (error) {
    //                         logger.error(error)
    //                         callback(error, null)
    //                         return
    //                     } 
                        
    //                     //If the count is greater than 0, than the email exists
    //                     const emailExists = results[0].count > 0
    //                     callback(null, emailExists)
    //                 }
    //             )
    //         })
    //     } catch (error) {
    //         console.error('Error checking if email exists in database: ' + error)
    //         throw error
    //     }

    //     return false
    // }

    // getEmailById(userId, callback) {
    //     db.getConnection(function (err, connection) {
    //         if (err) {
    //             callback(err, null);
    //             return;
    //         }
    
    //         connection.query(
    //             'SELECT emailAdress FROM `user` WHERE id = ?',
    //             [userId],
    //             function (error, results, fields) {
    //                 connection.release();
    
    //                 if (error) {
    //                     callback(error, null);
    //                 } else {
    //                     // Assuming there is exactly one row for the given user ID
    //                     callback(null, results[0].emailAdress);
    //                 }
    //             }
    //         )
    //     })
    // }
}

module.exports = userService
