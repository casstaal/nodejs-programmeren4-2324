const database = require('../dao/inmem-db')
var logger = require('tracer').console()

const mealService = {
    create: (meal, callback) => {
        database.addMeal(meal, (err, data) => {
            if (err) {
                callback(err, null)
            } else {
                callback(null, {
                    message: `Meal created with id ${data.id}.`,
                    data: data
                })
            }
        })
    },

    getAll: (callback) => {
        database.getAllMeals((err, data) => {
            if (err) {
                callback(err, null)
            } else {
                console.log(data)
                callback(null, {
                    message: `Found ${data.length} meals.`,
                    data: data
                })
            }
        })
    },

    getById: (mealId, callback) => {
        database.getMealById(mealId, (err, data) => {
            if (err) {
                callback(err, null)
            } else {
                callback(null, {
                    message: `Found meal with id ${mealId}`,
                    data: data
                })
            }
        })
    }

    // deleteUser: (userId, callback) => {
    //     database.delete(userId, (err, data) => {
    //         if (err) {
    //             callback(err, null)
    //         } else {
    //             callback(null, {
    //                 message: `User deleted with id ${userId}.`,
    //                 data: data
    //             })
    //         }
    //     })
    // },

    // changeUser: (user, userId, callback) => {
    //     database.change(user, userId, (err, data) => {
    //         if (err) {
    //             callback(err, null)
    //         } else {
    //             callback(null, {
    //                 message: `User changed with id ${userId}.`,
    //                 data: data
    //             })
    //         }
    //     })
    // }
}

module.exports = mealService
