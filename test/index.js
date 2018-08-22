const { restify } = require('../index')
const Koa = require('koa')
const request = require('supertest')

const Sync = require('./sync')
const Promised = require('./promised')
const Async = require('./async')
const Errors = require('./errors')

describe('dispatch', () => {
    let app = new Koa()
    app.use(restify('/sync', Sync))
    let server = app.listen()

    it('should handle list', done => {
        request(server).get('/sync').expect(200, '[]').end(done)
    })

    it('should handle create', done => {
        request(server).post('/sync').expect(204, '').end(done)
    })

    it('should handle replace', done => {
        request(server).put('/sync/1').expect(200, '{"updated":"1"}').end(done)
    })

    it('should handle update', done => {
        request(server).patch('/sync/1').expect(200, '1 updated').end(done)
    })

    it('should handle delete', done => {
        request(server).delete('/sync/1').expect(200, '1 deleted').end(done)
    })

    it('should handle delete 405', done => {
        request(server).delete('/sync').expect(405, 'Method Not Allowed').end(done)
    })

    it('should handle custom function', done => {
        request(server).post('/sync/1/custom').expect(200, 'custom action on 1').end(done)
    })

    it('should handle custom function 404', done => {
        request(server).post('/sync/custom').expect(404, 'Not Found').end(done)
    })
})

describe('promised', () => {
    let app = new Koa()
    app.use(restify('/', Promised))
    let server = app.listen()

    it('should handle promise', done => {
        request(server).get('/').expect(200, '[]').end(done)
    })
})

describe('async', () => {
    let app = new Koa()
    app.use(restify('/', Async))
    let server = app.listen()

    it('should handle async function', done => {
        request(server).get('/').expect(200, '[]').end(done)
    })

    it('should handle async create function', done => {
        request(server).post('/').expect(400, '{"required":["name"]}').end(done)
    })
})

describe('errors', () => {
    let app = new Koa()
    app.use(restify('/', Errors))
    app.silent = true
    let server = app.listen()
    it('should handle async error', done => {
        request(server).post('/').expect(500).end(done)
    })

    it('should handle sync error', done => {
        request(server).get('/').expect(500).end(done)
    })
})

describe('regiter multiple resource', () => {
    let app = new Koa()
    app.use(restify({
        '/errors': Errors,
        '/sync': Sync,
    }))
    app.silent = true
    let server = app.listen()

    it('should register Errors', done => {
        request(server).post('/errors').expect(500).end(done)
    })

    it('should register Sync', done => {
        request(server).get('/sync').expect(200).end(done)
    })
})
