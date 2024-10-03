const httpStatus = require('http-status');
const { Cart } = require('../models');


const createCart = async (req, res) => {
  try {
    const body = req.body;
    const cartDataExist = await Cart.findOne({ user_id: req.authUser._id, product_id: body.product_id });
    if (cartDataExist) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "cart data is alredy exist" });
    }

    body.user_id = req.authUser._id;

    const cart = await Cart.create(req.body);
    return res.status(httpStatus.CREATED).send({ cart });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
  }
}


const getCart = async (req, res) => {
  try {
    const cart = await Cart.find({ user_id: req.authUser._id });
    return res.status(httpStatus.CREATED).send({ cart });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });

  }
}

const updateCart = async (req, res) => {
  try {
    const id = req.params._id;
    const cartDataExist = await Cart.findOne({ _id: id });
    if (!cartDataExist) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "cart data is not exist" });
    }

    const cart = await Cart.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(httpStatus.CREATED).send({ cart });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });

  }
}

const deleteCart = async (req, res) => {
  try {
    const id = req.params._id;
    const cartDataExist = await Cart.findOne({ _id: id });
    if (!cartDataExist) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "cart data is not exist" });
    }

    await Cart.findByIdAndDelete({ _id: id });
    return res.status(httpStatus.CREATED).send({ message: "record delete successfully" });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });

  }
}


module.exports = { createCart, getCart, updateCart, deleteCart };