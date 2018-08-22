const map = {
    DELETE: 'destroy',
    PUT: 'replace',
    PATCH: 'update',
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
        if (segments.length === 2) {
            let [id, action] = segments
            if (actions.has(action))
                return [action, id]
        }
        return ['notFund']
    }
    return ['methodNotAllowed']
}

module.exports = dispatch
