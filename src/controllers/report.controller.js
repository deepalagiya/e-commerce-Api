const httpStatus = require('http-status');
const { Order_details } = require('../models');



const productWiseReport = async (req, res) => {
  try {


    const originalDate = new Date();

    const previousYearDate = new Date(originalDate);
    previousYearDate.setFullYear(originalDate.getFullYear() - 1);

    const result = await Order_details.aggregate([
      {
        $match: {
          createdAt: { $gte: previousYearDate, $lte: originalDate }
        }
      },
      {
        $lookup: {
          from: "productdb",
          let: {
            pid: '$product_id'
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$pid']
                }
              }
            }
          ],
          as: "product"
        }
      },
      {
        $unwind: {
          path: "$product"
        }
      },

      {
        $group: {

          _id: { month: { $month: "$createdAt" } },

          month: {
            $push: { productName: '$product.name', total_sel: { $sum: "$quantity" } }
          },


        },

      },
      { $sort: { _id: -1 } },
      {
        $project: {
          "_id": {
            $switch: {
              branches: [
                {
                  case: { "$eq": ["$_id.month", 1] },
                  then: "January"
                },
                {
                  case: { "$eq": ["$_id.month", 2] },
                  then: "February"
                },
                {
                  case: { "$eq": ["$_id.month", 3] },
                  then: "March"
                },
                {
                  case: { "$eq": ["$_id.month", 4] },
                  then: "April"
                },
                {
                  case: { "$eq": ["$_id.month", 5] },
                  then: "May"
                },
                {
                  case: { "$eq": ["$_id.month", 6] },
                  then: "June"
                },
                {
                  case: { "$eq": ["$_id.month", 7] },
                  then: "July"
                },
                {
                  case: { "$eq": ["$_id.month", 8] },
                  then: "August"
                },
                {
                  case: { "$eq": ["$_id.month", 9] },
                  then: "September"
                },
                {
                  case: { "$eq": ["$_id.month", 10] },
                  then: "October"
                },
                {
                  case: { "$eq": ["$_id.month", 11] },
                  then: "November"
                },
                {
                  case: { "$eq": ["$_id.month", 12] },
                  then: "December"
                },
              ],
              default: "month is not valid"
            }
          },

          month: 1

        }
      }
    ])



    const data = result.map((item, index) => {
      const selling = item.month.reduce((tot, cur) => {

        tot[cur.productName] ? tot[cur.productName] += cur.total_sel : tot[cur.productName] = cur.total_sel


        return tot;

      }, {});



      // const month = Object.keys(selling).map((productName) => {

      //   return {
      //     productName,
      //     total_sel: selling[productName]
      //   }
      // })



      // switch (item._id.month) {
      //   case 1:
      //     month = "January";
      //     break;
      //   case 2:
      //     month = "February";
      //     break;
      //   case 3:
      //     month = "March";
      //     break;
      //   case 4:
      //     month = 'April';
      //     break;
      //   case 5:
      //     month = 'May';
      //     break;
      //   case 6:
      //     month = 'June';
      //     break;
      //   case 7:
      //     month = "July";
      //     break;
      //   case 8:
      //     month = "August";
      //     break;
      //   case 9:
      //     month = 'September'
      //   case 10:
      //     month = "October";
      //     break;
      //   case 11:
      //     month = 'November';
      //     break
      //   case 12:
      //     month = 'December'
      //     break
      //   default:
      //     month = "Invalid month";
      // }

      // const monthMapping = {
      //   1: "January",
      //   2: "February",
      //   3: "March",
      //   4: "April",
      //   5: "May",
      //   6: "June",
      //   7: "July",
      //   8: "August",
      //   9: "September",
      //   10: "October",
      //   11: "November",
      //   12: "December",
      // }


      // return {
      //   id: item._id,
      //   sel: month
      // }


      return {
        // month: monthMapping[item._id.month],
        month: item._id,
        selling
      }

    });




    return res.status(httpStatus.CREATED).send({ data });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}


const categoryWiseReport = async (req, res) => {
  try {
    const originalDate = new Date();

    const previousYearDate = new Date(originalDate);
    previousYearDate.setFullYear(originalDate.getFullYear() - 1);

    const result = await Order_details.aggregate([
      {
        $lookup: {
          from: "productdb",
          let: {
            pid: '$product_id'
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$pid']
                }
              }
            }
          ],
          as: "product"
        }
      }, {
        $unwind: {
          path: "$product"
        }
      },
      {
        $lookup: {
          from: 'categorydb',
          let: {
            cid: "$product.category_id"
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', "$$cid"]
                }
              }
            }

          ],
          as: "category"
        }
      }, {
        $unwind: {
          path: "$category"
        }
      }, {

        $match: {
          createdAt: { $gte: previousYearDate, $lte: originalDate }
        }

      },
      {
        $group: {

          _id: { month: { $month: "$createdAt" } },
          month: { $push: { categoryName: '$category.categoryName', total_sel: { $sum: "$quantity" } } }

        }
      },
      { $sort: { _id: -1 } },
      {
        $project: {
          "_id": {
            $switch: {
              branches: [
                {
                  case: { "$eq": ["$_id.month", 1] },
                  then: "January"
                },
                {
                  case: { "$eq": ["$_id.month", 2] },
                  then: "February"
                },
                {
                  case: { "$eq": ["$_id.month", 3] },
                  then: "March"
                },
                {
                  case: { "$eq": ["$_id.month", 4] },
                  then: "April"
                },
                {
                  case: { "$eq": ["$_id.month", 5] },
                  then: "May"
                },
                {
                  case: { "$eq": ["$_id.month", 6] },
                  then: "June"
                },
                {
                  case: { "$eq": ["$_id.month", 7] },
                  then: "July"
                },
                {
                  case: { "$eq": ["$_id.month", 8] },
                  then: "August"
                },
                {
                  case: { "$eq": ["$_id.month", 9] },
                  then: "September"
                },
                {
                  case: { "$eq": ["$_id.month", 10] },
                  then: "October"
                },
                {
                  case: { "$eq": ["$_id.month", 11] },
                  then: "November"
                },
                {
                  case: { "$eq": ["$_id.month", 12] },
                  then: "December"
                },
              ],
              default: "month is not valid"
            }
          },

          month: 1

        }
      }

    ]);

    const data = result.map((item) => {
      const selling = item.month.reduce((tot, cur) => {
        if (tot[cur.categoryName]) {
          tot[cur.categoryName] += cur.total_sel
        } else {
          tot[cur.categoryName] = cur.total_sel
        }
        return tot
      }, {})

      return {
        month: item._id,
        selling
      }
    })


    return res.status(httpStatus.CREATED).send({ data });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}


const last_3month_selling = async (req, res) => {
  try {

    var lastDate = new Date();
    lastDate.setMonth(lastDate.getMonth() - 3);

    const result = await Order_details.aggregate([

      {
        $lookup: {
          from: "productdb",
          let: {
            pid: '$product_id'
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$pid']
                }
              }
            }
          ],
          as: "product_id"
        }
      },
      {
        $unwind: {
          path: '$product_id'
        }
      },

      {
        $match: {
          createdAt: { $gte: lastDate }
        }
      },
      {
        $group: {
          _id: { productName: '$product_id.name' },
          total_sel: { $sum: '$totalPrice' },
        }
      },

    ])

    return res.status(httpStatus.OK).send({ result });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}

module.exports = { productWiseReport, categoryWiseReport, last_3month_selling };