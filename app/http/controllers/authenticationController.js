const service = require('./../../services/authenticationService')

async function register(request, response) {
    try {
        const results = await service.registerUser(request.body)
   
        response.json({ 'data': results})
    } catch (error) {
        console.log(`Error querying database: ${error}`);
    
        response.status(error.statusCode ?? 500).json({ 'data': { 'error': `${error.message}` } });
    }
}

async function login(request, response) {
    try {
        const results = await service.login(request.body.username_or_email, request.body.password)
   
        response.json({ 'data': results})
    } catch (error) {
        console.log(`Error querying database: ${error}`);
    
        response.status(error.statusCode ?? 500).json({ 'data': { 'error': `${error.message}` } });
    }
}

async function requestPasswordReset(request, response) {
    try {
        const results = await service.initiatePasswordReset(request.body.email ?? request.body.username)
   
        response.json({ 'data': results})
    } catch (error) {
        console.log(`Error querying database: ${error}`);
    
        response.status(error.statusCode ?? 500).json({ 'data': { 'error': `${error.message}` } });
    }
}

async function completePasswordReset(request, response) {
    try {
        const results = await service.resetPassword(request.body.token, request.body.password)
   
        response.json({ 'data': results})
    } catch (error) {
        console.log(`Error querying database: ${error}`);
    
        response.status(error.statusCode ?? 500).json({ 'data': { 'error': `${error.message}` } });
    }
}

module.exports = {
    register,
    login,
    requestPasswordReset,
    completePasswordReset
}