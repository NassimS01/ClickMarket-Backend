const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: true, limit: 50000000 }));
app.use(bodyParser.json({ limit: 50000000 }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
//config

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

//import routes
const stripe = require("./controllers/stripe");
const user = require("./controllers/user");
const product = require("./controllers/product");

app.use("/api/v2/stripe", stripe);
app.use("/api/v2/user", user);
app.use("/api/v2/products", product);

//it's for ErrorHandling
app.use(ErrorHandler);

module.exports = app;
