class ResourceExists extends Error {
    constructor(message) {
        super(message)
        this.name = this.constructor.name
        this.statusCode = 409
        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = ResourceExists