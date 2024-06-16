const tools = require("../tools/commons.js")
const db = require("../models")
const { Op, fn } = require("sequelize");
const { errorLogger, appLogger } = require("../tools/loggers.js");
const { facilityType, facilityStatus } = require("../tools/enums");
const { func } = require("joi");

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

        if (req.files.facility_images) {
            req.files.facility_images.map(function(file) {
                let fileAsset = {
                    fileType: "FACILITY_IMAGE",
                    filePath: file.path.split('/').slice(1).join('/'),
                    referenceType: "FACILITY",
                    referenceID: facility.id
                }

                db.file_assets.create(fileAsset)

            })
        }

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
        if (req.body.facility_id) {
            let getFacility = await db.facilities.findOne({ 
                where: { 
                    id: req.body.facility_id,
                    isDeleted: {
                        [Op.eq]: false
                    }, 
                },
            })

            if (getFacility == null) {
                getFacility = "No Facility found in given ID"
    
                return res.status(400).json({
                    code: 400,
                    message: getFacility,
                    data: {}
                })
            }
            
            // validate request body
            const {checkStatus, checkResponse} = await validateAddFacilityItem(getFacility, req.body)

            if (!checkStatus) {
                return res.status(400).json({
                    code: 400,
                    message: checkResponse,
                    data: {}
                })
            }
            
            let data = {}
            let facilityName = ""

            if (req.body.name == null) {
                facilityName = req.body.start_time.concat(" - ", req.body.finish_time)

            } else {
                facilityName = req.body.name
            }

            data.facilityID = getFacility.id
            data.name = facilityName
            data.price = req.body.price
            
            if (req.body.start_time != null) {
                data.startTime = req.body.start_time
            } 

            if (req.body.finish_time != null) {
                data.finishTime = req.body.finish_time
            }

            const facilityItem = await db.facility_items.create(data)

            return res.status(200).json({
                code: 200,
                message: "Successfully created facility item",
                data: facilityItem
            })

        }


    } catch (error) {
        errorLogger.error("Error occured when adding facility item, error: " + error)
        return res.status(400).json({
            code: 400,
            message: "Error occured when adding facility item",
            errors: error
        });
    }
}

const validateAddFacilityItem = async function (facilityData, requestBody) {
    let errorMessage = ""
    
    switch (facilityData.type) {
        case "SPORT":
            if (requestBody.start_time == null || requestBody.finish_time == null) {
                errorMessage = "Start time and Finish time is required for SPORT facility"

                return {
                    checkStatus: false,
                    checkResponse: errorMessage
                }
            }

            if (requestBody.start_time >= requestBody.finish_time) {
                errorMessage = "Finish time must be greater than start time"

                return {
                    checkStatus: false,
                    checkResponse: errorMessage
                }
            }
            
            const getFacilityItemList = await db.facility_items.findAll({
                where: {
                    isDeleted: {
                        [Op.eq]: false
                    },
                    facilityID: facilityData.id
                }
            })

            if (getFacilityItemList != null) {
                let today = new Date()
                let splitNewStartTime = requestBody.start_time.split(":")
                let splitNewFinishTime = requestBody.finish_time.split(":")
                let newStartTime = (
                    new Date(
                        today.getFullYear(), 
                        today.getMonth(), 
                        today.getDate(), 
                        splitNewStartTime[0], 
                        splitNewStartTime[1], 
                        "00"
                    )
                )
                let newFinishTime = (
                    new Date(
                        today.getFullYear(), 
                        today.getMonth(), 
                        today.getDate(), 
                        splitNewFinishTime[0], 
                        splitNewFinishTime[1], 
                        "00"
                    )
                )

                for (let i = 0; i < getFacilityItemList.length; i++)  {
                    rowData = getFacilityItemList[i].dataValues
                    let splitStartTime = requestBody.start_time.split(":")
                    let splitFinishTime = requestBody.finish_time.split(":")

                    let startTime = new Date(
                        today.getFullYear(), 
                        today.getMonth(), 
                        today.getDate(), 
                        splitStartTime[0], 
                        splitStartTime[1], 
                        "00"
                    )

                    let finishTime = new Date(
                        today.getFullYear(), 
                        today.getMonth(), 
                        today.getDate(), 
                        splitFinishTime[0], 
                        splitFinishTime[1], 
                        "00"
                    )

                    if ((startTime == newStartTime && finishTime == newFinishTime) || 
                        (finishTime > newStartTime && finishTime <= newFinishTime)) {
                            errorMessage = "Start time or Finish time is invalid"

                            return {
                                checkStatus: false,
                                checkResponse: errorMessage
                            }
                        }

                  }
            }

            return {
                checkStatus: true,
                checkResponse: {}
            }

        case "INN":
            if (requestBody.name == null) {
                errorMessage = "Name is required"

                return {
                    checkStatus: false,
                    checkResponse: errorMessage
                }
            }

            return {
                checkStatus: true,
                checkResponse: {}
            }
    
        default:
            break;

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
            order: [
                ["id", "ASC"]
            ],
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

const getFacilityById = async (req, res) => {
    let id = req.params.facility_id

    let getFacility = await db.facilities.findOne({ 
        where: { id: id },
        attributes: [
            "id",
            "name",
            "type",
            "description",
            "status",
        ]
    })

    if (getFacility == null) {
        getFacility = "No Facility found in given ID"
    }

    let getFacilityFileAsset = await db.file_assets.findOne({
        where: {
            referenceID: id,
            referenceType: "FACILITY",
            fileType: "FACILITY_IMAGE",
            isDeleted: {
                [Op.eq]: false
            }, 
        },
        attributes: [
            "id",
            "filePath"
        ]
    })

    const response = {
        id: getFacility.id,
        name: getFacility.name,
        type: getFacility.type,
        description: getFacility.description,
        status: getFacility.status,
        facility_image: getFacilityFileAsset?.filePath ? getFacilityFileAsset?.filePath : null
    }

    return res.status(200).json({
        code: 200,
        message: "OK",
        data: response
    })
}

const getFacilityItemById = async (req, res) => {
    let id = req.params.user_id

    let getUser = await db.users.findOne({ 
        where: { id: id },
        attributes: [
            "id",
            "name",
            "phone_number",
        ]
    })

    if (getUser == null) {
        getUser = "No User found in given ID"
    }

    return res.status(200).json({
        code: 200,
        message: "OK",
        data: getUser
    })
}

const deleteFacilityById = async (req, res) => {
    try {
        let id = req.params.facility_id

        // find facility by id
        let getFacility = await db.facilities.findOne({ 
            where: { 
                id: id,
                isDeleted: {
                    [Op.eq]: false
                }, 
            },
        })

        if (getFacility == null) {
            getFacility = "No Facility found in given ID"

            return res.status(400).json({
                code: 400,
                message: getFacility,
                data: {}
            })
        }

        // update is_deleted in facility
        await db.facilities.update({
            isDeleted: true,
            deletedAt: fn("NOW")
        }, {
            where: {
                id: getFacility.id
            }
        });

        // // update is_deleted in user_credentials
        // await db.user_credentials.update({
        //     isDeleted: true,
        //     deletedAt: fn("NOW")
        // }, {
        //     where: {
        //         userID: getUser.id
        //     }
        // });

        // // expire all token in db
        // await db.tokens.update({
        //     isActive: false,
        //     isDeleted: true,
        // }, {
        //     where: {
        //         userID: getUser.id
        //     }
        // });

        return res.status(200).json({
            code: 200,
            message: "Successfully deleted facility",
            data: {}
        })

    } catch (error) {
        errorLogger.error("Error occured when deleting facility, error: " + error)
        return res.status(400).json({
            code: 400,
            message: "Error occured when deleting facility",
            errors: error
        });
    }
}

const deleteFacilityItemById = async (req, res) => {
    try {
        let id = req.params.user_id

        // find user by id
        let getUser = await db.users.findOne({ 
            where: { 
                id: id,
                isDeleted: {
                    [Op.eq]: false
                }, 
            },
        })

        if (getUser == null) {
            getUser = "No User found in given ID"

            return res.status(400).json({
                code: 400,
                message: getUser,
                data: {}
            })
        }

        // update is_deleted in user
        await db.users.update({
            isActive: false,
            isDeleted: true,
            deletedAt: fn("NOW")
        }, {
            where: {
                id: getUser.id
            }
        });

        // update is_deleted in user_credentials
        await db.user_credentials.update({
            isDeleted: true,
            deletedAt: fn("NOW")
        }, {
            where: {
                userID: getUser.id
            }
        });

        // expire all token in db
        await db.tokens.update({
            isActive: false,
            isDeleted: true,
        }, {
            where: {
                userID: getUser.id
            }
        });

        return res.status(200).json({
            code: 200,
            message: "Successfully deleted user",
            data: {}
        })

    } catch (error) {
        errorLogger.error("Error occured when deleting user, error: " + error)
        return res.status(400).json({
            code: 400,
            message: "Error occured when deleting user",
            errors: error
        });
    }
}

const getFacilityType = async (req, res) => {
    try {
        let responseData = []

        for (let [key, value] of Object.entries(facilityType)) {
            let tempData = {
                text: value,
                value: key
            }

            responseData.push(tempData)
        }

        return res.status(200).json({
            code: 200,
            message: "OK",
            data: responseData
        })

    } catch (error) {
        errorLogger.error("Error occured when getting facility type, error: " + error)
        return res.status(400).json({
            code: 400,
            message: "Error occured when getting facility type",
            errors: error
        });
    }
}

const getFacilityStatus = async (req, res) => {
    try {
        let responseData = []

        for (let [key, value] of Object.entries(facilityStatus)) {
            let tempData = {
                text: value,
                value: key
            }

            responseData.push(tempData)
        }

        return res.status(200).json({
            code: 200,
            message: "OK",
            data: responseData
        })

    } catch (error) {
        errorLogger.error("Error occured when getting facility status, error: " + error)
        return res.status(400).json({
            code: 400,
            message: "Error occured when getting facility status",
            errors: error
        });
    }
}

const updateFacilityById = async (req, res) => {
    try {
        let id = req.params.facility_id
        let facilityData = {}

        // find facility by id
        let getFacility = await db.facilities.findOne({ 
            where: { 
                id: id,
                isDeleted: {
                    [Op.eq]: false
                }, 
            },
        })

        if (getFacility == null) {
            getFacility = "No Facility found in given ID"

            return res.status(400).json({
                code: 400,
                message: getFacility,
                data: {}
            })
        }

        if (req.body.name != null) {
            facilityData["name"] = req.body.name

        }

        if (req.body.status != null) {
            facilityData["status"] = req.body.status

        }

        if (req.body.description != null) {
            facilityData["description"] = req.body.description

        }

        if (!tools.isObjectEmpty(facilityData)) {
            await db.facilities.update(facilityData, {
                where: {
                    id: getFacility.id
                }
            });
        }

        if (req.files.facility_images) {
            // update is_deleted in file asset
            await db.file_assets.update({
                isDeleted: true,
                deletedAt: fn("NOW")
            }, {
                where: {
                    referenceID: getFacility.id,
                    referenceType: "FACILITY",
                    fileType: "FACILITY_IMAGE"
                }
            });

            req.files.facility_images.map(function(file) {
                let fileAsset = {
                    fileType: "FACILITY_IMAGE",
                    filePath: file.path.split('/').slice(1).join('/'),
                    referenceType: "FACILITY",
                    referenceID: getFacility.id
                }

                db.file_assets.create(fileAsset)

            })
        }

        return res.status(200).json({
            code: 200,
            message: "Successfully updated facility",
            data: {}
        })

    } catch (error) {
        errorLogger.error("Error occured when updating facility, error: " + error)
        return res.status(400).json({
            code: 400,
            message: "Error occured when updating facility",
            errors: error
        });
    }

}

const updateFacilityItemById = async (req, res) => {
    try {
        let id = req.params.facility_id
        let facilityData = {}

        // find facility by id
        let getFacility = await db.facilities.findOne({ 
            where: { 
                id: id,
                isDeleted: {
                    [Op.eq]: false
                }, 
            },
        })

        if (getFacility == null) {
            getFacility = "No Facility found in given ID"

            return res.status(400).json({
                code: 400,
                message: getFacility,
                data: {}
            })
        }

        if (req.body.name != null) {
            facilityData["name"] = req.body.name

        }

        if (req.body.status != null) {
            facilityData["status"] = req.body.status

        }

        if (req.body.description != null) {
            facilityData["description"] = req.body.description

        }

        if (!tools.isObjectEmpty(facilityData)) {
            await db.facilities.update(facilityData, {
                where: {
                    id: getFacility.id
                }
            });
        }

        return res.status(200).json({
            code: 200,
            message: "Successfully updated facility",
            data: {}
        })

    } catch (error) {
        errorLogger.error("Error occured when updating facility, error: " + error)
        return res.status(400).json({
            code: 400,
            message: "Error occured when updating facility",
            errors: error
        });
    }

}

module.exports = {
    createFacility,
    addFacilityItem,
    getFacilityList,
    updateFacilityById,
    getFacilityType,
    getFacilityStatus,
    deleteFacilityById,
    getFacilityById,
    deleteFacilityItemById,
    updateFacilityItemById,
    getFacilityItemById
}
