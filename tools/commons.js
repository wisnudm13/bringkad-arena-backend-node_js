const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');

const getHashPassword = async function(password) {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        return {
            salt: salt, 
            hashPassword: hashPassword
        }
    } catch (error) {
        console.error("Error creating hash password " + error)
    }
}

const checkHashPassword = async function(password, hashPassword) {
    try {
        const result = await bcrypt.compare(password, hashPassword)
        return result

    } catch (error) {
        console.error("Error checking hash password " + error)
        return false

    }
}

const generateAuthToken = async function(tokenPayload) {
    try {
        return jwt.sign(tokenPayload, process.env.JWT_AUTH_SECRET_KEY, {
            expiresIn: process.env.JWT_AUTH_EXPIRES_IN
        });

    } catch (error) {
        console.error("Error generate auth token " + error)
        return null
    }
}

const isObjectEmpty = (object) => {
    return Object.keys(object).length === 0 && object.constructor == Object
}

const isIndonesianPhoneNumber = (phoneNumber) => {
    format = /^(\+62|62|0)8[1-9][0-9]{6,9}$/

    if (phoneNumber.match(format)) {
        return true
    }

    return false
}

const convertToBase64 = (file) => {
    return file.buffer.toString("base64")
}

const validateOffsetLimit = (page, perPage) => {
    let offset = 0
    let limit = 10

    if (page != null && perPage != null) {
        limit = perPage

        if (page > 0) {
            offset = (page - 1) * perPage
        }
        
    }

    return {
        offset: offset,
        limit: limit,
    }
}

module.exports = {
    getHashPassword,
    checkHashPassword,
    generateAuthToken,
    isObjectEmpty,
    isIndonesianPhoneNumber,
    validateOffsetLimit
}
