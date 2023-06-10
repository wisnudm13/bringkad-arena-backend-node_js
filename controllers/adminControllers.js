// const tools = require("../tools/commons.js")
const db = require("../models")

const Admin = db.admins

const registerAdmin = async (req, res) => {
    try {
        let data = {
            username: req.body.username,
            email: req.body.email,
            phone_number: req.body.phone_number
        }

        // hashPassword = tools.getHashPassword(req.body.password)
    
        const admin = await Admin.create(data)
        res.status(200).send(admin)

    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
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
    registerAdmin
}