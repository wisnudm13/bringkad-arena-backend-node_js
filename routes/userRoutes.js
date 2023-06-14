const userController = require("../controllers/userControllers")
const userRouter = require("express").Router()
const { schemaValidator } = require("../tools/schemaValidators.js")
const { authValidator } = require("../tools/authValidators.js")
const { registerUserSchema, loginUserSchema } = require("../schemas/users.js")

userRouter.post("/register", 
    schemaValidator(registerUserSchema), userController.registerUser
)

userRouter.post("/login",
    schemaValidator(loginUserSchema), userController.loginUser
)

// protected API
userRouter.get("/list", authValidator("admin"), userController.getUserList)
userRouter.get("/:user_id", authValidator("admin"), userController.getUserById)
userRouter.get("/profile", authValidator("user"), userController.getUserById)

module.exports = userRouter