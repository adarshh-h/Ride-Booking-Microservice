const rideModel = require('../models/ride.model');

// ✅ Create Ride
module.exports.createRide = async (req, res) => {
    try {
        const { pickup, destination } = req.body;

        if (!pickup || !destination) {
            return res.status(400).json({ message: 'All fields required' });
        }

        const ride = await rideModel.create({
            user: req.user._id,
            pickup,
            destination
        });

        res.status(201).json(ride);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Accept Ride (BEST VERSION)
module.exports.acceptRide = async (req, res) => {
    try {
        const { rideId } = req.query;

        if (!rideId) {
            return res.status(400).json({ message: 'rideId is required' });
        }

        const ride = await rideModel.findOneAndUpdate(
            { _id: rideId, status: 'requested' }, // atomic condition
            {
                status: 'accepted',
                captain: req.captain._id
            },
            { new: true }
        );

        if (!ride) {
            return res.status(400).json({
                message: 'Ride already accepted or not found'
            });
        }

        res.json({
            message: 'Ride accepted successfully',
            ride
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Start Ride
module.exports.startRide = async (req, res) => {
    try {
        const { rideId } = req.query;

        const ride = await rideModel.findById(rideId);

        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        if (ride.status !== 'accepted') {
            return res.status(400).json({
                message: 'Ride must be accepted first'
            });
        }

        // only assigned captain can start
        if (ride.captain.toString() !== req.captain._id.toString()) {
            return res.status(403).json({
                message: 'Not authorized for this ride'
            });
        }

        ride.status = 'started';
        await ride.save();

        res.json({ message: 'Ride started', ride });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Complete Ride
module.exports.completeRide = async (req, res) => {
    try {
        const { rideId } = req.query;

        const ride = await rideModel.findById(rideId);

        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        if (ride.status !== 'started') {
            return res.status(400).json({
                message: 'Ride must be started first'
            });
        }

        ride.status = 'completed';
        await ride.save();

        res.json({ message: 'Ride completed', ride });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};