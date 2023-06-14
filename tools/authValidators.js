const jwt = require("jsonwebtoken");
const db = require("../models")
const { errorLogger, appLogger } = require("../tools/loggers.js")

const authValidator = (authType) => async function(req, res, next) {
    try {
        // check if request has headers
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).send({
                code: 401,
                message: "Unauthorized",
            })
        }

        // get the token from header, check token from db
        const token = authHeader.split(' ')[1];

        if(authType == "admin") {
            const adminToken = await db.tokens.findOne({
                where: {
                    token: token,
                    isActive: true
                },
                order: [
                    ["created_at", "DESC"]
                ]
            })

            if(!adminToken) {
                return res.status(401).send({
                    code: 401,
                    message: "Unauthorized",
                })
            }

        } else {
            const userToken = await db.tokens.findOne({
                where: {
                    token: token,
                    isActive: true
                },
                order: [
                    ["created_at", "DESC"]
                ]
            })

            if(!userToken) {
                return res.status(401).send({
                    code: 401,
                    message: "Unauthorized",
                })
            }
        }

        // verify jwt token
        jwt.verify(token, process.env.JWT_AUTH_SECRET_KEY, (err, user) => {
            if (err) {
                errorLogger.error("Error when verifying Auth JWT " + err)
                
                return res.status(401).send({
                    code: 401,
                    message: "Unauthorized",
                })
            }

            appLogger.info("Verify Auth JWT result " + user)

            req.user = user
            next();

        });

    } catch (error) {
        errorLogger.error("Error when verifying Auth JWT " + error)
        return res.status(401).send({ 
            code: 401,
            message: "Unauthorized" 
        });
    }
}

module.exports = {
    authValidator,
}