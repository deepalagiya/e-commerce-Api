
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const genrateToken = (user) => {
  return new Promise((resolve, reject) => {
    const payload = {
      user
    }
    const tokenData = jwt.sign(payload, config.jwt.secret);
    resolve({
      token: tokenData
    })
  })
}

const verifyToken = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwt.secret, (error, decode) => {
      if (error) {
        reject(error);
      } else {
        resolve(decode);
      }
    })
  })
}
module.exports = { genrateToken, verifyToken };