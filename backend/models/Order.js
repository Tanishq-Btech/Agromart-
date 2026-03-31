const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  image: String,
  price: Number,
  quantity: Number,
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  deliveryAddress: {
    name: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  paymentMethod: { type: String, default: 'Cash on Delivery' },
  status: {
    type: String,
    enum: ['placed', 'accepted', 'shipped', 'delivered', 'cancelled'],
    default: 'placed'
  },
  estimatedDelivery: { type: String, default: '3-5 business days' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
