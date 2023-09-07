const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: String, require: true },
  customerId: { type: String },
  purchaseDate: { type: Date, default: Date.now },
  paymentIntentId: { type: String },
  products: [
    {
      productId: { type: String, require: true },
      quantity: { type: Number },
      images: {
        type: Array,
      },
      name: { type: String },
    },
  ],
  subtotal: { type: Number, required: true },
  total: { type: Number, required: true },
  shipping: { type: Object, required: true },
  delivery_status: { type: String, default: "Pendiente" },
  payment_status: { type: String },
});

module.exports = mongoose.model("Order", orderSchema);
