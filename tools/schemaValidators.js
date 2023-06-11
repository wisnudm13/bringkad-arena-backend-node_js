const Joi = require('joi');

const schemaValidator = (schema) => async function(req, res, next) {
    try {
        await schema.validateAsync(req.body);
        next();

    } catch (error) {
        console.error(typeof error)
        if (error instanceof Joi.ValidationError) {
            return res.status(422).send({
                code: 422,
                message: "Unprocessable entity",
                errors: error.message
            })
        }

        console.error(error)
        return res.status(500).send({ 
            message: "Something went wrong during validation" 
        });
    }
}

module.exports = {
    schemaValidator,
}