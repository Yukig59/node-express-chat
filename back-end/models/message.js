const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    text: { type: String, required: true },
    sender: { type: String, required: true },
});

module.exports = mongoose.model('Message', messageSchema);