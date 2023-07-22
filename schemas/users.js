const Joi = require('joi');
const db = require("../models")
const tools = require("../tools/commons.js")

const registerUserSchema = Joi.object().keys({
    name: Joi.string()
        .required()
        .min(4)
        .max(16)
        .label("Name")
        // .external(async (data) => {
        //     const getUser = await db.users.findOne({ 
        //         where: { name: data, is_deleted: false }
        //     });

        //     if (getUser) {
        //         throw new Joi.ValidationError("Name has been used")
        //     }

        // })
        .messages({
            "string.base": "{#label} should be a type of 'string ",
            "string.empty": "{#label} cannot be empty",
            "string.min": "{#label} should have a minimum length of {#limit}",
            "string.max": "{#label} should have a maximum length of {#limit}",
            "any.required": "{#label} is a required field"
          }),
    phone_number: Joi.string()
        .required()
        .label("Phone Number")
        .external(async (data) => {
            if (!tools.isIndonesianPhoneNumber(data)) {
                throw new Joi.ValidationError("Not a valid Indonesian Phone Number")
            }

            const getUser = await db.users.findOne({ 
                where: { phoneNumber: data, is_deleted: false }
            });

            if (getUser) {
                throw new Joi.ValidationError("Phone number has been used")
            }

            

        })
        .messages({
            "any.required": "{#label} is a required field",
            "string.email": "{#label} is not a valid email address",
            "string.empty": "{#label} cannot be empty",
        }),
    password: Joi.string()
        .required()
        .label("Password")
        .messages({
            "any.required": "{#label} is a required field",
            "string.empty": "{#label} cannot be empty",
        }),
    confirm_password: Joi.any()
        .required()
        .equal(Joi.ref("password"))
        .label("Confirm Password")
        .messages({
            "any.required": "{#label} is a required field",
            "string.empty": "{#label} cannot be empty",
            "any.only": "{{#label}} does not match with Password"
        })

});

const loginUserSchema = Joi.object().keys({
    phone_number: Joi.string()
        .required()
        .messages({
            "any.required": "{#label} is a required field",
            "string.empty": "{#label} cannot be empty",
        }),
    password: Joi.string()
        .required()
        .messages({
            "any.required": "{#label} is a required field",
            "string.empty": "{#label} cannot be empty",
        }),
});

module.exports = { 
    registerUserSchema, 
    loginUserSchema 
}