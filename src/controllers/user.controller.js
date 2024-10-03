const httpStatus = require("http-status");
const { User } = require("../models");
const bcrypt = require("bcryptjs/dist/bcrypt");



const createUser = async (req, res) => {
  try {
    console.log("req.body : --> ", req.body);

    const body = req.body; // shallow copy

    // const body = JSON.parse(JSON.stringify(req.body)); // deep copy

    const userExist = await User.findOne({ email: body.email });
    if (userExist) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "user alredy exist" });
    }
    body.password = await bcrypt.hash(body.password, 8);
    body.ip = await req.ip;
    body.lastLogin = Date.now();
    console.log("body : --> ", body);
    const user = await User.create(req.body);
    console.log("user : -->", user);

    return res.status(httpStatus.CREATED).send({ user });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }

}

const getUser = async (req, res) => {
  try {
    const user = await User.find().populate("role");
    return res.status(httpStatus.CREATED).send({ user });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }

}

const updateUser = async (req, res) => {
  try {
    const id = req.params._id;
    const userExist = await User.findOne({ _id: id });
    if (!userExist) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "user not exist" });
    }
    req.body.password = await bcrypt.hash(req.body.password);
    const user = await User.findOneAndUpdate({ _id: id }, req.body, { new: true });
    return res.status(httpStatus.CREATED).send({ user });


  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}

const deleteUser = async (req, res) => {
  try {
    const id = req.params._id;
    const userExist = await User.findOne({ _id: id });
    if (!userExist) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "user not exist" });
    }

    const user = await User.findOneAndRemove({ _id: id });
    return res.status(httpStatus.CREATED).send({ message: "record delete successfully" });


  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}




module.exports = { createUser, getUser, updateUser, deleteUser }