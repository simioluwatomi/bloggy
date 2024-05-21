const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');

/* GET all posts. */
router.get('/', postsController.index);

router.get('/:post', postsController.show)

module.exports = router;
