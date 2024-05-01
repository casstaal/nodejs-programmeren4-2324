const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const endpointToTest = '/api/users/:1'

describe('UC205 Updaten van usergegevens', () => {
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
    it('TC-205-1 Verplicht veld emailAddress ontbreekt', (done) => { 
        chai.request(server)
            .post(endpointToTest)
            .send({
                firstName: 'Voornaam', 
                lastName: 'Achternaam',
                // emailAdress: 'v.a@server.nl' ontbreekt
                isActive: true,
                password: 'TestP4ssword!',
                phoneNumber: '+31 612345678',
                roles: 'cook',
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
                    .equals('Email address is missing or is not a string')
                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('object').that.is.empty

                done()
            })
    })

    it.skip('TC-205-2 De gebruiker is niet de eigenaar van de data', (done) => {
        done()
    })

    it('TC-205-3 Niet-valide telefoonnummer', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                firstName: 'Henk',
                lastName: 'Jan',
                emailAdress: 'henkJan@server.nl',
                isActive: true,
                password: 'testPassword2!',
                phoneNumber: '+31 06 123456789',
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
                    .equals('The phone number is not valid. An example of a valid phone number is: +3167234462')
                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('object').that.is.empty

                done()
            })
    })

    it('TC-205-4 Gebruiker bestaat niet', (done) => {
        chai.request(server)
            .post('/api/users/:5')
            .send({
                firstName: 'Henk',
                lastName: 'Jan',
                emailAdress: 'henk_jan@server.nl',
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
                    .equals('This ID does not exist')
                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('object').that.is.empty

                done()
            })
    })

    it.skip('TC-205-5 Niet ingelogd', (done) => {
        done()
    })

    it('TC-205-6 Gebruiker successvol gewijzigd', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                firstName: 'Henk',
                lastName: 'Jan',
                emailAdress: 'henk_jan@server.nl',
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
                data.should.have.property('firstName').equals('Henk')
                data.should.have.property('lastName').equals('Jan')
                data.should.have.property('emailAdress').equals('henk_jan@server.nl')
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
