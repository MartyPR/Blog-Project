const express = require("express");
const userController = require("../../controllers/users/userCtrl");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const userRouter = express.Router();
const multer = require("multer");





// config multer
const storage = multer.diskStorage({});
const upload = multer({
  storage,
});

//Renderin forms

userRouter.get('/login',(req,res)=>{
  res.render('users/login')
})

userRouter.get('/register',(req,res)=>{
  res.render('users/register')
})

userRouter.get('/profile',(req,res)=>{
  res.render('users/profile')
})
userRouter.get('/upload-profile-photo-form',(req,res)=>{
  res.render('users/uploadProfilePhoto')
})

userRouter.get('/upload-cover-photo-form',(req,res)=>{
  res.render('users/uploadCoverPhoto')
})
userRouter.get('/update-user',(req,res)=>{
  res.render('users/updateUser')
})

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.post("/logout", userController.logout);
userRouter.get("/profile", isAuthenticated, userController.profile);
userRouter.get("/:id", userController.userDetail);
userRouter.put("/update/:id", isAuthenticated, userController.updateUser);
userRouter.put(
  "/update_password",
  isAuthenticated,
  userController.updatePassword
);
userRouter.put(
  "/profile_photo_upload",
  isAuthenticated,
  upload.single("profile"),
  userController.uploadProfilePhoto
);

userRouter.put(
    "/cover_img_upload",
     isAuthenticated,
    upload.single("cover"),
    userController.uploadCoverImg
  );
module.exports = userRouter;
