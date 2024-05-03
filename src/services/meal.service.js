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
    }
}

module.exports = mealService
