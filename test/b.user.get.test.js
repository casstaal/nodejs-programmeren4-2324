// const chai = require('chai')
// const chaiHttp = require('chai-http')
// const server = require('../index')
// const tracer = require('tracer')

// chai.should()
// chai.use(chaiHttp)
// tracer.setLevel('warn')

// const endpointToTest = '/api/user'

// describe('UC202 Opvragen van overzicht van users', () => {
//     /**
//      * Voorbeeld van een beforeEach functie.
//      * Hiermee kun je code hergebruiken of initialiseren.
//      */
//     beforeEach((done) => {
//         console.log('Before each test')
//         done()
//     })

//     /**
//      * Hier starten de testcases
//      */
//     it,skip('TC-202-1 Toon alle gebruikers (minimaal 2)', (done) => { 
//         chai.request(server)
//             .get(endpointToTest)
            
//             .end((err, res) => {
//                 /**
//                  * Voorbeeld uitwerking met chai.expect
//                  */

//                 chai.expect(res).to.have.status(200)
//                 chai.expect(res).not.to.have.status(400)
//                 chai.expect(res.body).to.be.a('object')
//                 chai.expect(res.body).to.have.property('status').equals(200)
//                 chai.expect(res.body)
//                     .to.have.property('message')
//                     .equals('Overview of all users')
//                 chai
//                     .expect(res.body)
//                     .to.have.property('data')
//                     .that.is.a('array')

//                 done()
//             })
//     })

//     it.skip('TC-202-2 Toon gebruikers met zoekterm op niet-bestaande velden', (done) => {
//         chai.request(server)
//         .get('/api/user?test=test')
        
//         .end((err, res) => {
//             /**
//              * Voorbeeld uitwerking met chai.expect
//              */
//             chai.expect(res).to.have.status(200)
//             chai.expect(res).not.to.have.status(400)
//             chai.expect(res.body).to.be.a('object')
//             chai.expect(res.body).to.have.property('status').equals(200)
//             chai.expect(res.body)
//                 .to.have.property('message')
//                 .equals('There are no users matching your search term')
//             chai
//                 .expect(res.body)
//                 .to.have.property('data')
//                 .that.is.a('array').that.is.empty

//             done()
//         })
//     })

//     it.skip('TC-202-3 Toon gebruikers met gebruik van de zoekterm op het veld isActive = false', (done) => {
//         chai.request(server)
//             .get('/api/user?isActive=false')
            
//             .end((err, res) => {
//                 chai.expect(res).to.have.status(200)
//                 chai.expect(res).not.to.have.status(400)
//                 chai.expect(res.body).to.be.a('object')
//                 chai.expect(res.body).to.have.property('status').equals(200)
//                 chai.expect(res.body)
//                     .to.have.property('message')
//                     .equals('Filtered on 1 parameter: isActive = false' )
//                 chai
//                     .expect(res.body)
//                     .to.have.property('data')
//                     .that.is.a('array')

//                 done()
//             })
//     })

//     it.skip('TC-202-4 Toon gebruikers met gebruik van de zoekterm op het veld isActive=true', (done) => {
//         chai.request(server)
//             .get('/api/user?isActive=true')
            
//             .end((err, res) => {
//                 chai.expect(res).to.have.status(200)
//                 chai.expect(res).not.to.have.status(400)
//                 chai.expect(res.body).to.be.a('object')
//                 chai.expect(res.body).to.have.property('status').equals(200)
//                 chai.expect(res.body)
//                     .to.have.property('message')
//                     .equals('Filtered on 1 parameter: isActive = true')
//                 chai
//                     .expect(res.body)
//                     .to.have.property('data')
//                     // .that.is.a('object')
//                     .that.is.a('array')

//                 done()
//             })
//     })

//     it.skip('TC-202-5 Toon gebruikers met zoektermen op bestaande velden (max op 2 velden filteren)', (done) => {
//         chai.request(server)
//             .get('/api/user?isActive=true&city=Breda')
            
//             .end((err, res) => {
//                 chai.expect(res).to.have.status(200)
//                 chai.expect(res).not.to.have.status(400)
//                 chai.expect(res.body).to.be.a('object')
//                 chai.expect(res.body).to.have.property('status').equals(200)
//                 chai.expect(res.body)
//                     .to.have.property('message')
//                     .equals('Filtered on 2 parameters: isActive = true and city = Breda')
//                 chai
//                     .expect(res.body)
//                     .to.have.property('data')
//                     .that.is.a('array')

//                 done()
//             })
//     })
// })
