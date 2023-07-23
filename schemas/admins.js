const Joi = require('joi');
const db = require("../models")

const registerAdminSchema = Joi.object().keys({
    username: Joi.string()
        .required()
        .min(4)
        .max(16)
        .label("Username")
        .external(async (data) => {
            const getAdmin = await db.admins.findOne({ 
                where: { username: data, is_deleted: false }
            });

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
            const getAdmin = await db.admins.findOne({ 
                where: { email: data, is_deleted: false }
            });

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

});

const loginAdminSchema = Joi.object().keys({
    email_or_username: Joi.string()
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

const updateAdminSchema = Joi.object().keys({
    username: Joi.string()
        .min(4)
        .max(16)
        .label("Username")
        .messages({
            "string.base": "{#label} should be a type of 'string ",
            "string.min": "{#label} should have a minimum length of {#limit}",
            "string.max": "{#label} should have a maximum length of {#limit}",
        }),
    email: Joi.string()
        .lowercase()
        .email()
        .label("Email")
        .messages({
            "string.email": "{#label} is not a valid email address",
        }),
    password: Joi.string()
        .label("Password")
        .optional()
        .allow(null, ""),
    confirm_password: Joi.any()
        .when("password", {
            is: Joi.any().valid(null, ""),
            then: Joi.optional().allow(null, ""),
            otherwise: Joi.required()
        })
        .equal(Joi.ref("password"))
        .label("Confirm Password")
        .messages({
            "any.required": "{#label} is a required field",
            "string.empty": "{#label} cannot be empty",
            "any.only": "{{#label}} does not match with Password"
        })
})

const getListAdminSchema = Joi.object().keys({
    page: Joi.number()
        .default(1)
        .min(1)
        .label("Page")
        .messages({
            "number.base": "{#label} should be a type of 'int' ",
            "number.min": "{#label} should have a minimum length of {#limit}",
          }),
    per_page: Joi.number()
        .default(10)
        .min(10)
        .label("Per page")
        .messages({
            "number.base": "{#label} should be a type of 'int' ",
            "number.min": "{#label} should have a minimum length of {#limit}",
        }),
});

module.exports = { 
    registerAdminSchema, 
    loginAdminSchema,
    updateAdminSchema,
    getListAdminSchema
}
