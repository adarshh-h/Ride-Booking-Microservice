const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const rideController = require('../controllers/ride.controller');

// user creates ride
router.post('/createride', authMiddleware.userAuth, rideController.createRide);

// captain accepts ride
router.put('/acceptride', authMiddleware.captainAuth, rideController.acceptRide);

// captain starts ride
router.put('/startride', authMiddleware.captainAuth, rideController.startRide);

// captain completes ride
router.put('/completeride', authMiddleware.captainAuth, rideController.completeRide);

module.exports = router;