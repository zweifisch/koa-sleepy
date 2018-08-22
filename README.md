# koa-sleepy

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Node.js Version][node-version-image]][node-version-url]

router for building RESTful api

```js
const Koa = require('koa')
const {restify} = require('koa-sleepy')

class User {
    list (ctx, id) {}
    create (ctx) {}
    retrive (ctx, id) {}
    update (ctx, id) {}
    replace (ctx, id) {}
    destory (ctx, id) {}
    more(ctx, id) {}
}
const app = new Koa()
app.use(restify('/users', User))
app.listen()
```

to register multiple resources

```js
app.use(restify({
    '/users': User,
    '/comments': Comment
}))
```

[npm-image]: https://img.shields.io/npm/v/koa-sleepy.svg?style=flat
[npm-url]: https://npmjs.org/package/koa-sleepy
[travis-image]: https://img.shields.io/travis/zweifisch/koa-sleepy.svg?style=flat
[travis-url]: https://travis-ci.org/zweifisch/koa-sleepy
[node-version-image]: https://img.shields.io/node/v/koa-sleepy.svg
[node-version-url]: https://nodejs.org/en/download/
