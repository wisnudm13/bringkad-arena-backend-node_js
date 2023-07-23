const tools = require("../tools/commons.js")
const db = require("../models")
const { Op, fn } = require("sequelize");
const { errorLogger, appLogger } = require("../tools/loggers.js");

const createFacility = async (req, res) => {
    try {
        
        let facilityData = {
            name: req.body.name,
            type: req.body.type,
            description: req.body.description
        }

        appLogger.info("Attempting create facility, data: " + JSON.stringify(facilityData))
        
        // create new facility
        const facility = await db.facilities.create(facilityData)

        return res.status(200).json({
            code: 200,
            message: "Successfully created facility",
            data: facility
        })

    } catch (error) {
        errorLogger.error("Error occured when creating facility, error: " + error)
        return res.status(400).json({
            code: 400,
            message: "Error occured when creating facility",
            errors: error
        });
    }
} 

const addFacilityItem = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

const getFacilityList = async (req, res) => {
    try {
        let queryFilter = {
            isDeleted: {
                [Op.eq]: false
            },
        }

        if (req.query.status) {
            queryFilter.status = req.query.status
        }

        if (req.query.type) {
            queryFilter.type = req.query.type
        }

        const {offset, limit} = tools.validateOffsetLimit(
            parseInt(req.query.page), parseInt(req.query.per_page)
        )

        let facilityDataCount = await db.facilities.count({where: queryFilter})

        let facilityList = await db.facilities.findAll({ 
            offset: offset,
            limit: limit,
            where: queryFilter,
            attributes: [
                "id",
                "name",
                "type",
                "description",
                "status"
            ],
        })

        let responseData = {
            page: parseInt(req.query.page),
            per_page: parseInt(req.query.per_page),
            total_data: facilityDataCount,
            list_data: facilityList
        }

        return res.status(200).json({
            code: 200,
            message: "OK",
            data: responseData
        })
        
    } catch (error) {
        errorLogger.error("Error occured when getting list facility, error: " + error)
        return res.status(400).json({
            code: 400,
            message: "Error occured when getting list facility",
            errors: error
        });
    }
}

// const loginUser = async (req, res) => {
//     try {
//         // check if user is found
//         const user = await db.users.findOne({
//             where: {
//                 isDeleted: {
//                     [Op.eq]: false
//                 },
//                 phoneNumber: {
//                     [Op.eq]: req.body.phone_number
//                 }
//             }
//         })

//         if (user == null) {
//             return res.status(400).json({
//                 code: 400,
//                 message: "Password or Phone Number incorrect",
//                 data: {}
//             })
//         }

//         const userCred = await db.user_credentials.findOne({
//             where: {
//                 userID: user.id
//             }
//         })

//         if (userCred == null) {
//             return res.status(400).json({
//                 code: 400,
//                 message: "Password or Phone Number incorrect",
//                 data: {}
//             })
//         }

//         // check if password is valid
//         checkPassword = await tools.checkHashPassword(req.body.password, userCred.password);

//         if (!checkPassword) {
//             return res.status(400).json({
//                 code: 400,
//                 message: "Password or Phone Number incorrect",
//                 data: {}
//             })
//         };

//         // generate jwt token for auth token
//         let tokenPayload = {
//             user_id: user.id,
//             user_name: user.name
//         };

//         authToken = await tools.generateAuthToken(tokenPayload);

//         if (authToken == null) {
//             return res.status(400).json({
//                 code: 400,
//                 message: "Login Error",
//                 data: {}
//             })
//         };

//         // expire all token in db
//         await db.tokens.update({
//             isActive: false,
//             isDeleted: true,
//         }, {
//             where: {
//                 userID: user.id
//             }
//         });

//         let tokenData = {
//             userID: user.id,
//             token: authToken,
//             isActive: true
//         }

//         // save the new token in db 
//         await db.tokens.create(tokenData)

//         return res.status(200).json({
//             code: 200,
//             message: "OK",
//             data: {
//                 auth_token: authToken,
//                 user_id: user.id,
//                 user_name: user.name
//             }

//         })

//     } catch (error) {
//         errorLogger.error("Error occured when login user, error: " + error)
//         return res.status(400).json({
//             code: 400,
//             message: "Error occured when login user",
//             errors: error
//         });
//     }
    
// }

// const getUserList = async (req, res) => {
//     let userList = await db.users.findAll({
//         attributes: [
//             "id",
//             "name",
//             "phone_number",
//         ]
//     })

//     return res.status(200).json({
//         code: 200,
//         message: "OK",
//         data: userList
//     });
// }

// const getUserById = async (req, res) => {
//     let id = req.params.user_id

//     let getUser = await db.users.findOne({ 
//         where: { id: id },
//         attributes: [
//             "id",
//             "name",
//             "phone_number",
//         ]
//     })

//     if (getUser == null) {
//         getUser = "No User found in given ID"
//     }

//     return res.status(200).json({
//         code: 200,
//         message: "OK",
//         data: getUser
//     })
// }

// const deleteUserById = async (req, res) => {
//     try {
//         let id = req.params.user_id

//         // find user by id
//         let getUser = await db.users.findOne({ 
//             where: { 
//                 id: id,
//                 isDeleted: {
//                     [Op.eq]: false
//                 }, 
//             },
//         })

//         if (getUser == null) {
//             getUser = "No User found in given ID"

//             return res.status(400).json({
//                 code: 400,
//                 message: getUser,
//                 data: {}
//             })
//         }

//         // update is_deleted in user
//         await db.users.update({
//             isActive: false,
//             isDeleted: true,
//             deletedAt: fn("NOW")
//         }, {
//             where: {
//                 id: getUser.id
//             }
//         });

//         // update is_deleted in user_credentials
//         await db.user_credentials.update({
//             isDeleted: true,
//             deletedAt: fn("NOW")
//         }, {
//             where: {
//                 userID: getUser.id
//             }
//         });

//         // expire all token in db
//         await db.tokens.update({
//             isActive: false,
//             isDeleted: true,
//         }, {
//             where: {
//                 userID: getUser.id
//             }
//         });

//         return res.status(200).json({
//             code: 200,
//             message: "Successfully deleted user",
//             data: {}
//         })

//     } catch (error) {
//         errorLogger.error("Error occured when deleting user, error: " + error)
//         return res.status(400).json({
//             code: 400,
//             message: "Error occured when deleting user",
//             errors: error
//         });
//     }
// }

// const updateUserById = async (req, res) => {
//     try {
//         let id = req.params.user_id
//         let userData = []
//         let userCredData = {}

//         // find user by id
//         let getUser = await db.users.findOne({ 
//             where: { 
//                 id: id,
//                 isDeleted: {
//                     [Op.eq]: false
//                 }, 
//             },
//         })

//         if (getUser == null) {
//             getUser = "No User found in given ID"

//             return res.status(400).json({
//                 code: 400,
//                 message: getUser,
//                 data: {}
//             })
//         }

//         if (req.body.name != null) {
//             userData["name"] = req.body.name

//         }

//         if (req.body.phone_number != null) {
//             userData["phoneNumber"] = req.body.phone_number
            
//             let checkUserPhoneNumber = await db.users.findOne({ 
//                 where: { 
//                     isDeleted: {
//                         [Op.eq]: false
//                     }, 
//                     phoneNumber: {
//                         [Op.eq]: req.body.phone_number
//                     },
//                     [Op.not]: [
//                         { id: id }
//                     ]
                    
//                 },
//             })
    
//             if (checkUserPhoneNumber != null) {
//                 checkUserPhoneNumber = "Phone Number has been used"
    
//                 return res.status(400).json({
//                     code: 400,
//                     message: checkUserPhoneNumber,
//                     data: {}
//                 })
//             }

//         }

//         if (req.body.password != null) {
//             if (req.body.confirm_password == null || 
//                 req.body.password.trim() !== req.body.confirm_password.trim()
//             ) {
//                 checkPassword = "Password and Confirm password does not match"

//                 return res.status(400).json({
//                     code: 400,
//                     message: checkPassword,
//                     data: {}
//                 })
//             }
//             const {salt, hashPassword} = await tools.getHashPassword(req.body.password)

//             userCredData["salt"] = salt
//             userCredData["password"] = hashPassword
//         }

//         if (!tools.isObjectEmpty(userData)) {
//             await db.users.update(userData, {
//                 where: {
//                     id: getUser.id
//                 }
//             });
//         }

//         if (!tools.isObjectEmpty(userCredData)) {
//             await db.user_credentials.update(userCredData, {
//                 where: {
//                     userID: getUser.id
//                 }
//             });
//         }


//         return res.status(200).json({
//             code: 200,
//             message: "Successfully updated user",
//             data: {}
//         })

//     } catch (error) {
//         errorLogger.error("Error occured when updating user, error: " + error)
//         return res.status(400).json({
//             code: 400,
//             message: "Error occured when updating user",
//             errors: error
//         });
//     }

// }

module.exports = {
    createFacility,
    addFacilityItem,
    getFacilityList
}
