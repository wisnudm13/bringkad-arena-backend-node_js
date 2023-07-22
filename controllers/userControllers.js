const tools = require("../tools/commons.js")
const db = require("../models")
const { Op } = require("sequelize");
const { errorLogger, appLogger } = require("../tools/loggers.js");

const registerUser = async (req, res) => {
    try {
        let data = {
            name: req.body.name,
            phoneNumber: req.body.phone_number,
        }

        appLogger.info("Attempting create user, data: " + JSON.stringify(data))
        
        // create new user
        const user = await db.users.create(data)

        // hash password
        const {salt, hashPassword} = await tools.getHashPassword(req.body.password)

        // create user credentials
        await db.user_credentials.create({
            userID: user.id,
            salt: salt,
            password: hashPassword
        })

        return res.status(200).json({
            code: 200,
            message: "Successfully created user",
            data: user
        })

    } catch (error) {
        errorLogger.error("Error occured when creating user, error: " + error)
        return res.status(400).json({
            code: 400,
            message: "Error occured when creating user",
            errors: error
        });
    }
}   

const loginUser = async (req, res) => {
    try {
        // check if user is found
        const user = await db.users.findOne({
            where: {
                isDeleted: {
                    [Op.eq]: false
                },
                phoneNumber: {
                    [Op.eq]: req.body.phone_number
                }
            }
        })

        if (user == null) {
            return res.status(400).json({
                code: 400,
                message: "Password or Phone Number incorrect",
                data: {}
            })
        }

        const userCred = await db.user_credentials.findOne({
            where: {
                userID: user.id
            }
        })

        if (userCred == null) {
            return res.status(400).json({
                code: 400,
                message: "Password or Phone Number incorrect",
                data: {}
            })
        }

        // check if password is valid
        checkPassword = await tools.checkHashPassword(req.body.password, userCred.password);

        if (!checkPassword) {
            return res.status(400).json({
                code: 400,
                message: "Password or Phone Number incorrect",
                data: {}
            })
        };

        // generate jwt token for auth token
        let tokenPayload = {
            user_id: user.id,
            user_name: user.name
        };

        authToken = await tools.generateAuthToken(tokenPayload);

        if (authToken == null) {
            return res.status(400).json({
                code: 400,
                message: "Login Error",
                data: {}
            })
        };

        // expire all token in db
        await db.tokens.update({
            isActive: false,
            isDeleted: true,
        }, {
            where: {
                userID: user.id
            }
        });

        let tokenData = {
            userID: user.id,
            token: authToken,
            isActive: true
        }

        // save the new token in db 
        await db.tokens.create(tokenData)

        return res.status(200).json({
            code: 200,
            message: "OK",
            data: {
                auth_token: authToken,
                user_id: user.id,
                user_name: user.name
            }

        })

    } catch (error) {
        errorLogger.error("Error occured when login user, error: " + error)
        return res.status(400).json({
            code: 400,
            message: "Error occured when login user",
            errors: error
        });
    }
    
}

const getUserList = async (req, res) => {
    let userList = await db.users.findAll({
        attributes: [
            "id",
            "name",
            "phone_number",
        ]
    })

    return res.status(200).json({
        code: 200,
        message: "OK",
        data: userList
    });
}

const getUserById = async (req, res) => {
    let id = req.params.user_id

    let getUser = await db.users.findOne({ 
        where: { id: id },
        attributes: [
            "id",
            "name",
            "phone_number",
        ]
    })

    if (getUser == null) {
        getUser = "No User found in given ID"
    }

    return res.status(200).json({
        code: 200,
        message: "OK",
        data: getUser
    })
}

module.exports = {
    getUserById,
    getUserList,
    registerUser,
    loginUser
}