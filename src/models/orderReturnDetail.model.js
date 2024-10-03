const mongoose = require("mongoose");

const orderReturnDetailsSchema = mongoose.Schema({


  order_return_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "orderReturns"
  },
  quantity: {
    type: Number,
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
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products"
  }


}, { timestamps: true });

const orderReturnDetail = mongoose.model("orderReturnDetails", orderReturnDetailsSchema, 'orderReturnDetaildb');
module.exports = orderReturnDetail;