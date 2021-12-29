const mongoose = require('mongoose');

module.exports = mongoose.model('Guild', {
    _id: { type: String, required: true },
    items: { type: Array, required: true },
    managerRole: { type: String, required: true }
})