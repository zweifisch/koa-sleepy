const { BadRequest } = require('../index')

class Errors {

    replace(ctx) {
        return BadRequest({required: ["name"]})
    }

    async create(ctx) {
        throw Error("Async")
    }

    list() {
        throw Error("Sync")
    }
}

module.exports = Errors
