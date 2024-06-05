
class AuthenticationError extends Error {
    constructor(message) {
        super(message)
        this.name = this.constructor.name
        this.statusCode = 401
        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = AuthenticationError