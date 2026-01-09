const multer = require('multer');
const path = require('path');

// Define the destination folder
const imageFolder = path.join(__dirname, 'images');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageFolder); // Save files in 'server/images' folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Set file name
  }
});

// File filter to accept image files (GIF, JPG, PNG, JFIF)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|jfif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed (JPEG, JFIF, PNG, GIF)'));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter, // Use file filter to restrict file types
  limits: { fileSize: 1024 * 1024 * 5 } // Set file size limit to 5MB
});

module.exports = upload;
