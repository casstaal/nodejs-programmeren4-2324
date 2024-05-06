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
            city: 'Breda',
            postalCode: '3876 UK'
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
            city: 'Breda',
            postalCode: '3928 KN'
        }
    ],

    _mealData: [
        {
            id: 0,
            name: 'Spaghetti Bolognese',
            description: 'De pastaklassieker bij uitstek.',
            isActive: true,
            isVega: false,
            isVegan: false,
            isToTakeHome: true,
            dateTime: '2023-04-06',
            maxAmountOfParticipants: 6,
            price: 6.75,
            imageUrl: 'https://feelgoodfoodie.net/wp-content/uploads/2023/04/Pasta-Bolognese-TIMG.jpg',
            allergenes: ['gluten', 'noten', 'lactose'],
            // cook: this._data[0],
            participants: [
                {
                    id: 0,
                    name: 'Henk'
                }, 
                {
                    id: 1,
                    name: 'Peter'
                }]
        },
        {
            id: 1,
            name: 'Sushi',
            description: 'De echte sushi',
            isActive: false,
            isVega: false,
            isVegan: false,
            isToTakeHome: true,
            dateTime: '2024-01-02',
            maxAmountOfParticipants: 4,
            price: 10.25,
            imageUrl: 'https://www.kokenmetmaarten.nl/wp-content/uploads/2023/04/hosomaki_sushi2.jpg',
            allergenes: ['gluten', 'noten', 'lactose'],
            // cook: this._data[1],
            participants: [
            {
                id: 2,
                name: 'Jan'
            }, 
            {
                id: 1,
                name: 'Piet'
            }]
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

    getAllMeals(callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            // Roep de callback aan, en retourneer de data
            callback(null, this._mealData)
        }, this._delayTime)
    },

    getAllParticipants(mealId, callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            
            try {
                assert.ok(
                    this.checkIfMealIDExists(mealId),
                    'This meal does not exist'
                )

                // Roep de callback aan, en retourneer de data
                callback(null, this._mealData[mealId].participants)
            } catch (error) {
                console.error(error)
                callback(error)
            }
        }, this._delayTime)
    },

    getById(userId, callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            try {
                assert.ok(
                    this.checkIfIDExists(userId),
                    'This ID does not exist'
                )
                let arrayPosition = this.getArrayPositionOfUserID(userId)

                callback(null, this._data[arrayPosition])
            } catch (error) {
                console.error(error)
                callback(error)
            }
        }, this._delayTime)
    },

    getMealById(mealId, callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            try {
                assert.ok(
                    this.checkIfMealIDExists(mealId),
                    'This ID does not exist'
                )
                let arrayPosition = this.getArrayPositionOfMealID(mealId)

                callback(null, this._mealData[arrayPosition])
            } catch (error) {
                console.error(error)
                callback(error)
            }
        }, this._delayTime)
    },

    getMealParticipantById(mealId, participantId, callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            try {
                assert.ok(
                    this.checkIfMealIDExists(mealId),
                    'This Meal ID does not exist'
                )
                let arrayPosition = this.getArrayPositionOfMealID(mealId)
                let participantArrayPosition = this.getArrayPositionOfUserInMealRegistrations(participantId)

                callback(null, this._mealData[arrayPosition].participants[participantArrayPosition])
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
                this.checkUserData(item, false)
            
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

    addMeal(item, callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            try {
            
                // Proceed with your logic here
                // Add an id and add the item to the database
                item.id = this._index++
                // Add item to the array
                this._mealData.push(item)
                // Call the callback at th e end of the operation
                // with the added item as argument, or null if an error occurred
                callback(null, item)
            } catch (error) {
                console.error(error)
                callback(error)
            }
        }, this._delayTime)
    }, 

    addRegistration(mealId, callback) {
    // Simuleer een asynchrone operatie
    setTimeout(() => {
        try {
            assert.ok(
                this.checkIfMealIDExists(mealId),
                'This meal ID does not exist'
            )

            assert.ok(
                this.checkPlaceForRegistration(mealId),
                'The maximum amount of registrations for this meal has already been reached. Could not persist registration.'
            )

            // Add item to the array
            this._mealData[mealId].participants.push('Cas')
            // Call the callback at the end of the operation
            // with the added item as argument, or null if an error occurred
            callback(null, mealId)
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
                assert.ok(
                    this.checkIfIDExists(userId),
                    'This ID does not exist'
                )
                let arrayPosition = this.getArrayPositionOfUserID(userId)

                this._data.splice(arrayPosition, 1)
                // Roep de callback aan het einde van de operatie
                // met het toegevoegde item als argument, of null als er een fout is opgetreden
                callback(null, {})
            } catch (error) {
                console.error(error)
                callback(error)
            }
        }, this._delayTime)
    },

    deleteMeal(mealId, callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            try {
                assert.ok(
                    this.checkIfMealIDExists(mealId),
                    'This ID does not exist'
                )
                let arrayPosition = this.getArrayPositionOfMealID(mealId)

                this._mealData.splice(arrayPosition, 1)
                // Roep de callback aan het einde van de operatie
                // met het toegevoegde item als argument, of null als er een fout is opgetreden
                callback(null, {})
            } catch (error) {
                console.error(error)
                callback(error)
            }
        }, this._delayTime)
    },

    deleteRegistration(mealId, callback) {
    // Simuleer een asynchrone operatie
    const userId = 1
    setTimeout(() => {
        try {

            assert.ok(
                this.checkIfMealIDExists(mealId),
                'This meal does not exist'
            )
            assert.ok(
                this.checkIfRegistrationExists(mealId, userId),
                'This registration does not exist'
            )

        
            let arrayPosition = this.getArrayPositionOfUserInMealRegistrations(userId)
            console.log('Delete array position: ' + arrayPosition)

            this._mealData[mealId].participants.splice(arrayPosition, 1)
            // Roep de callback aan het einde van de operatie
            // met het toegevoegde item als argument, of null als er een fout is opgetreden
            callback(null, {})
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
                assert.ok(
                    this.checkIfIDExists(userId),
                    'This ID does not exist'
                )
                let arrayPosition = this.getArrayPositionOfUserID(userId)
                item.id = userId

                const oldEmail = this._data[arrayPosition].emailAdress
                const newEmail = item.emailAdress

                if(oldEmail === newEmail) {
                    this.checkUserData(item, true)
                } else {
                    this.checkUserData(item, false)
                }

                this._data[arrayPosition] = item

                // Roep de callback aan het einde van de operatie
                // met het toegevoegde item als argument, of null als er een fout is opgetreden
                callback(null, item)
            } catch (error) {
                console.error(error)
                callback(error)
            }

            // Roep de callback aan het einde van de operatie
            // met het toegevoegde item als argument, of null als er een fout is opgetreden
            // callback(null, item)
        }, this._delayTime)
    },

    changeMeal(item, mealId, callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            try {
                assert.ok(
                    this.checkIfMealIDExists(mealId),
                    'This ID does not exist'
                )
                let arrayPosition = this.getArrayPositionOfMealID(mealId)
                item.id = mealId

                this._mealData[arrayPosition] = item

                // Roep de callback aan het einde van de operatie
                // met het toegevoegde item als argument, of null als er een fout is opgetreden
                callback(null, item)
            } catch (error) {
                console.error(error)
                callback(error)
            }

            // Roep de callback aan het einde van de operatie
            // met het toegevoegde item als argument, of null als er een fout is opgetreden
            // callback(null, item)
        }, this._delayTime)
    },

    checkIfEmailExists(emailAdress) {
        for (let i = 0; i < this._data.length; i++) {
            if (this._data[i].emailAdress === emailAdress) {
                return true
            }
        }
        return false
    },

    checkIfIDExists(parameterID) {
        for (let i = 0; i < this._data.length; i++) {
            if (this._data[i].id === parameterID) {
                return true
            }
        }
        return false
    },

    checkIfMealIDExists(parameterID) {
        for (let i = 0; i < this._mealData.length; i++) {
            if (this._mealData[i].id === parameterID) {
                return true
            }
        }
        return false
    },

    getArrayPositionOfUserID(id) {
        let arrayPosition = 0
        for (let i = 0; i < this._data.length; i++) {
            if (this._data[i].id === id) {
                arrayPosition = i
            }
        }
        return arrayPosition
    },

    getArrayPositionOfMealID(id) {
        let arrayPosition = 0
        for (let i = 0; i < this._mealData.length; i++) {
            if (this._mealData[i].id === id) {
                arrayPosition = i
            }
        }
        return arrayPosition
    },

    getArrayPositionOfUserInMealRegistrations(id) {
        let arrayPosition = -1
        for (let i = 0; i < this._mealData.length; i++) {
            for (let j = 0; j < this._mealData[i].participants.length; j++) {
                if (this._mealData[i].participants[j].id === id) {
                    arrayPosition = j
                }
            }
        }

        return arrayPosition
    },

    checkPlaceForRegistration(mealId) {
        const places = this._mealData[mealId].maxAmountOfParticipants
        const filledPlaces = this._mealData[mealId].participants.length

        console.log('Possible places: ' + places)
        console.log('Filled places: ' + filledPlaces)

        return places > filledPlaces
    },

    checkIfRegistrationExists(mealId, userId) {
        for(let i = 0; i < this._mealData[mealId].participants.length; i++) {
            if (this._mealData[mealId].participants[i].id === userId) {
                return true
            }
        }
        return false
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
    },

    checkIfEmailIsValid(email) { 
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        return regex.test(email);
    },

    validatePostalCode(postalCode) {
        const regex = /^[1-9][0-9]{3} ?(?!sa|sd|ss)[A-Z]{2}$/
        return regex.test(postalCode)
    },

    validatePhoneNumber(phoneNumber) {
        const regex = /^\(?([+]31|0031|0)? -?6(\s?|-) ?([0-9]\s{0,3}){8}$/
        return regex.test(phoneNumber)
    },

    checkUserData(item, emailExists) {
        // The boolean emailExists is used for the change user method. If you want to change the user, but the email stays the same it should be possible. 
        // So a boolean is passed as a parameter. If this boolean is false it means that the email is changed in the change method and it should be checked.
        // If the boolean is true, it means that it stays the same in the change method and that it shouldn't be checked. Because if you would check this email
        // You would get an error saying this emailaddress already exists.
        if(emailExists === false) {
            assert.ok(
                !this.checkIfEmailExists(item.emailAdress),
                'An user with this emailaddress already exists'
            )
        }
        
        assert.ok(
            this.checkPassword(item.password),
            'The password is not valid. A valid password is at least 8 characters long, contains an uppercase letter, an lowercase letter, a number and a special character'
        )
        assert.ok(
            this.checkIfEmailIsValid(item.emailAdress),
            'The email address is not valid. An example of a valid email address is this: test@test.com'
        )
        assert.ok(
            this.validatePostalCode(item.postalCode),
            'The postalcode is not valid. An example of a valid postalcode is: 1234 HG'
        )
        assert.ok(
            this.validatePhoneNumber(item.phoneNumber),
            'The phone number is not valid. An example of a valid phone number is: +31672344624'
        )
    }
}

module.exports = database

