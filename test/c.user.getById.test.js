// const chai = require('chai')
// const chaiHttp = require('chai-http')
// const server = require('../index')
// const tracer = require('tracer')

// chai.should()
// chai.use(chaiHttp)
// tracer.setLevel('warn')


// describe('UC204 Opvragen van usergegevens bij ID', () => {
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
//     it.skip('TC-204-1 Ongeldig token', (done) => { 
//         done()
//     })

//     it.skip('TC-204-2 Gebruiker-ID bestaat niet', (done) => {
//         chai.request(server)
//             .get('/api/users/:3')
            
//             .end((err, res) => {
//                 /**
//                  * Voorbeeld uitwerking met chai.expect
//                  */
//                 chai.expect(res).to.have.status(500)
//                 chai.expect(res).not.to.have.status(200)
//                 chai.expect(res.body).to.be.a('object')
//                 chai.expect(res.body).to.have.property('status').equals(500)
//                 chai.expect(res.body)
//                     .to.have.property('message')
//                     .equals('This ID does not exist')
//                 chai
//                     .expect(res.body)
//                     .to.have.property('data')
//                     .that.is.a('object').that.is.empty

//                 done()
//             })
//     })

//     it.skip('TC-204-3 Gebruiker-ID bestaat', (done) => {
//         chai.request(server)
//             .get('/api/users/:0')
            
//             .end((err, res) => {
//                 chai.expect(res).to.have.status(200)
//                 chai.expect(res).not.to.have.status(400)
//                 chai.expect(res.body).to.be.a('object')
//                 chai.expect(res.body).to.have.property('status').equals(200)
//                 chai.expect(res.body)
//                     .to.have.property('message')
//                     .equals('Found user with id 0')
//                 chai
//                     .expect(res.body)
//                     .to.have.property('data')
//                     .that.is.a('object')
                    
//                 done()
//             })
//     })
// })
