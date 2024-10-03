const { types, boolean } = require('joi');
const mongoose = require('mongoose');
const { trim } = require('validator');


const roleSchema = mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "orders",
    require: true
  },
  order_details_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "order_details",
  },
  paymentType: {
    type: String,
    enum: ["cash on delivery", "g-pay", "credit card", "upi"],
    require: true
  },
}, {
  timestamps: true
})


const role = mongoose.model('roles', roleSchema, 'roledb');
module.exports = role;