const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    require: true,
    trim: true
  },
  lastName: {
    type: String,
    require: true,
    trim: true
  },
  email: {
    type: String,
    require: true,
    trim: true
  },
  password: {
    type: String,
    require: true,
    trim: true
  },
  mobileNumber: {
    type: Number,
    require: true,
    trim: true
  },
  bio: {
    type: Object,
    require: true,
    trim: true
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "roles"

  },
  randomToken: {
    type: String,
    default: ""
  },
  otp: {
    type: Number,
    default: ""

  },
  lastLogin: {
    type: Date,

  },
  ip: {
    type: String
  }

}, {
  timestamps: true
});


const user = mongoose.model("users", userSchema, 'userdb');
module.exports = user;