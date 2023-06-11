const adminController = require("../controllers/adminControllers.js")
const adminRouter = require("express").Router()
const { validate } = require("../tools/validators.js")
const { registerAdminSchema, loginAdminSchema } = require("../schemas/admins.js")
// const { checkSchema } = require("express-validator")

// adminRouter.post("/register", 
//     validate(checkSchema(registerAdminSchema, ["body"])), 
//     adminController.registerAdmin
// )

adminRouter.post("/register", 
    validate(registerAdminSchema), adminController.registerAdmin
)

// adminRouter.post("/login",
//     validate(checkSchema(loginAdminSchema, ["body"])), 
//     adminController.loginAdmin
// )

adminRouter.get("/list", adminController.getAdminList)
adminRouter.get("/:admin_id", adminController.getAdminById)

module.exports = adminRouter