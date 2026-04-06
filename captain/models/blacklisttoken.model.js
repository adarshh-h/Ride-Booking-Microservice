const mongoose = require('mongoose');

const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '8h' // ✅ matches JWT expiry, string format
    }
    // ✅ removed timestamps:true — it conflicts with your createdAt TTL field
});


module.exports = mongoose.model('blacklisttoken', blacklistTokenSchema);