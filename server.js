const express = require("express");

require('./config/dbConnect')
const app = express();
const PORT = process.env.PORT || 9000;



//!Middlewares

//!Routes

//!stat server
 app.listen(PORT, console.log("The server is running on PORT"));
