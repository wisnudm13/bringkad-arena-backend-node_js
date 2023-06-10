const dbConfig = require("../config/dbConfig.js")

const { Sequelize, DataTypes } = require("sequelize")

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorAliases: false,

        pool: {
            max: dbConfig.max,
            min: dbConfig.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
)

sequelize.authenticate().
then(() => {
    console.log("connected to db")
})
.catch(err => {
    console.log("error" + err)
})

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

db.admins = require("./adminModels.js")(sequelize, DataTypes)
db.adminsCredentials = require("./adminCredentialModels.js")(sequelize, DataTypes)

db.sequelize.sync({ force: true })
.then(() => {
    console.log("re-sync done")
})

module.exports = db