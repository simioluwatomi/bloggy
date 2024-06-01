const service = require('../services/authenticationService')

async function register(request, response) {
    try {
        const results = await service.registerUser(request.body)
   
        response.json({ 'data': results})
    } catch (error) {
        console.log(`Error querying database: ${error}`);
    
        response.status(500).json({ 'data': { 'error': 'Error registering user' } });
    }
}

module.exports = {
    register
}