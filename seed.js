const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');
const bcrypt = require('bcryptjs');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Restaurant.deleteMany({});
        await MenuItem.deleteMany({});
        console.log('Cleared existing data');

        // Create dummy restaurant owners
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const owners = await User.insertMany([
            { name: 'Pizza Palace Owner', email: 'pizza@example.com', password: hashedPassword, role: 'restaurant' },
            { name: 'Burger Barn Owner', email: 'burger@example.com', password: hashedPassword, role: 'restaurant' },
            { name: 'Sushi Station Owner', email: 'sushi@example.com', password: hashedPassword, role: 'restaurant' },
            { name: 'Taco Town Owner', email: 'taco@example.com', password: hashedPassword, role: 'restaurant' },
            { name: 'Pasta Paradise Owner', email: 'pasta@example.com', password: hashedPassword, role: 'restaurant' }
        ]);

        console.log('Created restaurant owners');

        // Create restaurants with images
        const restaurants = await Restaurant.insertMany([
            {
                name: 'Pizza Palace',
                ownerId: owners[0]._id,
                image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'
            },
            {
                name: 'Burger Barn',
                ownerId: owners[1]._id,
                image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'
            },
            {
                name: 'Sushi Station',
                ownerId: owners[2]._id,
                image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400'
            },
            {
                name: 'Taco Town',
                ownerId: owners[3]._id,
                image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400'
            },
            {
                name: 'Pasta Paradise',
                ownerId: owners[4]._id,
                image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400'
            }
        ]);

        console.log('Created restaurants');

        // Create menu items for each restaurant
        const menuItems = [];

        // Pizza Palace Menu
        menuItems.push(
            { name: 'Margherita Pizza', price: 299, restaurantId: restaurants[0]._id, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300' },
            { name: 'Pepperoni Pizza', price: 349, restaurantId: restaurants[0]._id, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300' },
            { name: 'Veggie Supreme', price: 329, restaurantId: restaurants[0]._id, image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=300' },
            { name: 'BBQ Chicken Pizza', price: 379, restaurantId: restaurants[0]._id, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300' }
        );

        // Burger Barn Menu
        menuItems.push(
            { name: 'Classic Burger', price: 199, restaurantId: restaurants[1]._id, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300' },
            { name: 'Cheese Burger', price: 229, restaurantId: restaurants[1]._id, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=300' },
            { name: 'Bacon Burger', price: 259, restaurantId: restaurants[1]._id, image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=300' },
            { name: 'Veggie Burger', price: 189, restaurantId: restaurants[1]._id, image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=300' }
        );

        // Sushi Station Menu
        menuItems.push(
            { name: 'California Roll', price: 249, restaurantId: restaurants[2]._id, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300' },
            { name: 'Salmon Nigiri', price: 299, restaurantId: restaurants[2]._id, image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=300' },
            { name: 'Spicy Tuna Roll', price: 279, restaurantId: restaurants[2]._id, image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=300' },
            { name: 'Dragon Roll', price: 329, restaurantId: restaurants[2]._id, image: 'https://images.unsplash.com/photo-1582450871972-ab5ca641643d?w=300' }
        );

        // Taco Town Menu
        menuItems.push(
            { name: 'Beef Tacos', price: 149, restaurantId: restaurants[3]._id, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300' },
            { name: 'Chicken Tacos', price: 139, restaurantId: restaurants[3]._id, image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=300' },
            { name: 'Fish Tacos', price: 169, restaurantId: restaurants[3]._id, image: 'https://images.unsplash.com/photo-1624300603058-5f8f92270b8d?w=300' },
            { name: 'Veggie Tacos', price: 129, restaurantId: restaurants[3]._id, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300' }
        );

        // Pasta Paradise Menu
        menuItems.push(
            { name: 'Spaghetti Carbonara', price: 279, restaurantId: restaurants[4]._id, image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=300' },
            { name: 'Penne Arrabbiata', price: 249, restaurantId: restaurants[4]._id, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300' },
            { name: 'Fettuccine Alfredo', price: 269, restaurantId: restaurants[4]._id, image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=300' },
            { name: 'Lasagna', price: 299, restaurantId: restaurants[4]._id, image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=300' }
        );

        await MenuItem.insertMany(menuItems);
        console.log('Created menu items');

        // Create a demo customer
        await User.create({
            name: 'Demo Customer',
            email: 'customer@example.com',
            password: hashedPassword,
            role: 'customer'
        });

        // Create a demo rider
        await User.create({
            name: 'Demo Rider',
            email: 'rider@example.com',
            password: hashedPassword,
            role: 'rider'
        });

        console.log('✅ Seed completed successfully!');
        console.log('\nDemo Credentials:');
        console.log('Customer: customer@example.com / password123');
        console.log('Rider: rider@example.com / password123');
        console.log('Restaurant Owners: pizza@example.com, burger@example.com, etc. / password123');

        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedData();
