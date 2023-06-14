const Joi = require('joi');
const { errorLogger } = require('./loggers');

const schemaValidator = (schema) => async function(req, res, next) {
    try {
        await schema.validateAsync(req.body);
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