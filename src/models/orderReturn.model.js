const mongoose = require("mongoose");
const { trim } = require("validator");

const orderReturnSchema = mongoose.Schema({
  order_id: {
    require: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "orders"
  },
  reason: {
    require: true,
    type: String,
    trim: true,
  },
  totalReturnValue: {
    type: Number,
    trim: true
  }


}, { timestamps: true });

const orderReturn = mongoose.model("orderReturns", orderReturnSchema, 'orderReturnDB');
module.exports = orderReturn;