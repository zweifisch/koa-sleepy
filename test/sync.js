class Sync {

    create(ctx) {
    }

    retrive(ctx, id) {
        return id
    }

    replace(ctx, id) {
        ctx.body = {updated: id}
    }

    update(ctx, id) {
        return `${id} updated`
    }

    list(ctx) {
        return []
    }

    destroy(ctx, id) {
        return `${id} deleted`
    }

    custom(ctx, id) {
        return `custom action on ${id}`
    }
}

module.exports = Sync
