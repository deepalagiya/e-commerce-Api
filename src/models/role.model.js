const { types, boolean } = require('joi');
const mongoose = require('mongoose');
const { trim } = require('validator');


const roleSchema = mongoose.Schema({
  roleName: {
    type: String,
    trim: true,
    require: true
  },
  isActive: {
    type: Boolean,
    require: true
  }
}, {
  timestamps: true
})


const role = mongoose.model('roles', roleSchema, 'roledb');
module.exports = role;