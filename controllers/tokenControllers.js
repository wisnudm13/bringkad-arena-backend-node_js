const returnValidateToken = async (req, res) => {
    return res.status(200).json({
        code: 200,
        message: "OK",
    })
}

module.exports = {
    returnValidateToken
}