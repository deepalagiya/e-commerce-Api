const Joi = require('joi');

const createValidation = {
  body: Joi.object().keys({
    user_id: Joi.string(),
    product_id: Joi.string(),
    quantity: Joi.number().required(),
    is_Active: Joi.boolean()
  })
}




const updateValidation = {
  params: Joi.object().keys({
    _id: Joi.required()
  }),
  body: Joi.object().keys({
    user_id: Joi.string(),
    product_id: Joi.string(),
    quantity: Joi.number(),
    is_Active: Joi.boolean()
  })
}

const deleteValidation = {
  params: Joi.object().keys({
    _id: Joi.required()
  })
}

module.exports = { createValidation, updateValidation, deleteValidation };