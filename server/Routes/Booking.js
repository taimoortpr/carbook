const express = require('express');
const router = express.Router();
const Booking = require('../Models/Booking');  
const Admin = require('../Models/User');     

// POST Route: User creates a new booking (status will be defaulted to "Pending")
router.post('/book/:companyName', async (req, res) => {
  const {
    fullName,
    email,
    phone,
    startDate,
    endDate,
    time,
    comments,
    origin,
    destination,
    price,
    distance
  } = req.body;

  const { companyName } = req.params;

  try {
    // Find the admin by company name
    const admin = await Admin.findOne({ companyName });
    if (!admin) {
      return res.status(404).json({ error: 'Company not found.' });
    }

    // Create a new booking with default status as 'Pending'
    const newBooking = new Booking({
      fullName,
      email,
      phone,
      startDate,
      endDate: endDate || null,
      time,
      comments,
      origin,
      destination,
      price,
      distance,
      companyName,
      adminId: admin._id,
      status: 'Pending'  // Default to 'Pending'
    });

    // Save the booking in the database
    await newBooking.save();

    // Send a success response
    res.status(201).json({ message: 'Booking created successfully!' });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// PUT Route: Admin updates the booking status by its ID
router.put('/:companyName/:id/status', async (req, res) => {
  const { id, companyName } = req.params;
  const { status } = req.body;  // Only allow the status to be updated

  try {
    // Find the booking and update only the status
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { status },  // Update only the status
      { new: true }
    );

    // If no booking is found, return a 404 error
    if (!updatedBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Send the updated booking as a response
    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// DELETE Route: Delete a booking by its ID
router.delete('/:companyName/:id', async (req, res) => {
  const { id, companyName } = req.params;

  try {
    // Find and delete the booking by ID
    const deletedBooking = await Booking.findByIdAndDelete(id);

    // If no booking is found, return a 404 error
    if (!deletedBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Send a success message upon deletion
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// GET Route: Get all bookings for a company
router.get('/:companyName', async (req, res) => {
  const { companyName } = req.params;

  try {
    // Fetch all bookings for the specified company
    const bookings = await Booking.find({ companyName });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET Route: Get bookings by company name and specific status (e.g., "Pending", "Confirmed", etc.)
router.get('/:companyName/status/:status', async (req, res) => {
  const { companyName, status } = req.params;

  try {
    // Fetch bookings with the specific status
    const bookings = await Booking.find({ companyName, status });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings by status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.patch("/status/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Failed to update status" });
  }
});
module.exports = router;
