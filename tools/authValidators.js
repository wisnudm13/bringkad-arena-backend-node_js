const jwt = require("jsonwebtoken");
const db = require("../models")

const authValidator = (authType) => async function(req, res, next) {
    try {
        // check if request has headers
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).send({
                code: 401,
                message: "1. Unauthorized",
            })
        }

        // get the token from header, check token from db
        const token = authHeader.split(' ')[1];
        console.error("is user " + authType)

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
                    message: "2. Unauthorized",
                })
            }
        }

        // verify jwt token
        jwt.verify(token, process.env.JWT_AUTH_SECRET_KEY, (err, user) => {
            if (err) {
                console.error(err)
                
                return res.status(401).send({
                    code: 401,
                    message: "3. Unauthorized",
                })
            }

            req.user = user
            next();

        });

    } catch (error) {
        console.error(error)
        return res.status(401).send({ 
            code: 401,
            message: "4. Unauthorized" 
        });
    }
}

module.exports = {
    authValidator,
}