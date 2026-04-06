const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Auth Routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/logout', authMiddleware.userAuth, userController.logout);
router.get('/profile', authMiddleware.userAuth, userController.profile);

module.exports = router;