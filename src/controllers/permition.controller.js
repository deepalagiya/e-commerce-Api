const httpStatus = require("http-status")
const { Permition, RolePermition } = require("../models")


const createPermitionByName = async (req, res) => {
  try {
    const { data, ...body } = req.body;

    const permition = await Permition.findOne({ name: body.name });
    if (permition) {
      await data.forEach(async (item, index) => {
        item.permition = permition._id;

        await RolePermition.create(item);
      })
    } else {
      const permit = await Permition.create(body);

      await data.forEach(async (item, index) => {
        item.permition = permit._id;

        await RolePermition.create(item);
      })
    }

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}

module.exports = { createPermitionByName };