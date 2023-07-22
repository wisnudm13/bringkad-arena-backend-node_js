const Joi = require('joi');
const db = require("../models")
const { facilityType } = require("../tools/enums")

const createFacilitySchema = Joi.object().keys({
    name: Joi.string()
        .required()
        .min(4)
        .label("Facility Name")
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
            "any.required": "{#label} is a required field"
          }),
    type: Joi.string()
        .required()
        .uppercase()
        .label("Facility Type")
        .external(async (data) => {
            if (!Object.values(facilityType).includes(data)) {
                throw new Joi.ValidationError("Not a valid Facility Type")
            }

        })
        .messages({
            "any.required": "{#label} is a required field",
            "string.empty": "{#label} cannot be empty",
        }),
    description: Joi.string()
        .required()
        .label("Description")
        .messages({
            "any.required": "{#label} is a required field",
            "string.empty": "{#label} cannot be empty",
        }),

});

// const loginAdminSchema = Joi.object().keys({
//     email_or_username: Joi.string()
//         .required()
//         .messages({
//             "any.required": "{#label} is a required field",
//             "string.empty": "{#label} cannot be empty",
//         }),
//     password: Joi.string()
//         .required()
//         .messages({
//             "any.required": "{#label} is a required field",
//             "string.empty": "{#label} cannot be empty",
//         }),
// });

// const updateAdminSchema = Joi.object().keys({
//     username: Joi.string()
//         .min(4)
//         .max(16)
//         .label("Username")
//         .messages({
//             "string.base": "{#label} should be a type of 'string ",
//             "string.min": "{#label} should have a minimum length of {#limit}",
//             "string.max": "{#label} should have a maximum length of {#limit}",
//         }),
//     email: Joi.string()
//         .lowercase()
//         .email()
//         .label("Email")
//         .messages({
//             "string.email": "{#label} is not a valid email address",
//         }),
//     password: Joi.string()
//         .label("Password")
//         .optional()
//         .allow(null, ""),
//     confirm_password: Joi.any()
//         .when("password", {
//             is: Joi.any().valid(null, ""),
//             then: Joi.optional().allow(null, ""),
//             otherwise: Joi.required()
//         })
//         .equal(Joi.ref("password"))
//         .label("Confirm Password")
//         .messages({
//             "any.required": "{#label} is a required field",
//             "string.empty": "{#label} cannot be empty",
//             "any.only": "{{#label}} does not match with Password"
//         })
// })

module.exports = { 
    createFacilitySchema
}
