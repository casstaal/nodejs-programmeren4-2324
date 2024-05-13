process.env.DB_DATABASE = process.env.DB_DATABASE || 'share-a-meal-testdb'
process.env.LOGLEVEL = 'trace'

const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = require('assert')
const jwt = require('jsonwebtoken')
const jwtSecretKey = require('../src/util/config').secretkey
const db = require('../src/dao/mysql-db')
const server = require('../index')
const logger = require('../src/util/logger')
require('dotenv').config()

chai.should()
chai.use(chaiHttp)

/**
 * Db queries to clear and fill the test database before each test.
 */
const CLEAR_MEAL_TABLE = 'DELETE IGNORE FROM `meal`;'
const CLEAR_PARTICIPANTS_TABLE = 'DELETE IGNORE FROM `meal_participants_user`;'
const CLEAR_USERS_TABLE = 'DELETE IGNORE FROM `user`;'
const CLEAR_DB = CLEAR_MEAL_TABLE + CLEAR_PARTICIPANTS_TABLE + CLEAR_USERS_TABLE

/**
 * Voeg een user toe aan de database. Deze user heeft id 1.
 * Deze id kun je als foreign key gebruiken in de andere queries, bv insert meal.
 */
const INSERT_USER =
    'INSERT INTO `user` (`id`, `firstName`, `lastName`, `isActive`, `emailAdress`, `password`, `street`, `city` ) VALUES' +
    '(1, "first", "last", 1, "name@server.nl", "secret", "street", "city"),' +
    '(2, "first", "last", 0, "name2@server.nl", "secret", "street", "city");'

/**
 * Query om twee meals toe te voegen. Let op de cookId, die moet matchen
 * met een bestaande user in de database.
 */
// const INSERT_MEALS =
//     'INSERT INTO `meal` (`id`, `name`, `description`, `imageUrl`, `dateTime`, `maxAmountOfParticipants`, `price`, `cookId`) VALUES' +
//     "(1, 'Meal A', 'description', 'image url', NOW(), 5, 6.50, 1)," +
//     "(2, 'Meal B', 'description', 'image url', NOW(), 5, 6.50, 1);"

describe('UC204 Opvragen van usergegevens bij ID', () => {
    //
    // informatie over before, after, beforeEach, afterEach:
    // https://mochajs.org/#hooks
    //
    before((done) => {
        logger.debug(
            'before: hier zorg je eventueel dat de precondities correct zijn'
        )
        logger.debug('before done')
        done()
    })

    describe('UC204 Opvragen van usergegevens bij ID', () => {
        //
        beforeEach((done) => {
            logger.debug('beforeEach called')
            // maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
            db.getConnection(function (err, connection) {
                if (err) throw err // not connected!

                // Use the connection
                connection.query(
                    CLEAR_DB + INSERT_USER,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()

                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        logger.debug('beforeEach done')
                        done()
                    }
                )
            })
        })

        it('TC-205-1 Verplicht veld emailAddress ontbreekt', (done) => { 
            const token = jwt.sign({ userId: 1 }, jwtSecretKey)
            chai.request(server)
                .put('/api/user/:1')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    firstName: 'Voornaam', 
                    lastName: 'Achternaam',
                    // emailAdress: 'v.a@server.nl' ontbreekt
                    isActive: 1,
                    password: 'TestP4ssword!',
                    phoneNumber: '+31 612345678',
                    roles: 'cook',
                    street: 'Hogeschoollaan',
                    city: 'Breda'
                })
                .end((err, res) => {
                    /**
                     * Voorbeeld uitwerking met chai.expect
                     */
                    chai.expect(res).to.have.status(400)
                    chai.expect(res).not.to.have.status(200)
                    chai.expect(res.body).to.be.a('object')
                    chai.expect(res.body).to.have.property('status').equals(400)
                    chai.expect(res.body)
                        .to.have.property('message')
                        .equals('Email address is missing or is not a string')
                    chai
                        .expect(res.body)
                        .to.have.property('data')
                        .that.is.a('object').that.is.empty
    
                    done()
                })
        })
    
        it('TC-205-2 De gebruiker is niet de eigenaar van de data', (done) => {
            const token = jwt.sign({ userId: 1 }, jwtSecretKey)
            chai.request(server)
                .put('/api/user/:2')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    firstName: 'Voornaam', 
                    lastName: 'Achternaam',
                    isActive: 1,
                    emailAdress: 'name2@server.nl',
                    password: 'TestP4ssword!',
                    phoneNumber: '+31 612345678',
                    roles: 'cook',
                    street: 'Hogeschoollaan',
                    city: 'Breda'
                })
                .end((err, res) => {
                    /**
                     * Voorbeeld uitwerking met chai.expect
                     */
                    // chai.expect(res).to.have.status(400)
                    // chai.expect(res).not.to.have.status(200)
                    chai.expect(res.body).to.be.a('object')
                    // chai.expect(res.body).to.have.property('status').equals(400)
                    chai.expect(res.body)
                        .to.have.property('message')
                        .equals('The user 1 is not the owner of user 2')
                    chai
                        .expect(res.body)
                        .to.have.property('data')
                        .that.is.a('object').that.is.empty
    
                    done()
                })
        })
    
        it('TC-205-3 Niet-valide telefoonnummer', (done) => {
            const token = jwt.sign({ userId: 1 }, jwtSecretKey)
            chai.request(server)
                .put('/api/user/:1')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    firstName: 'Henk',
                    lastName: 'Jan',
                    emailAdress: 'name@server.nl',
                    isActive: 1,
                    password: 'testPassword2!',
                    phoneNumber: '+31 06 123456789',
                    roles: 'chef',
                    street: 'Hogeschoollaan',
                    city: 'Breda'
                })
                .end((err, res) => {
                    /**
                     * Voorbeeld uitwerking met chai.expect
                     */
                    chai.expect(res).to.have.status(500)
                    chai.expect(res).not.to.have.status(200)
                    chai.expect(res.body).to.be.a('object')
                    chai.expect(res.body).to.have.property('status').equals(500)
                    chai.expect(res.body)
                        .to.have.property('message')
                        .equals('The phone number is not valid. An example of a valid phone number is: +31672344624')
                    chai
                        .expect(res.body)
                        .to.have.property('data')
                        .that.is.a('object').that.is.empty
    
                    done()
                })
        })
    
        it('TC-205-4 Gebruiker bestaat niet', (done) => {
            const token = jwt.sign({ userId: 1 }, jwtSecretKey)
            chai.request(server)
                .put('/api/user/:111')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    firstName: 'Henk',
                    lastName: 'Jan',
                    emailAdress: 'name@server.nl',
                    isActive: 1,
                    password: 'testPassword2$',
                    phoneNumber: '+31 612345678',
                    roles: 'chef',
                    street: 'Hogeschoollaan',
                    city: 'Breda'
                })
                .end((err, res) => {
                    /**
                     * Voorbeeld uitwerking met chai.expect
                     */
                    // chai.expect(res).to.have.status(401)
                    // chai.expect(res).not.to.have.status(200)
                    chai.expect(res.body).to.be.a('object')
                    // chai.expect(res.body).to.have.property('status').equals(401)
                    chai.expect(res.body)
                        .to.have.property('message')
                        .equals('The ID: 111 does not exist')
                    chai
                        .expect(res.body)
                        .to.have.property('data')
                        .that.is.a('object').that.is.empty
    
                    done()
                })
        })
    
        it('TC-205-5 Niet ingelogd', (done) => {
            // const token = jwt.sign({ userId: 1 }, jwtSecretKey)
            chai.request(server)
                .put('/api/user/:1')
                // .set('Authorization', 'Bearer ' + token)
                .send({
                    firstName: 'Henk',
                    lastName: 'Jan',
                    emailAdress: 'name@server.nl',
                    isActive: 1,
                    password: 'testPassword2$',
                    phoneNumber: '+31 612345678',
                    roles: 'chef',
                    street: 'Hogeschoollaan',
                    city: 'Breda',
                    postalCode: '3825 NK'
                })
                .end((err, res) => {
                    /**
                     * Voorbeeld uitwerking met chai.expect
                     */
                    chai.expect(res).to.have.status(401)
                    chai.expect(res).not.to.have.status(200)
                    chai.expect(res.body).to.be.a('object')
                    chai.expect(res.body).to.have.property('status').equals(401)
                    chai.expect(res.body)
                        .to.have.property('message')
                        .equals('Authorization header missing!')
                    chai
                        .expect(res.body)
                        .to.have.property('data')
                        .that.is.a('object').that.is.empty
    
                    done()
                })
        })
    
        it('TC-205-6 Gebruiker successvol gewijzigd', (done) => {
            const token = jwt.sign({ userId: 1 }, jwtSecretKey)
            chai.request(server)
                .put('/api/user/:1')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    firstName: 'Henk',
                    lastName: 'Jan',
                    emailAdress: 'name@server.nl',
                    isActive: 1,
                    password: 'testPassword2$',
                    phoneNumber: '+31 612345678',
                    roles: 'chef',
                    street: 'Hogeschoollaan',
                    city: 'Breda'
                })
                .end((err, res) => {
                    // res.should.have.status(200)
                    res.body.should.be.a('object')
    
                    res.body.should.have.property('data').that.is.a('object')
                    res.body.should.have.property('message').that.is.a('string').equals('Updated user with ID: 1')
    
                    // const data = res.body.data
                    // data.should.have.property('firstName').equals('Henk')
                    // data.should.have.property('lastName').equals('Jan')
                    // data.should.have.property('emailAdress').equals('henk_jan@server.nl')
                    // data.should.have.property('isActive').that.is.a('boolean')
                    // data.should.have.property('password').equals('testPassword2$')
                    // data.should.have.property('phoneNumber').equals('+31 612345678')
                    // data.should.have.property('roles').equals('chef')
                    // data.should.have.property('street').equals('Hogeschoollaan')
                    // data.should.have.property('city').equals('Breda')
                    // data.should.have.property('postalCode').equals('3825 NK')
    
                    // data.should.have.property('id').that.is.a('number')
    
                    done()
                })
        })
    })
})