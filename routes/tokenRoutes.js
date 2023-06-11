const tokenRouter = require("express").Router()
const { authValidator } = require("../tools/authValidators.js")
const tokenController = require("../controllers/tokenControllers.js")

// protected API
tokenRouter.post("/admins/validate", 
    authValidator("admin"), tokenController.returnValidateToken
)

tokenRouter.post("/users/validate",
    authValidator("user"), tokenController.returnValidateToken
)

module.exports = tokenRouter