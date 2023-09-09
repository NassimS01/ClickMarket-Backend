const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Debes ingresar tu nombre!"],
  },
  email: {
    type: String,
    required: [true, "Debes ingresar tu email!"],
  },
  password: {
    type: String,
    required: [true, "Debes ingresar tu password"],
    minLength: [4, "El password debe ser mayor a 4 caracteres"],
    select: false,
  },
  role: {
    type: String,
    default: "user",
  },
  active: {
    type: Boolean,
    default: true,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  cart: [
    {
      type: Object,
      ref: "Product",
    },
  ],
  // cart: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Product',
  //   },
  // ],
  order: [
    {
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
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  resetPasswordToken: String,
  resetPasswordTime: Date,
});

//  Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// jwt token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
