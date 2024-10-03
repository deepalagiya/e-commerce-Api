const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    stock: {
      type: Number,
    },
    image: {
      type: String,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    },

    summary: {
      type: String,
      require: true
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categorys"
    }

  },
  {
    timestamps: true,
  }
);


const Product = mongoose.model('products', productSchema, "productdb");

module.exports = Product;
