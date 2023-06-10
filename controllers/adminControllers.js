const tools = require("../tools/commons.js")
const db = require("../models")

const Admin = db.admins
const AdminCred = db.admin_credentials

const registerAdmin = async (req, res) => {
    try {
        let data = {
            username: req.body.username,
            email: req.body.email,
            phoneNumber: req.body.phone_number,
            isActive: true
        }
        
        // create new admin
        const admin = await Admin.create(data)

        // hash password
        const {salt, hashPassword} = await tools.getHashPassword(req.body.password)

        // create admin credentials
        const adminCred = await AdminCred.create({
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
            errors: error.errors.message
        });
    }
}   

const loginAdmin = async (req, res) => {
    
}

const getAdminList = async (req, res) => {
    let adminList = await Admin.findAll({
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

    let getAdmin = await Admin.findOne({ where: { id: id }})
    res.status(200).send(getAdmin)
}

module.exports = {
    getAdminById,
    getAdminList,
    registerAdmin,
    loginAdmin
}