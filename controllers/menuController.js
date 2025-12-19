const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');

exports.getMenu = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const menu = await MenuItem.find({ restaurantId });
        res.json(menu);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.addMenuItem = async (req, res) => {
    try {
        let { name, price, restaurantId, image } = req.body;

        // If restaurantId is not provided, or we want to enforce security, ensure it belongs to the logged in user
        if (req.user.role === 'restaurant') {
            const restaurant = await Restaurant.findOne({ ownerId: req.user.userId });
            if (!restaurant) {
                return res.status(404).json({ message: 'Restaurant not found for this user' });
            }
            restaurantId = restaurant._id;
        }

        const newItem = new MenuItem({ name, price, restaurantId, image });
        await newItem.save();
        res.json(newItem);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
