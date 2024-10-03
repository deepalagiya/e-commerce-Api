const Joi = require('joi');
const { email } = require('../config/config');

const registerValidation = {

  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    mobileNumber: Joi.number().min(10 ** 9).max(10 ** 10 - 1).required(),
    bio: Joi.object().required(),
    role: Joi.string()

  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().required(),
  }),
};

const verifyOtp = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    otp: Joi.number().required()
  })
}

const resetPassword = {
  body: Joi.object().keys({
    password: Joi.string().required(),
    randomToken: Joi.string().required()
  }),
};


const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};






const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  registerValidation,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  verifyEmail,
  logout,
  refreshTokens,
};
