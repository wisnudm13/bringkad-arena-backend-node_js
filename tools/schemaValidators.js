const Joi = require("joi");
const { errorLogger } = require("./loggers.js");
const { isObjectEmpty } = require("../tools/commons.js")

const schemaValidator = (schema) => async function(req, res, next) {
    try {
        let data = {}

        if (!isObjectEmpty(req.body)) {
            Object.assign(data, req.body)

        }

        if (!isObjectEmpty(req.query)) {
            Object.assign(data, req.query)
        }

        console.log(req.files)

        await schema.validateAsync(data);
        next();

    } catch (error) {
        errorLogger.error(typeof error)
        if (error instanceof Joi.ValidationError) {
            return res.status(422).send({
                code: 422,
                message: "Unprocessable entity",
                errors: error.message
            })
        }

        errorLogger.error(error)
        return res.status(500).send({ 
            message: "Something went wrong during validation" 
        });
    }
}

module.exports = {
    schemaValidator
}