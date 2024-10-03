const mongoose = require('mongoose');

const product_detailSchema = mongoose.Schema(
  {
    price: {
      type: Number,
      require: true
    },
    quantity: {
      type: Number,
      require: true
    },

    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products"
    }
  },
  {
    timestamps: true,
  }
);


const Product_details = mongoose.model('Product_details', product_detailSchema, "product_detaildb");

module.exports = Product_details;
