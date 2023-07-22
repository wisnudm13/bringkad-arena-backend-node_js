const ImageKit = require("imagekit");
const { errorLogger, appLogger } = require("./loggers.js");


const imageKit = ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL
})

const uploadFile = async function (fileData){
    try {
        appLogger.info("Uploading file to imagekit", JSON.stringify(fileData))

        await imageKit.upload({

        })
        return jwt.sign(tokenPayload, process.env.JWT_AUTH_SECRET_KEY, {
            expiresIn: process.env.JWT_AUTH_EXPIRES_IN
        });

    } catch (error) {
        errorLogger.error("Error generate auth token " + error)
        return null
    }
}

module.exports = {
    uploadFile
}
