const { body } = require('express-validator');

const registerAdminSchema = {
    username: {
        isLength: {
            errorMessage: "Username length must be between 4 - 16",
            options: {
                min: 4,
                max: 16
            }
        }
    }, 
    email: {
        isEmail: {
            errorMessage: "Invalid email format"
        }
    }

};

module.exports = { registerAdminSchema }