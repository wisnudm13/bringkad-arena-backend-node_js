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

        res.status(200).json({
            message: "Successfully created admin",
            data: admin
        })

    } catch (error) {
        console.error(error)
        res.status(400).json({
            message: "Error occured when creating admin",
            errors: error
        });
    }
}   

const loginAdmin = async (req, res) => {
    // check if admin is found
    const admin = await db.admins.findOne({
        where: {
            [Op.or]: [
                { username: req.body.username },
                { email: req.body.email }
            ]
        }
    })

    if (admin == null) {
        res.status(400).json({
            message: "Password or Username incorrect",
        })
    }

    // check if password is valid
    checkPassword = await tools.checkHashPassword(req.body.password, admin.password)

    if (!checkPassword) {
        res.status(400).json({
            message: "Password or Username incorrect",
        })

    // generate jwt token for auth token

    res.status(200).json()

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

    res.status(200).send(adminList)
}

const getAdminById = async (req, res) => {
    let id = req.params.admin_id

    let getAdmin = await db.admins.findOne({ where: { id: id }})
    res.status(200).send(getAdmin)
}

module.exports = {
    getAdminById,
    getAdminList,
    registerAdmin,
    loginAdmin
}