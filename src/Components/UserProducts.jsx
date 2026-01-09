import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Snackbar,
  Box, // Import Box for flexible layout
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add"; // Add Icon for the new product button
import ContentCopyIcon from "@mui/icons-material/ContentCopy"; // Icon for copy actions
import LinkIcon from "@mui/icons-material/Link";
import { useParams } from "react-router-dom";

const UserProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    images: [],
  });
  const [fileInput, setFileInput] = useState([]);
  const { companyName } = useParams();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/api/products/${companyName}`);
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [companyName]);

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:8000/api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProducts(products.filter(product => product._id !== productId));
      setSnackbarMessage("Product deleted successfully!");
      setSnackbarOpen(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete product");
    }
  };

  const handleOpenDialog = (product = null) => {
    setSelectedProduct(product);
    if (product) {
      setFormData({
        productName: product.productName,
        description: product.description,
        price: product.price,
        images: product.images,
      });
    } else {
      resetForm();
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedProduct(null);
    setFormData({
      productName: "",
      description: "",
      price: "",
      images: [],
    });
    setFileInput([]);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFileInput(e.target.files);
  };

  const handleSubmit = async () => {
    const form = new FormData();
    form.append("productName", formData.productName);
    form.append("description", formData.description);
    form.append("price", formData.price);

    // Append new files regardless of update or add
    if (fileInput.length > 0) {
      Array.from(fileInput).forEach((file) => {
        form.append("images", file);
      });
    }
 
    try {
      if (selectedProduct) {
        // UPDATE Logic
        // For PUT/PATCH with file uploads, you must also consider existing files, 
        // though your backend logic will determine how to handle them. 
        // Assuming your backend handles the image replacement/addition.
        const response = await axios.put(
          `http://localhost:8000/api/products/${selectedProduct._id}`,
          form,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
 
        setProducts(
          products.map((product) =>
            product._id === selectedProduct._id ? response.data.product : product
          )
        );
        setSnackbarMessage("Product updated successfully!");
      } else {
        // ADD Logic
        const response = await axios.post(
          `http://localhost:8000/api/products`,
          form,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setProducts([...products, response.data.product]);
        setSnackbarMessage("Product added successfully!");
      }
      handleClose();
      setSnackbarOpen(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit product");
    }
  };

  const handleCopyScript = () => {
    const scriptTag = `<script src="http://localhost:3000/${companyName}/Booking"></script>`;
    navigator.clipboard.writeText(scriptTag).then(
      () => {
        setSnackbarMessage("Script tag copied to clipboard!");
        setSnackbarOpen(true);
      },
      (err) => {
        console.error("Failed to copy text: ", err);
      }
    );
  };

  const handleCopyScriptURL = () => {
    const scriptTag = `http://localhost:3000/${companyName}/Booking`;
    navigator.clipboard.writeText(scriptTag).then(
      () => {
        setSnackbarMessage("Script URL copied to clipboard!");
        setSnackbarOpen(true);
      },
      (err) => {
        console.error("Failed to copy text: ", err);
      }
    );
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#333' }}>
        Product Management 🛍️
      </Typography>
      <Typography variant="h6" gutterBottom sx={{ color: '#555', mb: 4 }}>
        Manage products for: <Box component="span" sx={{ color: '#D70040', fontWeight: 600 }}>{companyName}</Box>
      </Typography>

      {/* --- Action Bar --- */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap' }}>
        
        {/* Add Product Button (Prominent) */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog(null)}
          size="large"
          sx={{
            backgroundColor: '#1a75ff', // Primary blue for Add
            color: 'white',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(26, 117, 255, 0.3)',
            '&:hover': {
              backgroundColor: '#005edb',
              boxShadow: '0 6px 15px rgba(26, 117, 255, 0.4)',
            },
            minWidth: 150,
            mb: { xs: 2, sm: 0 }
          }}
        >
          Add New Product
        </Button>

        {/* Copy Script Buttons */}
        <Box>
          <Button
            variant="outlined"
            onClick={handleCopyScript}
            startIcon={<ContentCopyIcon />}
            sx={{
              borderColor: '#D70040',
              color: '#D70040',
              '&:hover': {
                backgroundColor: 'rgba(215, 0, 64, 0.04)',
                borderColor: '#D70040',
              },
              mr: 1, // Margin Right
            }}
          >
            Copy Script
          </Button>
          <Button
            variant="outlined"
            onClick={handleCopyScriptURL}
            startIcon={<LinkIcon />}
            sx={{
              borderColor: 'grey.500',
              color: 'grey.700',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            Copy Script URL
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />

      {/* --- Product Grid --- */}
      {loading ? (
        <Typography>Loading products...</Typography>
      ) : error ? (
        <Typography color="error" sx={{ mt: 2 }}>
          Error: {error}
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {products.length > 0 ? (
            products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <Card 
                  sx={{ 
                    borderRadius: 3, 
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)', // Elevated look
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                        transform: 'translateY(-5px)', // Slight lift on hover
                        boxShadow: '0 12px 35px rgba(0, 0, 0, 0.15)',
                    }
                  }}
                >
                  {product.images.length > 0 && (
                    <CardMedia
                      component="img"
                      height="200" // Increased height for better image display
                      image={`http://localhost:8000/uploads/${product.images[0]}`}
                      alt={product.productName}
                      sx={{ objectFit: 'cover' }}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>{product.productName}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                        {product.description.substring(0, 80)}...
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 700, color: '#D70040' }}>
                        ${parseFloat(product.price).toFixed(2)}
                    </Typography>
                    
                    {/* Action Icons */}
                    <Box sx={{ display: "flex", justifyContent: "flex-end", borderTop: '1px solid #eee', pt: 1, mt: 1 }}>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleOpenDialog(product)}
                        sx={{ color: '#1a75ff' }} // Blue for Edit
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleDelete(product._id)}
                        sx={{ color: '#D70040' }} // Red for Delete
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}><Typography variant="h6" sx={{ color: 'text.secondary', mt: 2 }}>No products have been added yet.</Typography></Grid>
          )}
        </Grid>
      )}

      {/* --- Dialog (Modal Form) --- */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid #eee', fontWeight: 600 }}>
            {selectedProduct ? "Update Product" : "Add New Product"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            name="productName"
            label="Product Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.productName}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={formData.description}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="price"
            label="Price"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.price}
            onChange={handleChange}
            inputProps={{ step: "0.01" }} // Ensure price is handled correctly
            sx={{ mb: 2 }}
          />
          <Box sx={{ my: 2 }}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>Upload Images:</Typography>
            <input 
                type="file" 
                multiple 
                onChange={handleFileChange} 
                style={{ display: 'block', paddingBottom: '10px' }}
            />
          </Box>
          
          {/* Current Images Display in Dialog */}
          {formData.images.length > 0 && (
            <Box sx={{ mt: 2, borderTop: '1px solid #eee', pt: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>Current Images:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.images.map((img, index) => (
                  <img
                    key={index}
                    src={`http://localhost:8000/uploads/${img}`}
                    alt={`Product Image ${index + 1}`}
                    style={{ width: "80px", height: "80px", objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                ))}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Note: Uploading new images will replace/add to existing ones (based on backend logic).
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #eee', p: 2 }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            sx={{ 
                backgroundColor: selectedProduct ? '#1a75ff' : '#00b0ff', // Different color for Update/Add
                '&:hover': { backgroundColor: selectedProduct ? '#005edb' : '#0083c2' }
            }}
          >
            {selectedProduct ? "Update Product" : "Add Product"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserProducts;