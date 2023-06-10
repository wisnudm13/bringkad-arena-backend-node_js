const adminController = require("../controllers/adminControllers.js")
const adminRouter = require("express").Router()
const { validate } = require("../tools/validators.js")
const { registerAdminSchema } = require("../schemas/admins.js")
const { checkSchema } = require("express-validator")

adminRouter.post("/register", 
    validate(checkSchema(registerAdminSchema)), 
    adminController.registerAdmin
)

adminRouter.post("/login", adminController.loginAdmin)
adminRouter.get("/list", adminController.getAdminList)
adminRouter.get("/:admin_id", adminController.getAdminById)

module.exports = adminRouter