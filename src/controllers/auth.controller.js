const httpStatus = require("http-status");
const { User } = require("../models");
const bcrypt = require('bcryptjs/dist/bcrypt');
const passport = require("passport");
const { password } = require("../validations/custom.validation");
const { genrateToken } = require("../services/token.service");
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const config = require("../config/config");
const { sendResetPasswordEmail } = require("../services/email.service");

const registration = async (req, res) => {
  try {
    const body = req.body;
    const userExist = await User.findOne({ firstName: body.firstName, lastName: body.lastName });
    if (userExist) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "user alredy exist" });
    }

    body.password = await bcrypt.hash(body.password, 8);
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
    const userExist = await User.findOne({ email: body.email });
    if (!userExist) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "user not exist" });
    }

    const isvalidPassword = bcrypt.compare(body.password, userExist.password);
    if (!isvalidPassword) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "password is incorrect" });
    }
    const payload = {
      _id: userExist._id,
      email: userExist.email,
      password: userExist.password
    }

    const token = await genrateToken(payload);

    const user = await User.create(req.body);
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

      const randomString = randomstring.generate();
      const userData = await User.updateOne({ email: body.email }, { $set: { randomToken: randomString } });

      // sendresetPasswordMail(userData.firstName, userData.email, randomString);
      sendResetPasswordEmail("deepalagiya@gmail.com", "deepalagiya@gmail.com")

      res.status(200).send({ message: "check mail and reset password" });
    } else {
      res.status(200).send({ message: "email  is not exist" });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}

const sendresetPasswordMail = async (email, token) => {
  try {
    // const transPorter = nodemailer.createTransport({
    //   host: 'smtp.gmail.com',
    //   port: 587,
    //   secure: false,
    //   // requireTLS: true,
    //   auth: {
    //     user: "deepalagiya@gmail.com",
    //     password: "kqijwilfxpbatggc"
    //   }
    // })


    // const mailOption = {
    //   from: "deepalagiya@gmail.com",
    //   to: email,
    //   subject: "for reset password",
    //   html: '<p>hii ' + name + ',please copy the link and <a href = "http://localhost:3000/v1/auth/resetPassword?token=' + token + '">reset your password</a></p>'

    // }

    // transPorter.sendMail(mailOption, function (error, info) {
    //   console.log(info, "aaaaa");
    //   if (error) {
    //     console.log(error, "error");
    //   } else {
    //     console.log("mail has been send", info.response);
    //   }
    // })

  } catch (error) {
    res.status(400).send({ message: error.message });

  }
}

const resetPassword = async (req, res) => {
  try {
    const token = req.query.token;
    const body = req.body;
    const tokenData = await User.findOne({ randomToken: token });
    if (tokenData) {
      const newPassword = await bcrypt.hash(body.password);
      const userData = await User.findOneAndUpdate({ _id: tokenData._id }, { $set: { password: newPassword, randomToken: "" } }, { new: true });
      res.status(200).send({ userData });
    } else {
      res.status(200).send({ message: "token expired" });

    }


  } catch (error) {
    res.status(400).send({ message: error.message });

  }
}

module.exports = { registration, login, forgotPassword, resetPassword };