const express = require('express');
const router = express.Router();
const frienshipController = require('../controllers/friendship_controller');

// router.get('/add/:id', frienshipController.add);
router.post('/create_friendship', frienshipController.add);
// router.post('/remove_friendship/:id', frienshipController.remove);
router.post('/remove_friendship', frienshipController.remove);
router.get('/fetch_user_friends', frienshipController.fetchUserFriends);

module.exports = router;