const mongoose = require('mongoose');

const categorySchema = mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      trim: true,
    },

  },
  {
    timestamps: true,
  }
);


const category = mongoose.model('categorys', categorySchema, "categorydb");

module.exports = category;
