const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const assert = require('assert')
const validateToken = require('./authentication.routes').validateToken
const logger = require('../util/logger')

const validateUser = (req, res, next) => {
    let user = req.body
    let {
        firstName,
        lastName,
        emailAdress,
        // isActive,
        password,
        phoneNumber,
        roles,
        street,
        city,
        // postalCode
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
        // assert(
        //     typeof isActive === 'boolean',
        //     'isActive is missing or is not a boolean'
        // )
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
        // assert(typeof postalCode === 'string', 'Postalcode is missing or is not a string')
        next()
    } catch (err) {
        console.log(err)
        
        return next({
            // error wordt doorgestuurd naar de error handler in index.js
            status: 400,
            message: err.message,
            data: {}
        })
    }
}

// Userroutes
router.post('/api/user', validateUser, userController.create)
router.get('/api/user', userController.getAll)
// router.get('/api/user/:userId', userController.getById)
router.delete('/api/user/:userId', userController.deleteUser)
router.put('/api/user/:userId', validateUser ,userController.changeUser)
// get user profile aanmaken
router.get('/api/user/profile', validateToken, userController.getProfile)
router.get('/api/user/:userId', userController.getById)


module.exports = router
