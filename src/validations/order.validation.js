const Joi = require("joi");
const { param } = require("../app");
const { Order_details } = require("../models");
const { paymentImage } = require("../controllers/order.controller");

const createValidation = {
    body: Joi.object().keys({
        amount: Joi.number(),
        shippingAddress: Joi.string().required(),
        city: Joi.string().required(),
        pinCode: Joi.number().required(),
        phone: Joi.number().min(10 ** 9).max(10 ** 10 - 1).required(),
        orderStatus: Joi.string(),
        paymentType: Joi.string().required().valid("online", "offLine"),
        paymentImage: Joi.string().when('paymentType', {
            is: 'online',
            then: Joi.required(),
            otherwise: Joi.forbidden()
        }),
        orderDate: Joi.date(),
        updated_At: Joi.date(),
        user_id: Joi.string(),
        Order_detail: Joi.array().items({
            product_id: Joi.string().required(),
            quantity: Joi.number().required(),
            price: Joi.number(),
            totalPrice: Joi.number(),
            product_details_id: Joi.string(),
            order_id: Joi.string(),
            cart_id: Joi.string()
        }).required()
    })
}




const updateValidation = {
    param: Joi.object().keys({
        _id: Joi.required()
    }),
    body: Joi.object().keys({
        amount: Joi.number(),
        shippingAddress: Joi.string(),
        city: Joi.string(),
        pinCode: Joi.number(),
        phone: Joi.number().min(10 ** 9).max(10 ** 10 - 1),
        orderStatus: Joi.string(),
        paymentType: Joi.string().valid("online", "offLine"),
        paymentImage: Joi.string(),
        orderDate: Joi.date(),
        updated_At: Joi.date(),
        user_id: Joi.string(),
        Order_detail: Joi.array().items({
            product_id: Joi.string(),
            quantity: Joi.number(),
            price: Joi.number(),
            totalPrice: Joi.number(),
            product_details_id: Joi.string(),
            order_id: Joi.string(),
            cart_id: Joi.string()
        })
    })
}

const deleteValidation = {
    param: Joi.object().keys({
        _id: Joi.required()
    })
}


module.exports = { createValidation, updateValidation, deleteValidation };