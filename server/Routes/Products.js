const express = require('express');
const Product = require('../Models/Product'); // Ensure this path is correct
const { authenticate } = require('../Middleware/AuthController'); // Ensure this path is correct
const router = express.Router();
const upload = require('../multer-config'); // Import the multer config
const Admin = require('../Models/User'); // Import the Admin model


// Add Product Route
router.post('/products', authenticate, upload.array('images'), async (req, res) => {
  console.log('Request Body:', req.body);
  console.log('Uploaded Files:', req.files); // Debug to check uploaded file paths

  try {
    const { productName, description, price } = req.body;
    const images = req.files.map(file => file.filename); // Use just the filename

    const newProduct = new Product({
      productName,
      description,
      price,
      images, // Store the image filenames in the database
      adminId: req.user.adminId, // Associate product with authenticated admin

    });

    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Get Products by User Route
// router.get('/user/:userId', authenticate, async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     console.log(`Fetching products for userId: ${userId}`); // Debugging line
//     const products = await Product.find({ userId });
//     res.json(products);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });
router.get('/products/:companyName', async (req, res) => {
  try {
    const { companyName } = req.params;
    console.log(`Fetching products for company: ${companyName}`);

    if (!companyName) {
      return res.status(400).json({ error: 'Company name is required' });
    }

    const admin = await Admin.findOne({ companyName });
    if (!admin) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Fetch products associated with the admin's ID
    const products = await Product.find({ adminId: admin._id });

    if (products.length === 0) {
      return res.status(404).json({ error: 'No products found for this company' });
    }

    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update Product Route
router.put('/products/:id', authenticate, upload.array('images'), async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, description, price } = req.body;

    // Find the product by ID
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update fields
    product.productName = productName;
    product.description = description;
    product.price = price;

    // Check if new images are uploaded
    if (req.files && req.files.length > 0) {
      product.images = req.files.map(file => file.filename); // Update with new images
    } 
    // If no new images, retain existing ones
    // (No need to do anything since product.images is already set)

    // Save the updated product
    const updatedProduct = await product.save();

    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



// Delete Product Route
router.delete('/products/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // Find the product by ID and delete
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




module.exports = router;
