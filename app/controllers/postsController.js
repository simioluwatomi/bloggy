const service = require('../services/postsService')

async function index(request, response, next) {
    try {
        const results = await service.getPosts()
   
        response.json({ 'data': results})
    } catch (error) {
        console.log(`Error querying database: ${error}`);
    
        response.status(500).json({error: `Internal server error`});
    }
}

async function show(request, response, next) {
    try {
        const result = await service.getPost(request.params.post)
   
        response.json({ 'data': result})
    } catch (error) {
        console.log(`Error querying database: ${error}`);
    
        response.status(500).json({error: `Internal server error`});
    }
}

module.exports = {
    index,
    show
}