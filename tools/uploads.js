const ImageKit = require("imagekit");
const { errorLogger, appLogger } = require("./loggers.js");
const path = require('path')
const nanoid = require('nanoid-esm');

// const imageKit = ImageKit({
//     publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
//     privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
//     urlEndpoint: process.env.IMAGEKIT_URL
// })

// const uploadFile = async function (fileData){
//     try {
//         appLogger.info("Uploading file to imagekit", JSON.stringify(fileData))

//         await imageKit.upload({

//         })
//         return jwt.sign(tokenPayload, process.env.JWT_AUTH_SECRET_KEY, {
//             expiresIn: process.env.JWT_AUTH_EXPIRES_IN
//         });

//     } catch (error) {
//         errorLogger.error("Error generate auth token " + error)
//         return null
//     }
// }

const multer = require("multer")
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, callback) => {
        const id = nanoid(6)
        const newFilename = `${file.fieldname}_${id}-${new Date().toISOString().replace(/:/g, '-')}${path.extname(file.originalname)}`
        callback(null, newFilename)
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 5572864 }, // up to 5.5 MB
    fileFilter: (req, file, callback) => {
        checkFileType(file, callback)
    }
})

//Check File Type
const checkFileType = (file, cb) => {
    //Allowed extensions
    const fileType = /jpeg|jpg|png|gif|svg|pdf/

    //Check extension
    const extname = fileType.test(path.extname(file.originalname).toLowerCase())

    //Check mimetype
    const mimetype = fileType.test(file.mimetype)

    if (extname && mimetype) {
        return cb(null, true)
    } else {
        return cb('Error: wrong file type!')
    }
}

const fileUploader = (req, res, next)=>{
    const files = req.files
    const uploadedFiles = []
    for (var i = 0; i <files.length; i++){
        uploadedFiles.push('/uploads/' + files[i].filename)
    }
    req.uploadFiles = uploadedFiles.toString()

    next()
    return
}

module.exports = {
    upload,
    fileUploader
}
