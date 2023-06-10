const adminController = require("../controllers/adminControllers.js")
const adminRouter = require("express").Router()

adminRouter.post("/register", adminController.registerAdmin)
adminRouter.post("/login", adminController.loginAdmin)
adminRouter.get("/list", adminController.getAdminList)
adminRouter.get("/:admin_id", adminController.getAdminById)

module.exports = adminRouter