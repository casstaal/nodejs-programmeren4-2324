const assert = require('assert')

const validation = {

    //Checks of the password has 8 or more characters, contains an uppercase letter and a number.
    checkPassword(password) {
        //[A-Z] matches any uppercase letter
        let upperCasePattern = /[A-Z]/
        //[a-z] matches any lowercase letter
        // let lowerCasePattern = /[a-z]/
        //\d matches any digit character.
        let numberPattern = /\d/
        //[^A-Za-z0-9] is added to match any character that is not an uppercase letter, lowercase letter, or a digit.
        // let specialCharPattern = /[^A-Za-z0-9]/

        return (
            password.length >= 8 &&
            upperCasePattern.test(password) &&
            // lowerCasePattern.test(password) &&
            numberPattern.test(password) 
            // specialCharPattern.test(password)
        )
    },

    //Checks if the email is valid. Valid email example: n.lastname@domain.com
    checkIfEmailIsValid(email) { 
        // const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        const regex = /^[a-zA-Z]\.[a-zA-Z]{2,}@[a-zA-Z]{2,}\.[a-zA-Z]{2,3}$/
        return regex.test(email);
    },

    //Validates a dutch postalcode.
    // validatePostalCode(postalCode) {
    //     const regex = /^[1-9][0-9]{3} ?(?!sa|sd|ss)[A-Z]{2}$/
    //     return regex.test(postalCode)
    // },

    //Checks if a phonenumber is valid. Valid phonenumber example: 06 12345678 en 06-12345678
    validatePhoneNumber(phoneNumber) {
        // const regex = /^\(?([+]31|0031|0)? -?6(\s?|-) ?([0-9]\s{0,3}){8}$/
        const regex = /^06[-\s]?\d{8}$/
        return regex.test(phoneNumber)
    },

    //Uses all the checks above to check if the item passed as the parameter is valid. 
    checkUserData(item) {
        
        assert.ok(
            this.checkPassword(item.password),
            'The password is not valid. A valid password is at least 8 characters long, contains an uppercase letter and a number'
        )
        assert.ok(
            this.checkIfEmailIsValid(item.emailAdress),
            'The email address is not valid. An example of a valid email address is this: n.lastname@domain.com'
        )
        // assert.ok(
        //     this.validatePostalCode(item.postalCode),
        //     'The postalcode is not valid. An example of a valid postalcode is: 1234 HG'
        // )
        assert.ok(
            this.validatePhoneNumber(item.phoneNumber),
            'The phone number is not valid. An example of a valid phone number is: 06 12345678 and 06-12345678'
        )
    }
}