const httpStatus = require("http-status");
const { Order, Product, Product_details, Order_details, Cart } = require("../models");
const { saveFile, removeFile } = require("../utils/helper");
const mongoose = require('mongoose')


const createOrder = async (req, res) => {
  try {
    const { Order_detail, ...body } = req.body;

    for (let i = 0; i < Order_detail.length; i++) {

      const stockHandle = await Product.findOne({ _id: Order_detail[i].product_id, stock: { $gte: Order_detail[i].quantity } });

      if (!stockHandle) {
        return res.status(httpStatus.BAD_REQUEST).send({ message: `this product order is ${Order_detail[i].quantity} and stock is out of stock` });
      }

    }

    body.user_id = req.authUser._id;
    const order = await Order.create(body);


    await Order_detail.forEach(async (item, index) => {

      await Cart.findByIdAndUpdate(item.cart_id, { is_Active: false }, { new: true });

      await Product.findByIdAndUpdate(item.product_id, { $inc: { stock: -item.quantity } });

      const productDetail = await Product_details.findOne({ product_id: item.product_id }).sort({ price: -1 });

      item.price = productDetail.price;
      item.totalPrice = productDetail.price * item.quantity;

      const productDetail_quantity = await Product_details.findOne({ product_id: item.product_id, quantity: { $gte: item.quantity } }).sort({ createdAt: 1 });

      await Product_details.findByIdAndUpdate(productDetail_quantity._id, { $inc: { quantity: - item.quantity } });

      item.product_details_id = productDetail_quantity._id;
      item.order_id = order._id;

      await Order_details.create(item);

      await Order.findByIdAndUpdate(order._id, { $inc: { amount: item.totalPrice } });


    });

    return res.status(httpStatus.CREATED).send({ message: "order create successfully" });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
};


const orderGet = async (req, res) => {
  try {
    const order = await Order.find();
    return res.status(httpStatus.CREATED).send({ order });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}



const orderUpdate = async (req, res) => {
  try {

    const id = req.params._id;
    const { Order_detail, ...body } = req.body;


    const currentDate = Date.now();
    const valideDeleteDate = new Date(orderExist.updated_At).getTime();

    if (currentDate > valideDeleteDate) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "order delete time is over" });
    }



    if (!Order_detail.length) {

      return res.status(httpStatus.BAD_REQUEST).send({ message: "Order_detail is blanck" });
    }


    const orderExist = await Order.findOne({ _id: id });


    if (!orderExist) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "order not Exist" });
    }

    const totOrder = await Order_details.find({ order_id: id });


    const result = totOrder.filter((item) => !Order_detail.find((_x) => _x.product_id == item.product_id));


    if (result?.length) {

      result.forEach(async (item) => {

        await Order_details.findByIdAndRemove(item._id);

        await Product.findOneAndUpdate({ _id: item.product_id }, { $inc: { stock: item.quantity } });
        await Product_details.findOneAndUpdate({ _id: item.product_details_id }, { $inc: { quantity: item.quantity } });


        await Order.findOneAndUpdate({ _id: item.order_id }, { $inc: { amount: - item.totalPrice } })
      });
    }


    await Order_detail.forEach(async (item, index) => {


      const orderDetail = await Order_details.findOne({ order_id: id, product_id: item.product_id });


      if (!orderDetail) {

        let product = await Product.findOne({ _id: item.product_id });



        let productDetail = await Product_details.findOne({ product_id: item.product_id }).sort({ price: -1 });



        if (product?.stock < item.quantity) {
          return res.status(httpStatus.BAD_REQUEST).send({ message: `this product ${product.name} is out-off stock` });
        }
        if (productDetail?.quantity < item.quantity) {
          return res.status(httpStatus.BAD_REQUEST).send({ message: `this product ${product.name} is out-off stock` });
        }

        await Product.findByIdAndUpdate({ _id: item.product_id }, { $inc: { stock: -item.quantity } });
        await Product_details.findByIdAndUpdate({ _id: productDetail._id }, { $inc: { quantity: -item.quantity } });

        let totPrice = productDetail.price * item.quantity;



        await Order.findByIdAndUpdate({ _id: id }, { $inc: { amount: totPrice } });

        const orderDetailsCreate = {
          order_id: id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: productDetail.price,
          totalPrice: totPrice,
          product_details_id: productDetail._id,

        }



        await Order_details.create(orderDetailsCreate);

      } else if (orderDetail?.quantity < item?.quantity) {

        const productStock = await Product.findOne({ _id: orderDetail.product_id });


        let updateQuantity = orderDetail.quantity - item.quantity;


        let totalPrice = updateQuantity * (-orderDetail.price);



        if ((productStock?.stock + updateQuantity) < 0) {
          return res.status(httpStatus.BAD_REQUEST).send({ message: "this product is out-off stock" });
        }


        const productDetailQuantity = await Product_details.findOne({ _id: orderDetail.product_details_id });

        if ((productDetailQuantity?.quantity + updateQuantity) < 0) {
          return res.status(httpStatus.BAD_REQUEST).send({ message: "this product is out-off stock" });
        }

        item.totalPrice = item.quantity * orderDetail.price;


        await Product.findOneAndUpdate({ _id: item.product_id }, { $inc: { stock: updateQuantity } });
        await Product_details.findOneAndUpdate({ _id: orderDetail.product_details_id }, { $inc: { quantity: updateQuantity } })
        await Order.findOneAndUpdate({ _id: id }, { $inc: { amount: totalPrice } })

        await Order_details.findByIdAndUpdate(orderDetail._id, item, { new: true });

      } else {


        let updateQuantity = orderDetail.quantity - item.quantity;


        let totalPrice = updateQuantity * (-orderDetail.price);
        1

        item.totalPrice = item?.quantity * orderDetail?.price;

        await Product.findOneAndUpdate({ _id: item.product_id }, { $inc: { stock: updateQuantity } });
        await Product_details.findOneAndUpdate({ _id: orderDetail.product_details_id }, { $inc: { quantity: updateQuantity } })
        await Order.findOneAndUpdate({ _id: id }, { $inc: { amount: totalPrice } })

        await Order_details.findByIdAndUpdate(orderDetail._id, item, { new: true });

      }

      if (orderExist.paymentImage !== body.paymentImage) {

        await removeFile(orderExist.paymentImage);

      }

    });


    await Order.findOneAndUpdate({ _id: id }, body, { new: true });

    return res.status(httpStatus.OK).send({ message: "order update successfully" });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}





const orderDelete = async (req, res) => {
  try {
    const id = req.params._id;
    const orderExist = await Order.findOne({ _id: id });


    const currentDate = Date.now();
    const valideDeleteDate = new Date(orderExist.updated_At).getTime();

    if (currentDate > valideDeleteDate) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "order delete time is over" });
    }

    await removeFile(orderExist.paymentImage);

    if (!orderExist) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "order not Exist" });
    }

    const orderDetail = await Order_details.find({ order_id: id });


    orderDetail.forEach(async (item) => {

      await Product.findByIdAndUpdate(item.product_id, { $inc: { stock: item.quantity } });
      await Product_details.findByIdAndUpdate(item.product_details_id, { $inc: { quantity: item.quantity } });

      await Order_details.findByIdAndRemove(item._id);

    })


    await Order.findOneAndRemove({ _id: id });

    return res.status(httpStatus.OK).send({ message: "delete successfully" });

  } catch (error) {

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}


const paymentImage = async (req, res) => {
  try {
    if (!req?.files?.paymentImage) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "image is require" });

    }
    const { upload_path } = await saveFile(req.files.paymentImage, "payment");
    console.log(upload_path, "upload_path");

    return res.status(httpStatus.CREATED).send({ upload_path: upload_path });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}



const orderDetailsDataGet = async (req, res) => {
  try {
    const order_detail = await Order_details.find();
    return res.status(httpStatus.CREATED).send({ order_detail });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}

module.exports = { createOrder, orderGet, orderUpdate, orderDelete, paymentImage, orderDetailsDataGet };


