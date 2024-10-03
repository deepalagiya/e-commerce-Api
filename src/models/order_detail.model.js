const { ref, types } = require("joi");
const mongoose = require("mongoose");
const { trim } = require("validator");

const order_detailsSchema = mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products"
  },
  quantity: {
    type: Number,
    require: true,
    trim: true
  },

  price: {
    type: Number,
    trim: true
  },
  totalPrice: {
    type: Number,
    trim: true
  },


  product_details_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product_details"
  },
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "orders"
  },
  cart_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts"
  }
}, {
  timestamps: true
});


const order_detail = mongoose.model("order_details", order_detailsSchema, 'order_detaildb');
module.exports = order_detail;