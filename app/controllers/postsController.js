const service = require('../services/postsService')

async function index(request, response) {
    try {
        const results = await service.getPosts()
   
        response.json({ 'data': results})
    } catch (error) {
        console.log(`Error querying database: ${error}`);
    
        response.status(500).json({ 'data': { 'error': 'Error querying database' } });
    }
}

async function show(request, response) {
    try {
        const result = await service.getPost(request.params.post)
   
        response.json({ 'data': result})
    } catch (error) {
        console.log(`Error querying database: ${error}`);
    
        response.status(500).json({ 'data': { 'error': 'Error querying database' } });
    }
}

module.exports = {
    index,
    show
}