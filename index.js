const co = require("co")
const debug = require("debug")("koa-sleepy")

const map = {
    DELETE: 'delete',
    PUT: 'replace',
    PATCH: 'update',
}

const status = (code) => (ctx) => {
    ctx.status = code
}

const defaultHandlers = {
    methodNotAllowed: status(405),
    notFund: status(404)
}

const dispatch = (actions, method, path) => {
    path = path.substr(1)
    if (path === '') {
        if (method === 'GET')
            return ['list']
        if (method === 'POST')
            return ['create']
        return ['methodNotAllowed']
    }
    let segments = path.split('/')
    if (method in map) {
        if (segments.length !== 1)
            return ['notFund']
        return [map[method], segments[0]]
    }
    if (method === 'POST') {
        let [id, action] = segments
        if (!action) {
            [action, id] = segments
        }
        if (actions.has(action))
            return [action, id]
        return ['notFund']
    }
    return ['methodNotAllowed']
}

class Response {
    constructor(status, message) {
        this.status = status
        this.message = message
    }
}

const response = (code) => (message) => new Response(code, message)

exports.BadRequest = response(400)
exports.Unauthorized = response(401)
exports.PaymentRequired = response(402)
exports.Forbidden = response(403)
exports.NotFound = response(404)
exports.MethodNotAllowed = response(405)
exports.NotAcceptable = response(406)
exports.ProxyAuthenticationRequired = response(407)
exports.RequestTimeout = response(408)
exports.Conflict = response(409)
exports.Gone = response(410)
exports.LengthRequired = response(411)
exports.PreconditionFailed = response(412)
exports.PayloadTooLarge = response(413)
exports.URITooLong = response(414)
exports.UnsupportedMediaType = response(415)
exports.RangeNotSatisfiable = response(416)
exports.ExpectationFailed = response(417)
exports.ImATeapot = response(418)
exports.MisdirectedRequest = response(421)
exports.UnprocessableEntity = response(422)
exports.Locked = response(423)
exports.FailedDependency = response(424)
exports.UnorderedCollection = response(425)
exports.UpgradeRequired = response(426)
exports.PreconditionRequired = response(428)
exports.TooManyRequests = response(429)
exports.RequestHeaderFieldsTooLarge = response(431)
exports.UnavailableForLegalReasons = response(451)
exports.InternalServerError = response(500)
exports.NotImplemented = response(501)
exports.BadGateway = response(502)
exports.ServiceUnavailable = response(503)
exports.GatewayTimeout = response(504)
exports.HTTPVersionNotSupported = response(505)
exports.VariantAlsoNegotiates = response(506)
exports.InsufficientStorage = response(507)
exports.LoopDetected = response(508)
exports.BandwidthLimitExceeded = response(509)
exports.NotExtended = response(510)
exports.NetworkAuthenticationRequired = response(511)

exports.resource = (resource) => {
    let actions = new Set(Object.getOwnPropertyNames(Object.getPrototypeOf(resource)))
    actions.delete("constructor")
    return co.wrap(function*(ctx) {
        let [action, id] = dispatch(actions, ctx.method, ctx.path)
        debug("dispatched", {method: ctx.method, path: ctx.path, action, id})
        if (actions.has(action)) {
            let result
            try {
                result = resource[action](ctx)
            } catch (err) {
                return ctx.throw(500, err)
            }
            if (result != undefined) {
                if (result && 'function' === typeof result.then) {
                    try {
                        result = yield result
                    } catch (err) {
                        ctx.throw(500, err)
                    }
                }
                if (result instanceof Response) {
                    ctx.status = result.status
                    ctx.body = result.message
                } else {
                    ctx.body = result
                }
            }
        } else {
            defaultHandlers[action](ctx)
        }
    })
}
