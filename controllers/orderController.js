const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
    try {
        const { restaurantId, items, totalAmount, deliveryAddress } = req.body;

        // Auto-assign an available rider (simulate by finding any rider)
        const User = require('../models/User');
        const availableRider = await User.findOne({ role: 'rider' });

        const newOrder = new Order({
            customerId: req.user.userId,
            restaurantId,
            items,
            totalAmount,
            deliveryAddress,
            riderId: availableRider ? availableRider._id : null
        });
        await newOrder.save();
        res.json(newOrder);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        // If restaurant, find by restaurantId (need to look up restaurant owned by user)
        // For simplicity/MVP, let's assume customer fetches their orders
        // Or we handle roles here.

        // Simple logic:
        // If customer, find by customerId
        // If restaurant, find by restaurantId (requires knowing which restaurant they own)
        // If rider, find available orders or accepted orders?

        // Let's implement customer view primarily as per specific requirement for "View order status"
        // And Restaurant "View orders"

        let query = {};
        if (req.user.role === 'customer') {
            query.customerId = req.user.userId;
        } else if (req.user.role === 'restaurant') {
            // This is a bit tricky without a direct link in User to Restaurant or passing restaurantId
            // We'll require restaurantId to be passed or looked up.
            // For MVP, enable passing ?restaurantId=... or looking up restaurant where ownerId = userId
            /* 
               const Restaurant = require('../models/Restaurant');
               const rest = await Restaurant.findOne({ ownerId: req.user.userId });
               if(rest) query.restaurantId = rest._id;
            */
            // Let's implement the lookup just to be safe and clean.
            const Restaurant = require('../models/Restaurant');
            const rest = await Restaurant.findOne({ ownerId: req.user.userId });
            if (rest) {
                query.restaurantId = rest._id;
            } else {
                return res.json([]); // No restaurant found for this user
            }
        } else if (req.user.role === 'rider') {
            // Riders see orders that are ready or assigned to them
            query = { $or: [{ status: 'ready' }, { riderId: req.user.userId }] };
        }

        const orders = await Order.find(query).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ message: 'Order not found' });

        // Add logic: if rider accepts, set riderId
        if (req.user.role === 'rider' && status === 'out_for_delivery' && !order.riderId) {
            order.riderId = req.user.userId;
        }

        order.status = status;
        await order.save();
        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
