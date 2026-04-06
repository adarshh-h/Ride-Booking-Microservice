const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const blacklisttokenModel = require('../models/blacklisttoken.model');

module.exports.userAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      (req.headers.authorization &&
        req.headers.authorization.split(' ')[1]);

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const isBlacklisted = await blacklisttokenModel.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({ message: 'Token expired. Login again.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
if (!decoded || !decoded.id) {
  return res.status(401).json({ message: 'Invalid token' });
}

    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = user;
    next();

  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};