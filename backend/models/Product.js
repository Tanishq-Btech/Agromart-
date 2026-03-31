const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmerProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmerProfile' },
  name: { type: String, required: true },
  description: { type: String },
  category: {
    type: String,
    enum: ['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Spices', 'Other'],
    required: true
  },
  price: { type: Number, required: true },
  unit: { type: String, default: 'kg' },
  stock: { type: Number, required: true },
  image: { type: String },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
