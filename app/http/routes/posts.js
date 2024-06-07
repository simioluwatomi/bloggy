const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const validateRequest = require('../middlewares/createPostValidator');
const authenticateUser = require('../middlewares/authMiddleware');

router.get('/', postsController.index);

router.get('/:post', postsController.show)

router.post('/', validateRequest, postsController.store);

router.delete('/:post', authenticateUser, postsController.destroy);

module.exports = router;
