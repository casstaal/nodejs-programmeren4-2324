process.env.DB_DATABASE = process.env.DB_DATABASE || 'share-a-meal-testdb'
process.env.LOGLEVEL = 'trace'

const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = require('assert')
// const jwt = require('jsonwebtoken')
// const jwtSecretKey = require('../src/util/config').secretkey
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
    'INSERT INTO `user` (`id`, `firstName`, `lastName`, `emailAdress`, `password`, `street`, `city` ) VALUES' +
    '(1, "first", "last", "name@server.nl", "secret", "street", "city");'

/**
 * Query om twee meals toe te voegen. Let op de cookId, die moet matchen
 * met een bestaande user in de database.
 */
// const INSERT_MEALS =
//     'INSERT INTO `meal` (`id`, `name`, `description`, `imageUrl`, `dateTime`, `maxAmountOfParticipants`, `price`, `cookId`) VALUES' +
//     "(1, 'Meal A', 'description', 'image url', NOW(), 5, 6.50, 1)," +
//     "(2, 'Meal B', 'description', 'image url', NOW(), 5, 6.50, 1);"

describe('UC101 Inloggen', () => {
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

    describe('UC101 Inloggen', () => {
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

        it('TC-101-1 Verplicht veld ontbreekt', (done) => {
            chai.request(server)
                .post('/api/login')
                .send({
                    // emailAdress: 'name@server.nl', ontbreekt
                    password: 'secret'
                })
                .end((err, res) => {
                    /**
                     * Voorbeeld uitwerking met chai.expect
                     */
                    chai.expect(res).to.have.status(409)
                    chai.expect(res).not.to.have.status(200)
                    chai.expect(res.body).to.be.a('object')
                    chai.expect(res.body).to.have.property('status').equals(409)
                    chai.expect(res.body)
                        .to.have.property('message')
                        .equals('AssertionError [ERR_ASSERTION]: email must be a string.')
                    chai
                        .expect(res.body)
                        .to.have.property('data')
                        .that.is.a('object').that.is.empty
    
                    done()
                })
        })

        it('TC-101-2 Niet-valide wachtwoord', (done) => {
            chai.request(server)
                .post('/api/login')
                .send({
                    emailAdress: 'name@server.nl', 
                    password: 'testPassword'
                })
                .end((err, res) => {
                    /**
                     * Voorbeeld uitwerking met chai.expect
                     */
                    chai.expect(res).to.have.status(409)
                    chai.expect(res).not.to.have.status(200)
                    chai.expect(res.body).to.be.a('object')
                    chai.expect(res.body).to.have.property('status').equals(409)
                    chai.expect(res.body)
                        .to.have.property('message')
                        .equals('User not found or password invalid')
                    chai
                        .expect(res.body)
                        .to.have.property('data')
                        .that.is.a('object').that.is.empty
    
                    done()
                })
        })

        it('TC-101-3 Gebruiker bestaat niet', (done) => {
            chai.request(server)
                .post('/api/login')
                .send({
                    emailAdress: 'test_name@server.nl', 
                    password: 'secret'
                })
                .end((err, res) => {
                    /**
                     * Voorbeeld uitwerking met chai.expect
                     */
                    chai.expect(res).to.have.status(409)
                    chai.expect(res).not.to.have.status(200)
                    chai.expect(res.body).to.be.a('object')
                    chai.expect(res.body).to.have.property('status').equals(409)
                    chai.expect(res.body)
                        .to.have.property('message')
                        .equals('User not found or password invalid')
                    chai
                        .expect(res.body)
                        .to.have.property('data')
                        .that.is.a('object').that.is.empty
    
                    done()
                })
        })

        it('TC-101-4 Gebruiker succesvol ingelogd', (done) => {
            chai.request(server)
                .post('/api/login')
                .send({
                    emailAdress: 'name@server.nl', 
                    password: 'secret'
                })
                .end((err, res) => {
                    /**
                     * Voorbeeld uitwerking met chai.expect
                     */
                    chai.expect(res).to.have.status(200)
                    chai.expect(res).not.to.have.status(400)
                    chai.expect(res.body).to.be.a('object')
                    chai.expect(res.body).to.have.property('status').equals(200)
                    chai.expect(res.body)
                        .to.have.property('message')
                        .equals('User logged in')
                    chai
                        .expect(res.body)
                        .to.have.property('data')
                        .that.is.a('object')
    
                    done()
                })
        })
    })
})