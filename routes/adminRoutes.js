const adminController = require("../controllers/adminControllers.js")
const adminRouter = require("express").Router()
const { schemaValidator } = require("../tools/schemaValidators.js")
const { authValidator } = require("../tools/authValidators.js")
const adminSchema = require("../schemas/admins.js")

adminRouter.post("/register", 
    schemaValidator(adminSchema.registerAdminSchema), adminController.registerAdmin
)
adminRouter.post("/login",
    schemaValidator(adminSchema.loginAdminSchema), adminController.loginAdmin
)

// protected API
adminRouter.get("/list", 
    [authValidator("admin"), schemaValidator(adminSchema.getListAdminSchema)], 
    adminController.getAdminList
)
adminRouter.get("/:admin_id", authValidator("admin"), adminController.getAdminById)
adminRouter.put("/:admin_id", 
    [authValidator("admin"), schemaValidator(adminSchema.updateAdminSchema)], 
    adminController.updateAdminById
)
adminRouter.delete("/:admin_id", authValidator("admin"), adminController.deleteAdminById)

module.exports = adminRouter
