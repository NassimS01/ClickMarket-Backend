const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDatabase = ()=>{
    mongoose
      .connect(
        "mongodb+srv://clickmarketd:0tVBWSFfR2ul9aJF@clickmarket.ctcs7ca.mongodb.net/",
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      )
      .then((data) => {
        console.log(`mongod connected with server: ${data.connection.host}`);
      });
}

module.exports = connectDatabase;