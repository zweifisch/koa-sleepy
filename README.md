

```js
const mount = require("koa-mount")
const resource = require("koa-sleepy")

class Users {
    create: (ctx, next) {
    }
}

app.use(mount("/users", resource(new Users)))
```
