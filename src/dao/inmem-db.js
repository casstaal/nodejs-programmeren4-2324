//
// Onze lokale 'in memory database'.
// We simuleren een asynchrone database met een array van objecten.
// De array bevat een aantal dummy records.
// De database heeft twee methoden: get en add.
// Opdracht: Voeg de overige methoden toe.
//
const assert = require('assert')

const database = {
    // het array met dummy records. Dit is de 'database'.
    _data: [
        {
            id: 0,
            firstName: 'Hendrik',
            lastName: 'van Dam',
            emailAdress: 'hvd@server.nl',
            // Hier de overige velden uit het functioneel ontwerp
            isActive: true,
            password: 'testPassword',
            phoneNumber: '+06 123456789',
            roles: 'chef',
            street: 'Hogeschoollaan',
            city: 'Breda'
        },
        {
            id: 1,
            firstName: 'Marieke',
            lastName: 'Jansen',
            emailAdress: 'm@server.nl',
            // Hier de overige velden uit het functioneel ontwerp
            isActive: false,
            password: 'secret',
            phoneNumber: '+06 123456789',
            roles: 'server',
            street: 'Hogeschoollaan',
            city: 'Breda'
        }
    ],

    // Ieder nieuw item in db krijgt 'autoincrement' index.
    // Je moet die wel zelf toevoegen aan ieder nieuw item.
    _index: 2,
    _delayTime: 500,

    getAll(callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            // Roep de callback aan, en retourneer de data
            callback(null, this._data)
        }, this._delayTime)
    },

    getById(userId, callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            try {
                console.log('UserID: ' + userId)
                assert.ok(
                    this.checkIfIDExists(userId),
                    'This ID does not exist'
                )
                console.log('userId: ' + userId)
                let arrayPosition = this.getArrayPositionOfUserID(userId)

                callback(null, this._data[arrayPosition])
            } catch (error) {
                console.error(error)
                callback(error)
            }
        }, this._delayTime)
    },

    add(item, callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            try {
                assert.ok(
                    !this.checkIfEmailExists(item.emailAdress),
                    'An user with this emailaddress already exists'
                )
                assert.ok(
                    this.checkPassword(item.password),
                    'A valid password is at least 8 characters long, contains an uppercase letter, an lowercase letter, a number and a special character'
                )
                // Proceed with your logic here
                // Add an id and add the item to the database
                item.id = this._index++
                // Add item to the array
                this._data.push(item)
                // Call the callback at the end of the operation
                // with the added item as argument, or null if an error occurred
                callback(null, item)
            } catch (error) {
                console.error(error)
                callback(error)
            }
        }, this._delayTime)
    },

    // Voeg zelf de overige database functionaliteit toe
    delete(userId, callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            try {
                console.log('UserID: ' + userId)
                assert.ok(
                    this.checkIfIDExists(userId),
                    'This ID does not exist'
                )
                console.log('userId: ' + userId)
                let arrayPosition = this.getArrayPositionOfUserID(userId)

                this._data.splice(arrayPosition, 1)
                // Roep de callback aan het einde van de operatie
                // met het toegevoegde item als argument, of null als er een fout is opgetreden
                callback(null, this._data[arrayPosition])
            } catch (error) {
                console.error(error)
                callback(error)
            }
        }, this._delayTime)
    },

    change(item, userId, callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            try {
                console.log('UserID: ' + userId)
                assert.ok(
                    this.checkIfIDExists(userId),
                    'This ID does not exist'
                )
                console.log('userId: ' + userId)
                let arrayPosition = this.getArrayPositionOfUserID(userId)
                item.id = userId
                this._data[arrayPosition] = item

                // Roep de callback aan het einde van de operatie
                // met het toegevoegde item als argument, of null als er een fout is opgetreden
                callback(null, item)
            } catch (error) {
                console.error(error)
                callback(error)
            }
            // this._data[userId] = item

            // Roep de callback aan het einde van de operatie
            // met het toegevoegde item als argument, of null als er een fout is opgetreden
            // callback(null, item)
        }, this._delayTime)
    },

    checkIfEmailExists(emailAdress) {
        for (let i = 0; i < this._data.length; i++) {
            if (this._data[i].emailAdress === emailAdress) {
                console.log('entered if loop in checkIfEmailExists')
                console.log('userId in if loop: ' + this._data[i].id)
                return true
            }
        }
        return false
    },

    checkIfIDExists(parameterID) {
        console.log('UserID in checkIfIDExists: ' + parameterID)
        for (let i = 0; i < this._data.length; i++) {
            console.log(
                'arrayID: ' +
                    this._data[i].id +
                    ' and parameterID: ' +
                    parameterID
            )
            console.log('typeof parameterID: ' + typeof parameterID)
            if (this._data[i].id === parameterID) {
                console.log('entered if loop in checkIfIDExists')
                return true
            }
        }
        return false
    },

    getArrayPositionOfUserID(id) {
        let arrayPosition = 0
        for (let i = 0; i < this._data.length; i++) {
            console.log('entered for loop')
            console.log(i)
            console.log(this._data[i].id)
            if (this._data[i].id === id) {
                console.log('entered if loop')
                arrayPosition = i
            }
        }
        return arrayPosition
    },

    checkPassword(password) {
        //[A-Z] matches any uppercase letter
        let upperCasePattern = /[A-Z]/
        //[a-z] matches any lowercase letter
        let lowerCasePattern = /[a-z]/
        //\d matches any digit character.
        let numberPattern = /\d/
        //[^A-Za-z0-9] is added to match any character that is not an uppercase letter, lowercase letter, or a digit.
        let specialCharPattern = /[^A-Za-z0-9]/

        return (
            password.length >= 8 &&
            upperCasePattern.test(password) &&
            lowerCasePattern.test(password) &&
            numberPattern.test(password) &&
            specialCharPattern.test(password)
        )
    }
}

module.exports = database
// module.exports = database.index;
