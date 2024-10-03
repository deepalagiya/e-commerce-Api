const mongoose = require('mongoose');



const permitionSchema = mongoose.Schema({
  name: {
    type: String,
    require: true
  }
}, { timestamps: true })


const permition = mongoose.model("permitions", permitionSchema, "permitiondb");
module.exports = permition;