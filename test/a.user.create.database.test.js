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
    '(1, "first", "last", "name@server.nl", "secret", "street", "city"),' +
    '(2, "first", "last", "c.lastname@domain.com", "secret", "street", "city"),' +
    '(3,"Herman","Huizinga","h.huizinga@server.nl","secret", "street","city");'
    
    

/**
 * Query om twee meals toe te voegen. Let op de cookId, die moet matchen
 * met een bestaande user in de database.
 * 
 */
// const INSERT_MEALS =
//     'INSERT INTO `meal` (`id`, `name`, `description`, `imageUrl`, `dateTime`, `maxAmountOfParticipants`, `price`, `cookId`) VALUES' +
//     "(1, 'Meal A', 'description', 'image url', NOW(), 5, 6.50, 1)," +
//     "(2, 'Meal B', 'description', 'image url', NOW(), 5, 6.50, 1);"

describe('UC201 Registreren als nieuwe user', () => {
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

    describe('UC201 Registreren als nieuwe user', () => {
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

        it('TC-201-1 Verplicht veld ontbreekt', (done) => {
            chai.request(server)
                .post('/api/user')
                .send({
                    // firstName: 'Voornaam', ontbreekt
                    lastName: 'Achternaam',
                    emailAdress: 'v.a@server.nl',
                    // isActive: true,
                    password: 'testPassword2$',
                    phoneNumber: '+31 612345678',
                    roles: 'chef',
                    street: 'Hogeschoollaan',
                    city: 'Breda',
                    // postalCode: '3825 NK'
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
                        .equals('First name is missing or is not a string')
                    chai
                        .expect(res.body)
                        .to.have.property('data')
                        .that.is.a('object').that.is.empty
    
                    done()
                })
        })

        it('TC-201-2 Niet-valide email adres', (done) => {
            chai.request(server)
            .post('/api/user')
            .send({
                firstName: 'Voornaam',
                lastName: 'Achternaam',
                emailAdress: 'test.nl',
                isActive: true,
                password: 'testPassword2!',
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
                chai.expect(res).to.have.status(500)
                chai.expect(res).not.to.have.status(200)
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('status').equals(500)
                chai.expect(res.body)
                    .to.have.property('message')
                    .equals('The email address is not valid. An example of a valid email address is this: n.lastname@domain.com')
                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('object').that.is.empty
    
                done()
            })
        })

        it('TC-201-3 Niet-valide password', (done) => {
            chai.request(server)
                .post('/api/user')
                .send({
                    firstName: 'Voornaam',
                    lastName: 'Achternaam',
                    emailAdress: 'm.lastname@domain.com',
                    isActive: true,
                    password: 'testpassword2',
                    phoneNumber: '06-12345678',
                    roles: 'chef',
                    street: 'Hogeschoollaan',
                    city: 'Breda',
                    postalCode: '3825 NK'
                })
                .end((err, res) => {
                    /**
                     * Voorbeeld uitwerking met chai.expect
                     */
                    chai.expect(res).to.have.status(500)
                    chai.expect(res).not.to.have.status(201)
                    chai.expect(res.body).to.be.a('object')
                    chai.expect(res.body).to.have.property('status').equals(500)
                    chai.expect(res.body)
                        .to.have.property('message')
                        .equals('The password is not valid. A valid password is at least 8 characters long, contains an uppercase letter and a number')
                    chai
                        .expect(res.body)
                        .to.have.property('data')
                        .that.is.a('object').that.is.empty
    
                    done()
                })
        })
    
        it('TC-201-4 Gebruiker bestaat al', (done) => {
            chai.request(server)
                .post('/api/user')
                .send({
                    firstName: 'Voornaam',
                    lastName: 'Achternaam',
                    emailAdress: 'h.huizinga@server.nl',
                    isActive: 1,
                    password: 'testPassword2$',
                    phoneNumber: '06-12345678',
                    roles: 'admin',
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
                        .equals('Duplicate entry \'h.huizinga@server.nl\' for key \'user.IDX_87877a938268391a71723b303c\'')
                    chai
                        .expect(res.body)
                        .to.have.property('data')
                        .that.is.a('object').that.is.empty
    
                    done()
                })
        })
    
        it('TC-201-5 Gebruiker succesvol geregistreerd', (done) => {
            chai.request(server)
                .post('/api/user')
                .send({
                    firstName: 'Voornaam',
                    lastName: 'Achternaam',
                    emailAdress: 'n.lastname@domain.com',
                    isActive: 1,
                    password: 'testPassword2$',
                    phoneNumber: '06-12345678',
                    roles: '',
                    street: 'Hogeschoollaan',
                    city: 'Breda'
    
                })
                .end((err, res) => {
                    chai.expect(res).to.have.status(201)
                    chai.expect(res).not.to.have.status(500)
                    chai.expect(res.body).to.be.a('object')
                    chai.expect(res.body).to.have.property('status').equals(201)
    
                    res.body.should.have.property('data').that.is.a('object')
                    res.body.should.have.property('message').that.is.a('string')
    
                    const data = res.body.data
                    data.should.have.property('firstName').equals('Voornaam')
                    data.should.have.property('lastName').equals('Achternaam')
                    data.should.have.property('emailAdress').equals('n.lastname@domain.com')
                    data.should.have.property('isActive').that.is.a('number')
                    data.should.have.property('password').equals('testPassword2$')
                    data.should.have.property('phoneNumber').equals('06-12345678')
                    data.should.have.property('roles').equals('')
                    data.should.have.property('street').equals('Hogeschoollaan')
                    data.should.have.property('city').equals('Breda')
    
                    data.should.have.property('id').that.is.a('number')
    
                    done()
                })
        })
    })
})