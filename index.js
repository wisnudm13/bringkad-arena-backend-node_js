const express = require("express");
const cors = require("cors")
const adminRouter = require("./app/routes/adminRoutes.js")


const app = express();

var corsOptions = {
    origin: "http://localhost:8081"
}

app.use(cors(corsOptions))

// for body of the request
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// routes
app.use("v1/admins/", adminRouter)

app.get("/", (req, res) => {
    res.json({ message: "Welcome to bezkoder application." });
  });
  
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}.`);
});
  