const httpStatus = require('http-status');
const { Product, Cart } = require('../models');
const { ObjectId } = require('mongodb');
const { path } = require('path');
const { saveFile, removeFile, imageHendeling } = require('../utils/helper');
const { pipeline } = require('nodemailer/lib/xoauth2');
const { parse } = require('path');






const productCreate = async (req, res) => {
  try {
    const body = req.body;

    const productExits = await Product.findOne({ name: body.name });

    if (productExits) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "Product name already exits" });
    }

    body.user_id = req.authUser._id;
    const image = imageHendeling(req.files.image);
    const { upload_path } = await saveFile(image, 'product');
    body.image = upload_path;
    const product = await Product.create(body);

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


    const product = await Product.aggregate([
      {
        $lookup: {
          from: "cartdb",
          let: {
            pid: "$_id",
          },
          pipeline: [{
            $match: {
              'is_Active': true,
              $expr: {
                $and: [{ $eq: ['$user_id', req?.authUser?._id] }, { $eq: ['$product_id', '$$pid'] }]
              }
            },
          }],
          as: "cart_data"
        }
      },
      {
        $lookup: {
          from: "product_detaildb",
          let: {
            pid: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$product_id", "$$pid"]
                }
              }
            },
            {
              $sort: {
                price: -1
              }
            }
          ],
          as: "price"
        }
      },
      {
        $addFields: {
          price: { $arrayElemAt: ['$price.price', 0] }
        }
      },

    ]);

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

    const productExits = await Product.findOne({ _id: id });

    if (!productExits) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "Product Not Found" });
    }

    const productNameExist = await Product.findOne({ _id: { $ne: id }, name: req.body.name });
    if (productNameExist) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "product Name alredy Exist" })
    }

    if (req.files?.image) {
      await removeFile(productExits.image);
      const image = await imageHendeling(req.files.image);
      const { upload_path } = await saveFile(image, "product");
      req.body.image = upload_path;
    }
    const product = await Product.findOneAndUpdate({ _id: id }, req.body, { new: true })

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

    const productExits = await Product.findOne({ _id: id });

    if (!productExits) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "Product Not Found" });
    }

    const product = await Product.findByIdAndRemove({ _id: id })
      (product?.image && await removeFile(product?.image))

    return res.status(httpStatus.CREATED).send({ message: "Product Deleted Successfully" });

  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}


const searchProduct = async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    console.log(typeof page, "type", page);



    const aggregateData = [{
      $match: {
        ...(req.query?.search && {
          $or: [
            { "name": { $regex: req.query.search } },
            { "description": { $regex: req.query.search } }
          ],
        }),
        ...(req.query?.filterBy && { category_id: new ObjectId(req.query.filterBy) })
      }
    },

    {
      $lookup: {
        from: "userdb",
        localField: "user_id",
        foreignField: "_id",
        as: "user_id"
      }
    }, {
      $unwind: {
        path: "$user_id"
      }
    },
    {
      $lookup: {
        from: "categorydb",
        localField: "category_id",
        foreignField: "_id",
        as: "category_id"
      }
    }, {
      $unwind: {
        path: "$category_id"
      }
    },

    {
      $lookup: {
        from: "product_detaildb",
        let: {
          pid: "$_id"
        },
        pipeline: [{
          $match: {
            $expr: {
              $eq: ['$product_id', '$$pid']
            }
          },
        },
        {
          '$sort': {
            'price': -1
          }
        }
        ],
        as: "product_detail",
      }

    },

    {
      $addFields: {
        product_detail: { $arrayElemAt: ['$product_detail', 0] }
      }
    },
    {
      $addFields: {
        price: '$product_detail.price'
      },

    },
    {
      $skip: (page * limit) - limit,

    },
    {
      $limit: limit
    }];


    if (req.query?.priceSort) {
      aggregateData.push({
        $sort: {
          price: req.query.priceSort == "low" ? 1 : -1
        }
      })
    }

    const data = await Product.aggregate(aggregateData)

    console.log(data.length, "data");

    return res.status(httpStatus.CREATED).send({ data });


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
  searchProduct

};
