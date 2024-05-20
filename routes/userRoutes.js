const userController = require("../controllers/userControllers")
const userRouter = require("express").Router()
const { schemaValidator } = require("../tools/schemaValidators.js")
const { authValidator } = require("../tools/authValidators.js")
const userSchema = require("../schemas/users.js")

userRouter.post("/register", 
    schemaValidator(userSchema.registerUserSchema), userController.registerUser
)

userRouter.post("/login",
    schemaValidator(userSchema.loginUserSchema), userController.loginUser
)

// protected API
userRouter.get("/list", 
    [authValidator("admin"), schemaValidator(userSchema.getListUserSchema)], 
    userController.getUserList
)
userRouter.get("/:user_id", authValidator("user"), userController.getUserById)
userRouter.get("/admin/:user_id", authValidator("admin"), userController.getUserById)

userRouter.put("/:user_id", 
    [authValidator("user"), schemaValidator(userSchema.updateUserSchema)], 
    userController.updateUserById
)
userRouter.delete("/:user_id", authValidator("admin"), userController.deleteUserById)

module.exports = userRouter
