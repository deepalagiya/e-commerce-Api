const httpStatus = require('http-status');
const { Category } = require('../models');




const categoryCreate = async (req, res) => {
  try {
    const body = req.body;

    const categoryExist = await Category.findOne({ categoryName: body.categoryName });

    if (categoryExist) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "category name already exits" });
    }
    const category = await Category.create(req.body);

    return res.status(httpStatus.CREATED).send({ category });

  } catch (error) {
    console.log(error, "error")
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}

const gateCategory = async (req, res) => {
  try {
    const category = await Category.find();

    return res.status(httpStatus.CREATED).send({ category });

  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}


const updateCategory = async (req, res) => {
  try {
    let id = req.params._id;


    const categoryExist = await Category.findOne({ _id: id });
    console.log(categoryExist, "categoryExist");

    if (!categoryExist) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "category Not Found" });
    }

    const categoryNameExist = await Category.findOne({ _id: { $ne: id }, categoryName: req.body.categoryName });
    if (categoryNameExist) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "category name alredy exist" });

    }
    const category = await Category.findOneAndUpdate({ _id: id }, req.body, { new: true })

    return res.status(httpStatus.CREATED).send({ category, message: "update successfully" });

  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}


const daleteCategory = async (req, res) => {
  try {
    const id = req.params._id;

    const categoryExist = await Category.findOne({ _id: id });

    if (!categoryExist) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "category Not Found" });
    }

    await Category.findByIdAndDelete({ _id: id });
    return res.status(httpStatus.OK).send({ message: "category Deleted Successfully" });

  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}

module.exports = {
  categoryCreate,
  gateCategory,
  updateCategory,
  daleteCategory
};
