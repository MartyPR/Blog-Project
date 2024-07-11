const express = require("express");
require('dotenv').config()
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/users/userRoute");

require('./config/dbConnect')
const app = express();
const PORT = process.env.PORT || 9000;



//!Middlewares
 app.use(express.json());
 app.use(cookieParser())
//!Routes
app.use("/",userRouter);
 



//!stat server
 app.listen(PORT, console.log("The server is running on PORT"));
