require('dotenv').config();
const express = require("express");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const swaggerJSDoc = require('swagger-jsdoc');
const adminRouter = require("./routes/adminRoutes.js");
const tokenRouter = require("./routes/tokenRoutes.js");
const userRouter = require("./routes/userRoutes.js");
const facilityRouter = require('./routes/facilityRoutes.js')
const db = require("./models");
const { errorLogger, appLogger } = require("./tools/loggers");

// instantiate swagger config
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Bringkad Arena API',
    version: '1.0.0',
    description: "Documentation for Bringkad Arena API"
  },
  servers: [
    {
      url: "https://api-dev.bringkadarena.com"
    }
  ]
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ["./api_docs/*.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions)

// instantiante app
const app = express();

// set cors
var corsOptions = {
    origin: "http://localhost:8081"
}

app.use(cors(corsOptions))

// for body of the request
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/v1/admins/", adminRouter)
app.use("/v1/tokens/", tokenRouter)
app.use("/v1/users/", userRouter)
app.use("/v1/facilities/", facilityRouter)
app.use("/v1/api-docs/", swaggerUI.serve, swaggerUI.setup(swaggerSpec))

app.get("/", (req, res) => {
    res.json({ message: "Welcome to bezkoder application." });
  });
  
// set port, listen for requests
const PORT = process.env.PORT || 6060;

// sync the db or use authenticate if dont want to sync the table
// db.sequelize.sync()
db.sequelize.authenticate()
.then((req) => {
  app.listen(PORT, () => {
    appLogger.info(`Server is running on port ${PORT}.`);
  });
})
.catch(error => {
  errorLogger.error("Error starting server " + error)
})
  