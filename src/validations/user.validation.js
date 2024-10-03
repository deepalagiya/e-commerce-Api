const Joi = require('joi');



const createValidation = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    mobileNumber: Joi.number().min(10 ** 9).max(10 ** 10 - 1).required(),
    bio: Joi.object().required(),
    role: Joi.string()
  })
}




const updateValidation = {
  param: Joi.object().keys({
    _id: Joi.required()
  }),
  body: Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string(),
    password: Joi.string(),
    mobileNumber: Joi.number().min(10 ** 9).max(10 ** 10 - 1),
    bio: Joi.object(),
    role: Joi.string()
  })
}

const deleteValidation = {
  param: Joi.object().keys({
    _id: Joi.required()
  }),
}

module.exports = { createValidation, updateValidation, deleteValidation };