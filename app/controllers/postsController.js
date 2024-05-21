const service = require('../services/postsService')

async function getAllPosts(request, response, next) {
    try {
        const results = await service.getPosts()
   
        response.json({ 'data': results})
    } catch (error) {
        console.log(`Error querying database: ${error}`);
    
        response.status(500).json({error: `Internal server error`});
    }
}

module.exports = {
    getAllPosts
}