const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');

/* GET all posts. */
router.get('/', postsController.getAllPosts);

router.get('/:post', postsController.getPost)

module.exports = router;
