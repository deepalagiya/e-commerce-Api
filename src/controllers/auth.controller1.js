const httpStatus = require("http-status");
const { User, Role } = require("../models");
const bcrypt = require('bcryptjs/dist/bcrypt');
const passport = require("passport");
const { genrateToken } = require("../services/token.service");
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const config = require("../config/config");
const { sendResetPasswordEmail } = require("../services/email.service");
const { generateOtp } = require("../utils/helper");

const registration = async (req, res) => {
  try {

    const body = req.body;
    const userExist = await User.findOne({ email: body.email });
    if (userExist) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "user alredy exist" });
    }

    if (!body.role) {
      const { _id: roleId } = await Role.findOne({ roleName: "user" });

      console.log(roleId, "roleId");

      body.role = roleId;
    }
    body.password = await bcrypt.hash(body.password, 8);
    body.ip = await req.ip;
    body.lastLogin = Date.now();
    const user = await User.create(req.body);
    return res.status(httpStatus.CREATED).send({ user });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}

const login = async (req, res) => {
  try {

    const body = req.body;
    const userExist = await User.findOne({ email: body.email }).populate("role");
    if (!userExist) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "user not exist" });
    }
    const isvalidPassword = await bcrypt.compare(body.password, userExist.password);
    if (!isvalidPassword) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "password is incorrect" });
    }

    await User.findOneAndUpdate({ email: body.email }, { lastLogin: Date.now(), ip: req.ip }, { new: true });

    const payload = {
      _id: userExist._id,
      email: userExist.email,
      password: userExist.password
    }

    const token = await genrateToken(payload);

    return res.status(httpStatus.OK).send({ user: userExist, token });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message
    })
  }
}

const forgotPassword = async (req, res) => {
  try {
    const body = req.body;
    const userData = await User.findOne({ email: body.email });

    if (userData) {

      var digits = '0123456789';
      let OTP = generateOtp(digits);
      await User.updateOne({ email: body.email }, { $set: { otp: OTP } });

      sendResetPasswordEmail(req.body.email, OTP);

      res.status(200).send({ message: "check mail and reset password" });
    } else {
      res.status(200).send({ message: "email  is not exist" });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}


const verifyOtp = async (req, res) => {
  try {
    const body = req.body;
    const userData = await User.findOne({ email: body.email, otp: body.otp });
    if (!userData) {
      res.status(httpStatus.BAD_REQUEST).send({ message: "otp is wrong" });
    }
    const randomToken = randomstring.generate();
    await User.updateOne({ email: body.email }, { $set: { randomToken: randomToken, otp: "" } });

    res.status(200).send({ randomToken, message: "otp verify successfully" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}

const resetPassword = async (req, res) => {
  try {

    const body = req.body;

    const userExist = await User.findOne({ randomToken: body.randomToken });
    if (!userExist) {
      res.status(200).send({ message: "token not match" });
    }
    const newPassword = await bcrypt.hash(body.password, 8);
    await User.findOneAndUpdate({ _id: userExist._id }, { $set: { password: newPassword, randomToken: "" } }, { new: true });
    res.status(200).send({ message: "password update successfully" });


  } catch (error) {
    res.status(400).send({ message: error.message, error: "not work proper" });

  }
}

module.exports = { registration, login, forgotPassword, verifyOtp, resetPassword };