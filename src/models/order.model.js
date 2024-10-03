const { ref, types } = require("joi");
const mongoose = require("mongoose");
const { trim } = require("validator");

const orderSchema = mongoose.Schema({
  amount: {
    type: Number,
    trim: true
  },

  shippingAddress: {
    type: String,
    trim: true,
    require: true
  },
  city: {
    type: String,
    trim: true,
    require: true
  },
  pinCode: {
    type: Number,
    trim: true,
    require: true
  },
  phone: {
    type: Number,
    trim: true,
    require: true
  },
  orderStatus: {
    type: String,
    default: "pending",
    enum: ["cancel", "pending", "shipping", "orderComplete"]

  },
  paymentType: {
    type: String,
    enum: ["online", "offLine"],
    require: true
  },
  paymentImage: {
    type: String
  },
  orderDate: {
    type: Date,
    default: Date.now()
  },
  updated_At: {
    type: Date,
    // default: Date.now() + 8 * 60 * 60 * 1000
    default: Date.now() + 60 * 2000
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },


}, {
  timestamps: true
});


const order = mongoose.model("orders", orderSchema, 'orderdb');
module.exports = order;