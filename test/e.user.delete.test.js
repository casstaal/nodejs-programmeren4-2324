const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

describe('UC206 Verwijderen van user', () => {
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
    it('TC-206-1 Gebruiker bestaat niet', (done) => { 
        chai.request(server)
            .delete('/api/user/:3')
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

    it.skip('TC-206-2 Gebruiker is niet ingelogd', (done) => {
        done()
    })

    it.skip('TC-206-3 De gebruiker is niet de eigenaar van de data', (done) => {
        done()
    })

    it('TC-206-4 Gebruiker succesvol verwijderd', (done) => {
        chai.request(server)
            .delete('/api/user/:1')
            .end((err, res) => {
                /**
                 * Voorbeeld uitwerking met chai.expect
                 */
                chai.expect(res.body)
                    .to.have.property('message')
                    .equals('User deleted with id 1.')
                done()
            })
    })
})
