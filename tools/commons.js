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
        console.error("Error creating has password " + error)
    }
}

module.exports = {
    getHashPassword
}