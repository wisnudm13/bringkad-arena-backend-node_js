const tools = require("../tools/commons.js")
const db = require("../models")
const { Op, fn } = require("sequelize");
const { errorLogger, appLogger } = require("../tools/loggers.js");

const registerAdmin = async (req, res) => {
    try {
        let data = {
            username: req.body.username,
            email: req.body.email,
            phoneNumber: req.body.phone_number,
            isActive: true
        }

        appLogger.info("Attempting create admin, data: " + JSON.stringify(data))
        
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
        errorLogger.error("Error occured when creating admin, error: " + error)
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
                message: "Password or Username incorrect",
                data: {}
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
                data: {}
            })
        }

        // check if password is valid
        checkPassword = await tools.checkHashPassword(req.body.password, adminCred.password);

        if (!checkPassword) {
            return res.status(400).json({
                code: 400,
                message: "Password or Username incorrect",
                data: {}
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
                data: {}
            })
        };

        // expire all token in db
        await db.tokens.update({
            isActive: false,
            isDeleted: true,
            deletedAt: fn("NOW")
        }, {
            where: {
                adminID: admin.id,
                isDeleted: {
                    [Op.eq]: false
                }
            }


        });

        let tokenData = {
            adminID: admin.id,
            token: authToken,
            isActive: true,
        }

        // save the new token in db 
        await db.tokens.create(tokenData)

        return res.status(200).json({
            code: 200,
            message: "OK",
            data: {
                auth_token: authToken,
                admin_id: admin.id,
                admin_username: admin.username
            }

        })

    } catch (error) {
        errorLogger.error("Error occured when login admin, error: " + error)
        return res.status(400).json({
            code: 400,
            message: "Error occured when login admin",
            errors: error
        });
    }
    
}

const getAdminList = async (req, res) => {
    try {
        let queryFilter = {
            isDeleted: {
                [Op.eq]: false
            },
        }

        const {offset, limit} = tools.validateOffsetLimit(
            parseInt(req.query.page), parseInt(req.query.per_page)
        )

        let adminDataCount = await db.admins.count({where: queryFilter})

        let adminList = await db.admins.findAll({ 
            offset: offset,
            limit: limit,
            where: queryFilter,
            order: [
                ["id", "ASC"]
            ],
            attributes: [
                "id",
                "username",
                "email",
                "is_active"
            ]
        })

        let responseData = {
            page: parseInt(req.query.page),
            per_page: parseInt(req.query.per_page),
            total_data: adminDataCount,
            list_data: adminList
        }

        return res.status(200).json({
            code: 200,
            message: "OK",
            data: responseData
        })

    } catch (error) {
        errorLogger.error("Error occured when getting list admin, error: " + error)
        return res.status(400).json({
            code: 400,
            message: "Error occured when getting list admin",
            errors: error
        });
    }
}

const getAdminById = async (req, res) => {
    try {
        let id = req.params.admin_id
        let statusCode = 200

        let getAdmin = await db.admins.findOne({ 
            where: { 
                id: id,
                isDeleted: {
                    [Op.eq]: false
                }, 
            },
            attributes: [
                "id",
                "username",
                "email",
                "is_active"
            ]
        })

        if (getAdmin == null) {
            getAdmin = "No Admin found in given ID"
            statusCode = 400
        }

        return res.status(statusCode).json({
            code: statusCode,
            message: "OK",
            data: getAdmin
        })

    } catch (error) {
        errorLogger.error("Error occured when getting admin data, error: " + error)
        return res.status(400).json({
            code: 400,
            message: "Error occured when getting admin data",
            errors: error
        });
    }
}

const deleteAdminById = async (req, res) => {
    try {
        let id = req.params.admin_id

        // find admin by id
        let getAdmin = await db.admins.findOne({ 
            where: { 
                id: id,
                isDeleted: {
                    [Op.eq]: false
                }, 
            },
            attributes: [
                "id",
                "username",
                "email",
                "is_active"
            ]
        })

        if (getAdmin == null) {
            getAdmin = "No Admin found in given ID"

            return res.status(400).json({
                code: 400,
                message: getAdmin,
                data: {}
            })
        }

        // update is_deleted in admin
        await db.admins.update({
            isActive: false,
            isDeleted: true,
            deletedAt: fn("NOW")
        }, {
            where: {
                id: getAdmin.id
            }
        });

        // update is_deleted in admin_credentials
        await db.admin_credentials.update({
            isDeleted: true,
            deletedAt: fn("NOW")
        }, {
            where: {
                adminID: getAdmin.id
            }
        });

        // expire all token in db
        await db.tokens.update({
            isActive: false,
            isDeleted: true,
        }, {
            where: {
                adminID: getAdmin.id
            }
        });

        return res.status(200).json({
            code: 200,
            message: "Successfully deleted admin",
            data: {}
        })

    } catch (error) {
        errorLogger.error("Error occured when deleting admin, error: " + error)
        return res.status(400).json({
            code: 400,
            message: "Error occured when deleting admin",
            errors: error
        });
    }
}

const updateAdminById = async (req, res) => {
    try {
        let id = req.params.admin_id
        let adminData = {}
        let adminCredData = {}

        // find admin by id
        let getAdmin = await db.admins.findOne({ 
            where: { 
                id: id,
                isDeleted: {
                    [Op.eq]: false
                }, 
            },
        })

        if (getAdmin == null) {
            getAdmin = "No Admin found in given ID"

            return res.status(400).json({
                code: 400,
                message: getAdmin,
                data: {}
            })
        }

        if (req.body.username != null) {
            adminData["username"] = req.body.username
            
            let checkAdminUsername = await db.admins.findOne({ 
                where: { 
                    isDeleted: {
                        [Op.eq]: false
                    }, 
                    username: {
                        [Op.eq]: req.body.username
                    },
                    [Op.not]: [
                        { id: id }
                    ]
                    
                },
            })
    
            if (checkAdminUsername != null) {
                checkAdminUsername = "Username has been used"
    
                return res.status(400).json({
                    code: 400,
                    message: checkAdminUsername,
                    data: {}
                })
            }

        }

        if (req.body.email != null) {
            adminData["email"] = req.body.email
            
            let checkAdminEmail = await db.admins.findOne({ 
                where: { 
                    isDeleted: {
                        [Op.eq]: false
                    }, 
                    email: {
                        [Op.eq]: req.body.email
                    },
                    [Op.not]: [
                        { id: id }
                    ]
                    
                },
            })
    
            if (checkAdminEmail != null) {
                checkAdminEmail = "Email has been used"
    
                return res.status(400).json({
                    code: 400,
                    message: checkAdminEmail,
                    data: {}
                })
            }

        }

        if (req.body.password != null) {
            if (req.body.confirm_password == null || 
                req.body.password.trim() !== req.body.confirm_password.trim()
            ) {
                checkPassword = "Password and Confirm password does not match"

                return res.status(400).json({
                    code: 400,
                    message: checkPassword,
                    data: {}
                })
            }
            const {salt, hashPassword} = await tools.getHashPassword(req.body.password)

            adminCredData["salt"] = salt
            adminCredData["password"] = hashPassword
        }

        if (!tools.isObjectEmpty(adminData)) {
            await db.admins.update(adminData, {
                where: {
                    id: getAdmin.id
                }
            });
        }

        if (!tools.isObjectEmpty(adminCredData)) {
            await db.admin_credentials.update(adminCredData, {
                where: {
                    adminID: getAdmin.id
                }
            });
        }


        return res.status(200).json({
            code: 200,
            message: "Successfully updated admin",
            data: {}
        })

    } catch (error) {
        errorLogger.error("Error occured when updating admin, error: " + error)
        return res.status(400).json({
            code: 400,
            message: "Error occured when updating admin",
            errors: error
        });
    }

}

module.exports = {
    getAdminById,
    getAdminList,
    registerAdmin,
    loginAdmin,
    deleteAdminById,
    updateAdminById
}
