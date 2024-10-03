const httpStatus = require('http-status');
const { Product_details, Product } = require('../models');




const productCreate = async (req, res) => {
  try {
    const product = await Product_details.create(req.body);
    await Product.findByIdAndUpdate(req.body.product_id, { $inc: { stock: req.body.quantity } })

    return res.status(httpStatus.CREATED).send({ product });


  } catch (error) {
    console.log(error, "error")
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}

const getAllProduct = async (req, res) => {
  try {
    const product = await Product_details.find();

    return res.status(httpStatus.CREATED).send({ product });

  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}

const updateProductById = async (req, res) => {
  try {
    const id = req.params._id;

    const productExits = await Product_details.findOne({ _id: id });

    if (!productExits) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "Product Not Found" });
    }


    if (req.body?.quantity && productExits.quantity !== req.body?.quantity) {
      const updateQuantity = await req.body.quantity - productExits.quantity;
      await Product.findByIdAndUpdate(productExits.product_id, { $inc: { stock: updateQuantity } })
    }

    const product = await Product_details.findOneAndUpdate({ _id: id }, req.body, { new: true })

    return res.status(httpStatus.CREATED).send({ product });

  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}

const deleteProductById = async (req, res) => {
  try {
    const id = req.params._id;

    const productExits = await Product_details.findOne({ _id: id });

    if (!productExits) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "Product Not Found" });
    }

    const product = await Product_details.findByIdAndRemove({ _id: id });
    console.log(product, "product");

    let uQuantity = product.quantity;
    console.log(uQuantity, "uQuantity");


    await Product.findOneAndUpdate({ _id: product.product_id }, { $inc: { stock: -uQuantity } });

    return res.status(httpStatus.CREATED).send({ message: "Product Deleted Successfully" });

  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}











module.exports = {
  productCreate,
  getAllProduct,
  updateProductById,
  deleteProductById,

};
