const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/users/userRoute");
const postRouter = require("./routes/posts/postRoute");
const commentRouter = require("./routes/comments/commentRoute");
const globalErrHandler = require("./middlewares/globalHandler");
const methoOverride = require("method-override");
const isAuthenticated = require("./middlewares/isAuthenticated");
const Post = require("./models/post/post");
const { truncatePost } = require("./utils/helper");

require("./config/dbConnect");
const app = express();
const PORT = process.env.PORT || 9000;



//Helpers

app.locals.tuncatePost=truncatePost;


//!Middlewares

//configure ejs
app.set("view engine", "ejs");
//server statci files
app.use(express.static(__dirname,+"/public"));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}))

//method override
app.use(methoOverride("_method"))

//save the login user into
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
  });

//!render Home
app.get('/',async (req,res)=>{
  const posts = await Post.find().populate('user');
  
    res.render('index',{
      posts,
     
    })
    
})

//render home with user
app.get('/home', isAuthenticated,async (req,res)=>{
  const posts = await Post.find().populate('user');
  
    res.render('index',{
      posts,
      user:req.user
     
    })
    
})


//!Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/comment", commentRouter);

//!Error handler middlwares
app.use(globalErrHandler);
//!stat server
app.listen(PORT, console.log("The server is running on PORT",PORT));

