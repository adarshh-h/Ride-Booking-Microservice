const jwt = require('jsonwebtoken');
const axios = require('axios');


module.exports.userAuth = async (req, res, next) => {
    try {
        const token =
            req.cookies.token ||
            (req.headers.authorization &&
                req.headers.authorization.split(' ')[1]);

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // ✅ Step 1: Verify token locally
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ Step 2: Optional - fetch user from user service
        const response = await axios.get(
            `http://localhost:3000/api/users/profile`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const user = response.data;

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = user; // or decoded if you want fallback

        next();

    } catch (error) {
        console.error(error.message);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports.captainAuth = async (req, res, next) => {
    try {
        const token =
            req.cookies.token ||
            (req.headers.authorization &&
                req.headers.authorization.split(' ')[1]);

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const response = await axios.get(
            `http://localhost:3000/api/captains/profile`, // ✅ FIX THIS
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const captain = response.data;

        if (!captain) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.captain = captain;

        next();

    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};