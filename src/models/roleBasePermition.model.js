const { ref } = require("joi");
const mongoose = require("mongoose");



const roleBasePermition = mongoose.Schema({
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "roles"
  },
  permition: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "permitions"
  },
  read: {
    type: Boolean,
    require: true,
    default: false
  },
  write: {
    type: Boolean,
    require: true,
    default: false

  },
  update: {
    type: Boolean,
    require: true,
    default: false

  },
  delete: {
    type: Boolean,
    require: true,
    default: false

  }
}, { timestamps: true });



const rolePermition = mongoose.model("rolePermitions", roleBasePermition, "rolePermitiondb");
module.exports = rolePermition;