const mongoose = require('mongoose');

module.exports = mongoose.model('User', {
    _id: { type: String, required: true },
    balance: { type: Number, required: true, default: 0 },
    inventory: { type: Array, required: true },
    cooldowns: { type: Array, required: true }
})