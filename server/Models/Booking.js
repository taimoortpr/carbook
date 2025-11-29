const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String },
  time: { type: String },
  comments: { type: String },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  price: { type: String, required: true },
  distance: { type: String, required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  companyName: { type: String, required: true },
  status: { type: String, default: 'Pending' },  // New status field
});

module.exports = mongoose.model('Bookings1', bookingSchema);
