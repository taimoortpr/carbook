const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { authenticate, isAdmin, isSuperAdmin } = require('../Middleware/AuthController');

// User Registration
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, companyName, phone, password } = req.body;

  // Email regex pattern to validate correct email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Password regex pattern to ensure strong password
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Company name regex
  const companyNameRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  try {
    
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }


    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character'
      });
    }


    const formattedCompanyName = companyName.toLowerCase().replace(/\s+/g, '-');
    
 
    if (!companyNameRegex.test(formattedCompanyName)) {
      return res.status(400).json({ 
        message: 'Company name must be lowercase and can only contain letters, numbers, and hyphens (no spaces).' 
      });
    }

   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Check if the companyName is already used
    const existingCompany = await User.findOne({ companyName: formattedCompanyName });
    if (existingCompany) {
      return res.status(400).json({ message: 'Company name is already taken' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      companyName: formattedCompanyName,
      phone,  // Ensure phone field is included in the User schema
      password: hashedPassword,
      role: 'admin'
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Respond with success
    res.status(201).json({ message: 'User registered successfully', user: savedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// User Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Respond with token and user data
    res.json({
      token,
      role: user.role,
      adminId: user._id,
      firstName: user.firstName, // Include first name
      lastName: user.lastName ,   // Include last name
      companyName: user.companyName, // Ensure this is included in your user model
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Current User Info
router.get('/me', authenticate, async (req, res) => {
  try {
    // Fetch the current user by their ID
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Respond with user details
    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      companyName: user.companyName || 'No Company Name Provided',
      phone: user.phone,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Test Endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint is working!' });
});

module.exports = router;
