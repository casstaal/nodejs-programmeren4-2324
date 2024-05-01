const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const assert = require('assert')

const validateUser = (req, res, next) => {
    let user = req.body
    let {
        firstName,
        lastName,
        emailAdress,
        isActive,
        password,
        phoneNumber,
        roles,
        street,
        city,
        postalCode
    } = user
    try {
        assert(
            typeof firstName === 'string',
            'First name is missing or is not a string'
        )
        assert(
            typeof lastName === 'string',
            'Last name is missing or is not a string'
        )
        assert(
            typeof emailAdress === 'string',
            'Email address is missing or is not a string'
        )
        assert(
            typeof isActive === 'boolean',
            'isActive is missing or is not a boolean'
        )
        assert(
            typeof password === 'string',
            'Password is missing or is not a string'
        )
        assert(
            typeof phoneNumber === 'string',
            'Phonenumber is missing or is not a string'
        )
        assert(typeof roles === 'string', 'Roles is missing or is not a string')
        assert(
            typeof street === 'string',
            'Street is missing or is not a string'
        )
        assert(typeof city === 'string', 'City is missing or is not a string')
        assert(typeof postalCode === 'string', 'Postalcode is missing or is not a string')
        next()
    } catch (err) {
        console.log(err)
        // res.status(400).json({
        //     status: 400,
        //     message: err.message
        // })
        return next({
            // error wordt doorgestuurd naar de error handler in index.js
            status: 400,
            message: err.message,
            data: {}
        })
    }
}

// Userroutes
router.post('/api/users', validateUser, userController.create)
router.get('/api/user', userController.getAll)
router.get('/api/users/:userId', userController.getById)
router.delete('/api/users/:userId', userController.deleteUser)
router.put('/api/users/:userId', userController.changeUser)

module.exports = router
