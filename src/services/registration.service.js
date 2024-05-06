const database = require('../dao/inmem-db')
var logger = require('tracer').console()

const registrationService = {
    createRegistration: (mealId, callback) => {
        database.addRegistration(mealId, (err, data) => {
            if (err) {
                callback(err, null)
            } else {
                callback(null, {
                    message: `User met ID 2839 is aangemeld voor maaltijd met id ${mealId}.`,
                    data: data
                })
            }
        })
    },

    deleteRegistration: (mealId, callback) => {
        database.deleteRegistration(mealId, (err, data) => {
            if (err) {
                callback(err, null)
            } else {
                callback(null, {
                    message: `User met ID 1 is afgemeld voor maaltijd met ID ${mealId}.`,
                    data: data
                })
            }
        })
    },

    getAllParticipants: (mealId, callback) => {
        database.getAllParticipants(mealId, (err, data) => {
            if (err) {
                callback(err, null)
            } else {
                console.log(data)
                callback(null, {
                    message: `Found ${data.length} participants.`,
                    data: data
                })
            }
        })
    },

    getParticipantById: (mealId, participantId, callback) => {
        database.getMealParticipantById(mealId, participantId, (err, data) => {
            if (err) {
                callback(err, null)
            } else {
                callback(null, {
                    message: `Found user with id ${participantId} for the meal with id ${mealId}`,
                    data: data
                })
            }
        })
    },
}

module.exports = registrationService
