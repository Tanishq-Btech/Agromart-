const mongoose = require('mongoose');

const farmerProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmName: { type: String, required: true },
  farmLocation: { type: String, required: true },
  cropTypes: { type: String, required: true },
  farmSize: { type: String, required: true },
  govIdProof: { type: String },
  landProof: { type: String },
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  ifscCode: { type: String, required: true },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FarmerProfile', farmerProfileSchema);
