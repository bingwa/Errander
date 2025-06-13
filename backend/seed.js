// backend/seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from './models/Service.js';

dotenv.config();

const services = [
    {
        name: 'Grocery Delivery',
        description: 'Get your groceries delivered from your favorite local stores.',
        baseRate: 15, // Example base rate
        iconUrl: '🛒', // Using emoji as a simple icon
    },
    {
        name: 'House Cleaning',
        description: 'Professional cleaning for your home or apartment.',
        baseRate: 50,
        iconUrl: '🧹',
    },
    {
        name: 'Laundry Service',
        description: 'Pickup, wash, fold, and delivery of your laundry.',
        baseRate: 25,
        iconUrl: '🧺',
    },
    {
        name: 'Package Delivery',
        description: 'Send or receive packages quickly within the city.',
        baseRate: 10,
        iconUrl: '📦',
    },
    {
        name: 'Pharmacy Runs',
        description: 'Get your prescriptions and pharmacy items delivered.',
        baseRate: 12,
        iconUrl: '💊',
    },
    {
        name: 'Custom Task',
        description: 'Need something else done? Describe your task here.',
        baseRate: 20,
        iconUrl: '✨',
    }
];

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/erranderApp';

const seedDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected for seeding...');
        
        // Clear existing services to avoid duplicates
        await Service.deleteMany({});
        console.log('Cleared existing services.');

        // Insert the new services
        await Service.insertMany(services);
        console.log('Database seeded successfully with services!');
    } catch (error) {
        console.error('Error seeding the database:', error);
    } finally {
        // Disconnect from the database
        await mongoose.disconnect();
        console.log('MongoDB disconnected.');
    }
};

seedDB();
