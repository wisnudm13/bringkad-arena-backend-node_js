const bcrypt = require("bcrypt")

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

const generateAuthToken = async function() {}

module.exports = {
    getHashPassword,
    checkHashPassword,
    generateAuthToken
}