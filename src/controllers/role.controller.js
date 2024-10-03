const httpStatus = require("http-status");
const { Role } = require("../models");
const { create } = require("../models/user.model");



const createRole = async (req, res) => {
  try {

    const body = req.body;
    const roleExist = await Role.findOne({ roleName: body.roleName });
    if (roleExist) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "role alredy exist" });

    }

    const role = await Role.create(req.body);
    return res.status(httpStatus.CREATED).send({ role });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}

const getRole = async (req, res) => {
  try {
    const role = await Role.find();
    return res.status(httpStatus.CREATED).send({ role });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }

}

const updateRole = async (req, res) => {
  try {
    const id = req.params._id;
    const roleExist = await Role.findOne({ _id: id });
    if (!roleExist) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "role not exist" });
    }

    const role = await Role.findOneAndUpdate({ _id: id }, req.body, { new: true });
    return res.status(httpStatus.CREATED).send({ role });


  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}

const deleteRole = async (req, res) => {
  try {
    const id = req.params._id;
    const roleExist = await Role.findOne({ _id: id });
    if (!roleExist) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "user not exist" });
    }

    const role = await Role.findOneAndRemove({ _id: id });
    return res.status(httpStatus.CREATED).send({ message: "record delete successfully" });


  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}





module.exports = { createRole, getRole, updateRole, deleteRole };