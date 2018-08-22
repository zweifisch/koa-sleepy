const assert = require('assert')
const debug = require('debug')('koa-sleepy')
const {Response} = require('./response')
const dispatch = require('./dispatch')
const compose = require('koa-compose')


const status = code => ctx => {
    ctx.status = code
}

const defaultHandlers = {
    methodNotAllowed: status(405),
    notFund: status(404)
}

function restify (...args) {
    if (args.length === 1) {
        assert(args[0] && typeof args[0] === 'object', `restify expact an object`)
        return compose(Object.entries(args[0]).map(x => restifySingle(...x)))
    }
    if (args.length === 2) {
        return restifySingle(...args)
    }
}

function restifySingle (prefix, resourceClass) {
    assert(typeof prefix === 'string', `restify expect prefix of string`)
    assert(resourceClass, `can't restify ${resourceClass}`)
    const controller = Reflect.construct(resourceClass, [])
    let actions = new Set(Object.getOwnPropertyNames(Object.getPrototypeOf(controller)))
    actions.delete('constructor')
    return async function(ctx, next) {
        if (!ctx.path.startsWith(prefix)) {
            await next()
            return
        }
        let [action, id] = dispatch(actions, ctx.method, ctx.path.substr(prefix.length))
        debug('dispatched', {method: ctx.method, path: ctx.path, action, id})
        if (actions.has(action)) {
            let result
            try {
                result = controller[action](ctx, id)
            } catch (err) {
                return ctx.throw(500, err)
            }
            if (result === undefined) {
                if (!ctx.body) {
                    ctx.status = 204
                }
            } else {
                if (result && 'function' === typeof result.then) {
                    try {
                        result = await result
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
            defaultHandlers[action](ctx, id)
        }
    }
}

exports.restify = restify
