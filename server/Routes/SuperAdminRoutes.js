const express = require('express');
const User = require('../Models/User');
const { authenticate, isSuperAdmin } = require('../Middleware/AuthController');
const router = express.Router();

// Apply authentication and superadmin checks globally to all routes in this router
router.use(authenticate, isSuperAdmin);

// Get all users with selected fields
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'email role'); // Select only email and role fields
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user information and roles
router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { email, role } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { email, role },
      { new: true } // Return the updated document
    );
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
