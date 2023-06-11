const adminController = require("../controllers/adminControllers.js")
const adminRouter = require("express").Router()
const { schemaValidator } = require("../tools/schemaValidators.js")
const { registerAdminSchema, loginAdminSchema } = require("../schemas/admins.js")

adminRouter.post("/register", 
    schemaValidator(registerAdminSchema), adminController.registerAdmin
)

adminRouter.post("/login",
    schemaValidator(loginAdminSchema), adminController.loginAdmin
)

adminRouter.get("/list", adminController.getAdminList)
adminRouter.get("/:admin_id", adminController.getAdminById)

module.exports = adminRouter