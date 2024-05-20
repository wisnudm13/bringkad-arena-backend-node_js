const facilityController = require("../controllers/facilityControllers.js")
const facilityRouter = require("express").Router()
const { schemaValidator } = require("../tools/schemaValidators.js")
const { authValidator } = require("../tools/authValidators.js")
const facilitySchema = require("../schemas/facilities.js")
const multer = require("multer")
const upload = multer()

// protected API
// facilityRouter.post("/create", 
//     [upload.single("file"), authValidator("admin"), schemaValidator(facilitySchema.createFacilitySchema)], 
//     facilityController.createFacility
// )

// facility
facilityRouter.post("/create", 
    [authValidator("admin"), schemaValidator(facilitySchema.createFacilitySchema)], 
    facilityController.createFacility
)
facilityRouter.get("/list", 
    [authValidator("admin"), schemaValidator(facilitySchema.getListFacilitySchema)],
    facilityController.getFacilityList
)
facilityRouter.get("/type/list", facilityController.getFacilityType)
facilityRouter.get("/status/list", facilityController.getFacilityStatus)
facilityRouter.put("/:facility_id", 
    [authValidator("admin"), schemaValidator(facilitySchema.updateFacilitySchema)],
    facilityController.updateFacilityById
)
facilityRouter.get("/:facility_id", authValidator("admin"), facilityController.getFacilityById)
facilityRouter.delete("/:facility_id", authValidator("admin"), facilityController.deleteFacilityById)
// facilityRouter.post("/:facility_id/upload")

// facility item
facilityRouter.post("/item/create", 
    [authValidator("admin"), schemaValidator(facilitySchema.addFacilityItemSchema)], 
    facilityController.addFacilityItem
)
facilityRouter.put("/item/:facility_item_id", 
    [authValidator("admin"), schemaValidator(facilitySchema.updateFacilityItemSchema)], 
    facilityController.updateFacilityItemById
)
facilityRouter.delete("/item/:facility_item_id", authValidator("admin"), facilityController.deleteFacilityItemById)
facilityRouter.get("/item/:facility_item_id", authValidator("admin"), facilityController.getFacilityItemById)


// facilityRouter.put("/item/:facility_item_id",
//     [schemaValidator(loginAdminSchema)], facilityController.loginAdmin
// )
// facilityRouter.get("/item/:facility_item_id",
//     [schemaValidator(loginAdminSchema)], facilityController.loginAdmin
// )


// facilityRouter.get("/list", authValidator("admin"), facilityController.getAdminList)
// facilityRouter.get("/:admin_id", authValidator("admin"), facilityController.getAdminById)

module.exports = facilityRouter
