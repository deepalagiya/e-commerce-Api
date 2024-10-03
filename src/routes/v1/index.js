const express = require('express');
const authRoute = require('./auth.route');
const productRoute = require('./product.route');
const product_detailRoute = require('./Product_details.route');
const userRoute = require('./user.route');
const roleRoute = require('./role.route');
const categoryRoute = require('./category.route');
const orderRoute = require('./order.route');
const cartRoute = require('./cart.route');
const reportRoute = require('./report.route');
const permitionRoute = require('./permition.route');
const orderReturnRoute = require('./orderReturn.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');
const path = require('path');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/role',
    route: roleRoute,
  },
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: '/product',
    route: productRoute,
  },
  {
    path: '/product_detail',
    route: product_detailRoute,
  },
  {
    path: '/category',
    route: categoryRoute,
  },
  {
    path: '/order',
    route: orderRoute,
  },
  {
    path: '/cart',
    route: cartRoute,
  },
  {
    path: '/report',
    route: reportRoute,
  },
  {
    path: '/permition',
    route: permitionRoute,
  },
  {
    path: '/orderReturn',
    route: orderReturnRoute,
  }
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
