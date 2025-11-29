const express = require('express');
const router = express.Router();
const { authenticate, isAdmin, isSuperAdmin } = require('../Middleware/AuthController');


router.get('/admin', authenticate, isAdmin, (req, res) => {
  res.json({ message: 'Welcome Admin!' });
});

// Protected Route for Superadmins
router.get('/superadmin', authenticate, isSuperAdmin, (req, res) => {
  res.json({ message: 'Welcome Superadmin!' });
});

module.exports = router;
