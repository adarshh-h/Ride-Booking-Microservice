const mongoose = require('mongoose');

const blacklistTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '8h'  // ✅ matches your JWT expiry of 8h
  }
});

module.exports = mongoose.model('BlacklistToken', blacklistTokenSchema);