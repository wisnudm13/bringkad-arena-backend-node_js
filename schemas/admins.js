const { body } = require("express-validator");
const Joi = require('joi');
const db = require("../models")

const registerAdminSchema = Joi.object().keys({
    username: Joi.string()
        .required()
        .min(4)
        .max(16)
        .label("Username")
        .external(async (data) => {
            const getAdmin = await db.admins.findOne({ where: { username: data }});

            if (getAdmin) {
                throw new Joi.ValidationError("Username has been used")
            }

        })
        .messages({
            "string.base": "{#label} should be a type of 'string ",
            "string.empty": "{#label} cannot be empty",
            "string.min": "{#label} should have a minimum length of {#limit}",
            "string.max": "{#label} should have a maximum length of {#limit}",
            "any.required": "{#label} is a required field"
          }),
    email: Joi.string()
        .required()
        .lowercase()
        .email()
        .label("Email")
        .external(async (data) => {
            const getAdmin = await db.admins.findOne({ where: { email: data }});

            if (getAdmin) {
                throw new Joi.ValidationError("Email has been used")
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

})

const loginAdminSchema = {
    email_or_username: {
        isEmpty: {
            errorMessage: "Email or Username cannot be empty",
        },
    },
    password: {
        isEmpty: {
            errorMessage: "Password cannot be empty"
        }
    }
};

module.exports = { 
    registerAdminSchema, 
    loginAdminSchema 
}