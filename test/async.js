const { BadRequest } = require('../index')

class Async {
    async list() {
        return []
    }

    async create() {
        return BadRequest({required: ["name"]})
    }
}

module.exports = Async
