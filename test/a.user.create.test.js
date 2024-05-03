const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const endpointToTest = '/api/users'

describe('UC201 Registreren als nieuwe user', () => {
    /**
     * Voorbeeld van een beforeEach functie.
     * Hiermee kun je code hergebruiken of initialiseren.
     */
    beforeEach((done) => {
        console.log('Before each test')
        done()
    })

    /**
     * Hier starten de testcases
     */
    it('TC-201-1 Verplicht veld ontbreekt', (done) => { 
        chai.request(server)
            .post(endpointToTest)
            .send({
                // firstName: 'Voornaam', ontbreekt
                lastName: 'Achternaam',
                emailAdress: 'v.a@server.nl',
                isActive: true,
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
        .post(endpointToTest)
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
                .equals('The email address is not valid. An example of a valid email address is this: test@test.com')
            chai
                .expect(res.body)
                .to.have.property('data')
                .that.is.a('object').that.is.empty

            done()
        })
    })

    it('TC-201-3 Niet-valide password', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                firstName: 'Voornaam',
                lastName: 'Achternaam',
                emailAdress: 'henkJan@server.nl',
                isActive: true,
                password: 'testPassword2',
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
                    .equals('The password is not valid. A valid password is at least 8 characters long, contains an uppercase letter, an lowercase letter, a number and a special character')
                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('object').that.is.empty

                done()
            })
    })

    it('TC-201-4 Gebruiker bestaat al', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                firstName: 'Voornaam',
                lastName: 'Achternaam',
                emailAdress: 'm@server.nl',
                isActive: true,
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
                chai.expect(res).to.have.status(500)
                chai.expect(res).not.to.have.status(200)
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('status').equals(500)
                chai.expect(res.body)
                    .to.have.property('message')
                    .equals('An user with this emailaddress already exists')
                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('object').that.is.empty

                done()
            })
    })

    it('TC-201-5 Gebruiker succesvol geregistreerd', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                firstName: 'Voornaam',
                lastName: 'Achternaam',
                emailAdress: 'test@server.nl',
                isActive: true,
                password: 'testPassword2$',
                phoneNumber: '+31 612345678',
                roles: 'chef',
                street: 'Hogeschoollaan',
                city: 'Breda',
                postalCode: '3825 NK'

            })
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')

                res.body.should.have.property('data').that.is.a('object')
                res.body.should.have.property('message').that.is.a('string')

                const data = res.body.data
                data.should.have.property('firstName').equals('Voornaam')
                data.should.have.property('lastName').equals('Achternaam')
                data.should.have.property('emailAdress').equals('test@server.nl')
                data.should.have.property('isActive').that.is.a('boolean')
                data.should.have.property('password').equals('testPassword2$')
                data.should.have.property('phoneNumber').equals('+31 612345678')
                data.should.have.property('roles').equals('chef')
                data.should.have.property('street').equals('Hogeschoollaan')
                data.should.have.property('city').equals('Breda')
                data.should.have.property('postalCode').equals('3825 NK')

                data.should.have.property('id').that.is.a('number')

                done()
            })
    })
})
