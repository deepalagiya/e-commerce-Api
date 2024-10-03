const mongoose = require("mongoose");
const { trim } = require("validator");

const cartSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products"
  },
  quantity: {
    type: Number,
    require: true,
    trim: true
  },
  is_Active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });


const cart = mongoose.model("carts", cartSchema, 'cartdb');
module.exports = cart;