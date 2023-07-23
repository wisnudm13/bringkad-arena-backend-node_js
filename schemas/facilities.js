const Joi = require('joi');
const db = require("../models")
const { facilityType, facilityStatus } = require("../tools/enums")

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

const getListFacilitySchema = Joi.object().keys({
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
    status: Joi.string()
        .uppercase()
        .optional()
        .allow(null, "")
        .label("Facility Status")
        .external(async (data) => {
            if (data && !Object.values(facilityStatus).includes(data)) {
                throw new Joi.ValidationError("Not a valid Facility Status")
            }

        })
        .messages({
            "any.required": "{#label} is a required field",
            "string.empty": "{#label} cannot be empty",
        }),
    type: Joi.string()
        .uppercase()
        .label("Facility Type")
        .optional()
        .allow(null, "")
        .external(async (data) => {
            if (data && !Object.values(facilityType).includes(data)) {
                throw new Joi.ValidationError("Not a valid Facility Type")
            }

        })
        .messages({
            "any.required": "{#label} is a required field",
            "string.empty": "{#label} cannot be empty",
        }),
});

const addFacilityItemSchema = Joi.object().keys({
    
})

const updateFacilitySchema = Joi.object().keys({
    name: Joi.string()
        .min(4)
        .label("Facility Name")
        .messages({
            "string.base": "{#label} should be a type of 'string ",
            "string.min": "{#label} should have a minimum length of {#limit}",
        }),
    description: Joi.string()
        .label("Description")
        .messages({
            "string.base": "{#label} should be a type of 'string ",
        }),
    status: Joi.string()
        .label("Facility Status")
        .optional()
        .allow(null, "")
        .external(async (data) => {
            if (data && !Object.values(facilityStatus).includes(data)) {
                throw new Joi.ValidationError("Not a valid Facility Status")
            }

        })
})

module.exports = { 
    createFacilitySchema,
    addFacilityItemSchema,
    getListFacilitySchema,
    updateFacilitySchema
}
