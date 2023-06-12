const adminController = require("../controllers/adminControllers.js")
const adminRouter = require("express").Router()
const { schemaValidator } = require("../tools/schemaValidators.js")
const { authValidator } = require("../tools/authValidators.js")
const { registerAdminSchema, loginAdminSchema } = require("../schemas/admins.js")

adminRouter.post("/register", 
    schemaValidator(registerAdminSchema), adminController.registerAdmin
)

adminRouter.post("/login",
    schemaValidator(loginAdminSchema), adminController.loginAdmin
)

// protected API
adminRouter.get("/list", authValidator("admin"), adminController.getAdminList)
adminRouter.get("/:admin_id", authValidator("admin"), adminController.getAdminById)

module.exports = adminRouter