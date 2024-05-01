const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const endpointToTest = '/api/user'

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
    it('TC-202-1 Toon alle gebruikers (minimaal 2)', (done) => { 
        chai.request(server)
            .post(endpointToTest)
            
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
                    .equals('Overzicht van alle users')
                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('object')

                done()
            })
    })

    it('TC-202-2 Toon gebruikers met zoekterm op niet-bestaande velden', (done) => {
        chai.request(server)
        .post('/api/user?test=test')
        
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
                .equals('Er zijn geen gebruikers die aan uw zoekterm voldoen')
            chai
                .expect(res.body)
                .to.have.property('data')
                .that.is.a('object').that.is.empty

            done()
        })
    })

    it('TC-202-3 Toon gebruikers met gebruik van de zoekterm op het veld isActive = false', (done) => {
        chai.request(server)
            .post('/api/user?isActive=false')
            
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
                data.should.have.property('roles').equals('server')
                data.should.have.property('street').equals('Hogeschoollaan')
                data.should.have.property('city').equals('Breda')
                data.should.have.property('postalCode').equals('3928 KN')

                data.should.have.property('id').that.is.a('number')

                done()
            })
    })

    it('TC-202-4 Toon gebruikers met gebruik van de zoekterm op het veld isActive=true', (done) => {
        chai.request(server)
            .post('/api/user?isActive=true')
            
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')

                res.body.should.have.property('data').that.is.a('object')
                res.body.should.have.property('message').that.is.a('string')

                const data = res.body.data
                data.should.have.property('firstName').equals('Hendrik')
                data.should.have.property('lastName').equals('van Dam')
                data.should.have.property('emailAdress').equals('hvd@server.nl')
                data.should.have.property('isActive').that.is.a('boolean')
                data.should.have.property('password').equals('testPassword')
                data.should.have.property('phoneNumber').equals('+06 123456789')
                data.should.have.property('roles').equals('chef')
                data.should.have.property('street').equals('Hogeschoollaan')
                data.should.have.property('city').equals('Breda')
                data.should.have.property('postalCode').equals('3876 UK')

                data.should.have.property('id').that.is.a('number')

                done()
            })
    })

    it('TC-202-5 Toon gebruikers met zoektermen op bestaande velden (max op 2 velden filteren)', (done) => {
        chai.request(server)
            .post('/api/user?isActive=true&city=Breda')
            
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')

                res.body.should.have.property('data').that.is.a('object')
                res.body.should.have.property('message').that.is.a('string')

                const data = res.body.data
                data.should.have.property('firstName').equals('Hendrik')
                data.should.have.property('lastName').equals('van Dam')
                data.should.have.property('emailAdress').equals('hvd@server.nl')
                data.should.have.property('isActive').that.is.a('boolean')
                data.should.have.property('password').equals('testPassword')
                data.should.have.property('phoneNumber').equals('+06 123456789')
                data.should.have.property('roles').equals('chef')
                data.should.have.property('street').equals('Hogeschoollaan')
                data.should.have.property('city').equals('Breda')
                data.should.have.property('postalCode').equals('3876 UK')

                data.should.have.property('id').that.is.a('number')

                done()
            })
    })
})
