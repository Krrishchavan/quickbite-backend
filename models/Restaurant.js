const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    image: { type: String } // URL to image
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
