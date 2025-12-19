const Restaurant = require('../models/Restaurant');

exports.getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
