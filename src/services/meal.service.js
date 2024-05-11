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
