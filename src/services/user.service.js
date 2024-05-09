const database = require('../dao/inmem-db')
const db = require('../dao/mysql-db')
const logger = require('tracer').console()

const userService = {
    create: (user, callback) => {
        database.add(user, (err, data) => {
            if (err) {
                callback(err, null)
            } else {
                callback(null, {
                    message: `User created with id ${data.id}.`,
                    data: data
                })
            }
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
                'SELECT id, firstName, lastName FROM `user`',
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
        database.getById(userId, (err, data) => {
            if (err) {
                callback(err, null)
            } else {
                console.log(data)
                callback(null, {
                    message: `Found user with id ${userId}`,
                    data: data
                })
            }
        })
    },

    deleteUser: (userId, callback) => {
        database.delete(userId, (err, data) => {
            if (err) {
                callback(err, null)
            } else {
                callback(null, {
                    message: `User deleted with id ${userId}.`,
                    data: data
                })
            }
        })
    },

    changeUser: (user, userId, callback) => {
        database.change(user, userId, (err, data) => {
            if (err) {
                callback(err, null)
            } else {
                callback(null, {
                    message: `User changed with id ${userId}.`,
                    data: data
                })
            }
        })
    }
}

module.exports = userService
