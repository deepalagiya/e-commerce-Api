const httpStatus = require("http-status");
const { User, RolePermition, Permition } = require("../models");
const { verifyToken } = require("../services/token.service");


const middelware = (isRequire = true, isAuth = true) => {
  return async (req, res, next) => {
    if (isRequire) {

      let authorization = req.header('Authorization');
      if (authorization) {
        authorization = authorization.split(" ");
        try {
          const token = await verifyToken(authorization[1]);

          const _user = await User.findOne({ _id: token.user._id }).populate("role");
          if (!_user) {
            return res.status(401).json({ message: "user is unAuthorizd" })
          }

          req.authUser = _user;
          return next();

        } catch (error) {
          return next(error);
        }
      }

      if (isAuth) {
        return res.status(401).json({ message: "user is unAuthorizd" })
      } else {
        return next();
      }

    }
    return next();
  }
}


const roleBaseAuthoritiy = (permission, type) => {
  return async (req, res, next) => {

    const roleId = req.authUser.role._id;


    const permissionData = await Permition.findOne({ name: permission });


    const isValid = await RolePermition.findOne({ role: roleId, [type]: true, permition: permissionData._id });

    if (isValid) {
      return next()

    } else {
      return res.status(httpStatus.FORBIDDEN).send({ message: "permission dined" });
    }

  }
}

module.exports = { middelware, roleBaseAuthoritiy };