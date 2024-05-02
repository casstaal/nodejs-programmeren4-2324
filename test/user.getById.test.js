const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

// const endpointToTest = '/api/users/:1'

describe('UC204 Opvragen van usergegevens bij ID', () => {
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
    it.skip('TC-204-1 Ongeldig token', (done) => { 
        done()
    })

    it('TC-204-2 Gebruiker-ID bestaat niet', (done) => {
        chai.request(server)
            .post('/api/users/:3')
            
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

    it('TC-204-3 Gebruiker-ID bestaat', (done) => {
        chai.request(server)
            .post('/api/users/:1')
            
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')

                res.body.should.have.property('data').that.is.a('object')
                res.body.should.have.property('message').that.is.a('string')

                const data = res.body.data
                data.should.have.property('firstName').equals('Marieke')
                data.should.have.property('lastName').equals('Jansen')
                data.should.have.property('emailAdress').equals('m@server.nl')
                data.should.have.property('isActive').that.is.a('boolean')
                data.should.have.property('password').equals('secret')
                data.should.have.property('phoneNumber').equals('+06 123456789')
                data.should.have.property('roles').equals('serer')
                data.should.have.property('street').equals('Hogeschoollaan')
                data.should.have.property('city').equals('Breda')
                data.should.have.property('postalCode').equals('3928 KN')

                data.should.have.property('id').that.is.a('number')

                done()
            })
    })
})
