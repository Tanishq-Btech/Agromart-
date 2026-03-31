// Run: node seed.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/agromart';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  const User = require('./models/User');
  const FarmerProfile = require('./models/FarmerProfile');
  const Product = require('./models/Product');

  // Clear existing data
  await User.deleteMany({});
  await FarmerProfile.deleteMany({});
  await Product.deleteMany({});
  console.log('Cleared existing data');

  // Create Admin
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@agromart.com',
    phone: '9999999999',
    password: 'admin123',
    role: 'admin'
  });
  console.log('Admin created:', admin.email);

  // Create Farmer
  const farmer = await User.create({
    name: 'Ramesh Kumar',
    email: 'ramesh@farm.com',
    phone: '9876543210',
    password: 'farmer123',
    role: 'farmer'
  });

  const farmerProfile = await FarmerProfile.create({
    user: farmer._id,
    farmName: 'Green Valley Farm',
    farmLocation: 'Nashik, Maharashtra',
    cropTypes: 'Tomatoes, Onions, Wheat, Grapes',
    farmSize: '15 acres',
    bankName: 'State Bank of India',
    accountNumber: '12345678901',
    ifscCode: 'SBIN0001234',
    verificationStatus: 'approved'
  });
  console.log('Farmer created:', farmer.email);

  // Create Customer
  const customer = await User.create({
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '9123456789',
    password: 'customer123',
    role: 'customer'
  });
  console.log('Customer created:', customer.email);

  // Create Sample Products
  const products = [
    {
      name: 'Alphonso Mangoes',
      description: 'Premium Alphonso mangoes from Ratnagiri. Sweet and aromatic.',
      category: 'Fruits',
      price: 380,
      unit: 'dozen',
      stock: 80,
      image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&q=80'
    },
    {
      name: 'Fresh Potatoes',
      description: 'Farm-fresh potatoes. Ideal for curries, fries, and snacks.',
      category: 'Vegetables',
      price: 28,
      unit: 'kg',
      stock: 300,
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80'
    },
    {
      name: 'Green Spinach',
      description: 'Tender baby spinach leaves. Rich in iron and nutrients.',
      category: 'Vegetables',
      price: 30,
      unit: 'kg',
      stock: 100,
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&q=80'
    },
    {
      name: 'Fresh Bananas',
      description: 'Ripe, naturally sweet bananas. Energy-rich and delicious.',
      category: 'Fruits',
      price: 60,
      unit: 'dozen',
      stock: 150,
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&q=80'
    },
    {
      name: 'Red Chillies',
      description: 'Dried red chillies with rich colour and perfect spice levels.',
      category: 'Spices',
      price: 180,
      unit: 'kg',
      stock: 60,
      image: 'https://images.unsplash.com/photo-1581166397057-235af2b3c6dd?w=600&q=80'
    },
    {
      name: 'Fresh Onions',
      description: 'Big, fresh onions. Essential ingredient for all Indian cooking.',
      category: 'Vegetables',
      price: 35,
      unit: 'kg',
      stock: 250,
      image: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=600&q=80'
    },
  ];

  for (const p of products) {
    await Product.create({
      ...p,
      farmer: farmer._id,
      farmerProfile: farmerProfile._id
    });
  }
  console.log(`${products.length} products created`);

  console.log('\n✅ Database seeded successfully!');
  console.log('\n📋 Login Credentials:');
  console.log('Admin    → admin@agromart.com / admin123');
  console.log('Farmer   → ramesh@farm.com / farmer123');
  console.log('Customer → priya@example.com / customer123');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
