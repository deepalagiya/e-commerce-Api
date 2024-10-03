const Joi = require('joi');

const createValidation = {
  body: Joi.object().keys({
    roleName: Joi.string().required(),
    isActive: Joi.boolean().required()
  })
}

const getValidation = {
  body: Joi.object().keys({
    roleName: Joi.string(),
    isActive: Joi.boolean()
  })
}

const updateValidation = {
  param: Joi.object().keys({
    _id: Joi.required()
  }),
  body: Joi.object().keys({
    roleName: Joi.string(),
    isActive: Joi.boolean()
  })
}

const deleteValidation = {
  param: Joi.object().keys({
    _id: Joi.required()
  })
}


module.exports = { createValidation, getValidation, updateValidation, deleteValidation };