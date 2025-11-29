const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }],
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true }, // Reference to Admin
});

module.exports = mongoose.model("CarProducts", productSchema);
