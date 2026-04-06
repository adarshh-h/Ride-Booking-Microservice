const jwt = require('jsonwebtoken');
const captainModel = require('../models/captain.model');
const blacklisttokenModel = require('../models/blacklisttoken.model');


module.exports.captainAuth = async (req, res, next) => {
    try {
        const token =
            req.cookies.token ||
            (req.headers.authorization &&
                req.headers.authorization.split(' ')[1]); // ✅ safe check

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const isBlacklisted = await blacklisttokenModel.findOne({ token }); // ✅ findOne not find

        if (isBlacklisted) {
            return res.status(401).json({ message: 'Token expired. Login again.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const captain = await captainModel.findById(decoded.id);

        if (!captain) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.captain = captain;
        next();

    } catch (error) {
        res.status(401).json({ message: 'Invalid token' }); // ✅ 401 not 500
    }
}