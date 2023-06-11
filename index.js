require('dotenv').config();
const express = require("express");
const cors = require("cors")
const adminRouter = require("./routes/adminRoutes.js")
const tokenRouter = require("./routes/tokenRoutes.js")
const db = require("./models")

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

app.get("/", (req, res) => {
    res.json({ message: "Welcome to bezkoder application." });
  });
  
// set port, listen for requests
const PORT = process.env.PORT || 8080;

// sync the db or use authenticate if dont want to sync the table
// db.sequelize.sync()
db.sequelize.authenticate()
.then((req) => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
    });
})
.catch(error => {
  console.error("erorrr" + error)
})

  