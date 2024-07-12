const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/users/userRoute");
const postRouter = require("./routes/posts/postRoute");
const commentRouter = require("./routes/comments/commentRoute");
const globalErrHandler = require("./middlewares/globalHandler");

require("./config/dbConnect");
const app = express();
const PORT = process.env.PORT || 9000;

//!Middlewares
app.use(express.json());
app.use(cookieParser());
//!Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/comment", commentRouter);

//!Error handler middlwares
app.use(globalErrHandler)
//!stat server
app.listen(PORT, console.log("The server is running on PORT"));
