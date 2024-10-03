const httpStatus = require("http-status")
const { OrderReturn, Order, Order_details, Product, Product_details, OrderReturnDetails } = require("../models");


const orderReturn = async (req, res) => {
  try {

    let { order_id, order_details_id, reason } = req.body;


    const orderData = await Order.find({ _id: order_id });

    if (orderData) {

      var orderReturns = await OrderReturn.create({ order_id: order_id, reason: reason });

    }



    order_details_id.forEach(async (item) => {

      let orderDetailsData = await Order_details.findOne({ _id: item });

      await Product.findOneAndUpdate({ _id: orderDetailsData.product_id }, { $inc: { stock: orderDetailsData.quantity } });

      await Product_details.findOneAndUpdate({ _id: orderDetailsData.product_details_id }, { $inc: { quantity: orderDetailsData.quantity } });

      console.log(orderDetailsData.totalPrice, "orderDetailsData.totalPrice");

      let totalReturnValue = orderDetailsData.totalPrice;
      console.log(totalReturnValue, "totalReturnValue1");

      let obj = {
        order_return_id: orderReturns._id,
        quantity: orderDetailsData.quantity,
        price: orderDetailsData.price,
        totalPrice: orderDetailsData.totalPrice,
        product_details_id: orderDetailsData.product_details_id,
        product_id: orderDetailsData.product_id

      }


      await OrderReturn.findByIdAndUpdate(orderReturns._id, { $inc: { totalReturnValue: totalReturnValue } });

      const orderReturnDetail = await OrderReturnDetails.create(obj);



    });
    return res.status(httpStatus.CREATED).send({ message: "order return successfully" });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}



const getOrderReturnData = async (req, res) => {
  try {
    const orderReturn = await OrderReturn.find();
    return res.status(httpStatus.OK).send({ orderReturn });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}

module.exports = { orderReturn, getOrderReturnData };