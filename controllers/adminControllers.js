const tools = require("../tools/commons.js")
const db = require("../models")
const { Op } = require("sequelize");

const registerAdmin = async (req, res) => {
    try {
        let data = {
            username: req.body.username,
            email: req.body.email,
            phoneNumber: req.body.phone_number,
            isActive: true
        }
        
        // create new admin
        const admin = await db.admins.create(data)

        // hash password
        const {salt, hashPassword} = await tools.getHashPassword(req.body.password)

        // create admin credentials
        await db.admin_credentials.create({
            adminID: admin.id,
            salt: salt,
            password: hashPassword
        })

        return res.status(200).json({
            code: 200,
            message: "Successfully created admin",
            data: admin
        })

    } catch (error) {
        console.error(error)
        return res.status(400).json({
            code: 400,
            message: "Error occured when creating admin",
            errors: error
        });
    }
}   

const loginAdmin = async (req, res) => {
    try {
        // check if admin is found
        const admin = await db.admins.findOne({
            where: {
                isDeleted: {
                    [Op.eq]: false
                },
                [Op.or]: [
                    { username: req.body.email_or_username },
                    { email: req.body.email_or_username }
                ]
            }
        })

        if (admin == null) {
            return res.status(400).json({
                code: 400,
                message: "1. Password or Username incorrect",
            })
        }

        const adminCred = await db.admin_credentials.findOne({
            where: {
                adminID: admin.id
            }
        })

        if (adminCred == null) {
            return res.status(400).json({
                code: 400,
                message: "Password or Username incorrect",
            })
        }

        // check if password is valid
        checkPassword = await tools.checkHashPassword(req.body.password, adminCred.password);

        if (!checkPassword) {
            return res.status(400).json({
                code: 400,
                message: "Password or Username incorrect",
            })
        };

        // generate jwt token for auth token
        let tokenPayload = {
            admin_id: admin.id,
            admin_username: admin.username
        };

        authToken = await tools.generateAuthToken(tokenPayload);

        if (authToken == null) {
            return res.status(400).json({
                code: 400,
                message: "Login Error",
            })
        };

        // expire all token in db
        await db.tokens.update({
            isActive: false,
            isDeleted: true,
        }, {
            where: {
                adminID: admin.id
            }
        });

        let tokenData = {
            adminID: admin.id,
            token: authToken,
            isActive: true
        }

        // save the new token in db 
        await db.tokens.create(tokenData)

        return res.status(200).json({
            code: 200,
            data: {
                auth_token: authToken,
                admin_id: admin.id,
                admin_username: admin.username
            }

        })

    } catch (error) {
        console.error(error)
        return res.status(400).json({
            code: 400,
            message: "Error occured when login admin",
            errors: error
        });
    }
    
}

const getAdminList = async (req, res) => {
    let adminList = await db.admins.findAll({
        attributes: [
            "id",
            "username",
            "email",
            "is_active"
        ]
    })

    return res.status(200).json({
        code: 200,
        data: adminList
    });
}

const getAdminById = async (req, res) => {
    let id = req.params.admin_id

    let getAdmin = await db.admins.findOne({ 
        where: { id: id },
        attributes: [
            "id",
            "username",
            "email",
            "is_active"
        ]
    }
    )
    return res.status(200).send(getAdmin)
}

module.exports = {
    getAdminById,
    getAdminList,
    registerAdmin,
    loginAdmin
}