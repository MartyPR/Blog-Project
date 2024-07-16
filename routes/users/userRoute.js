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

userRouter.get("/login", (req, res) => {
  res.render("users/login", {
    error: "",
  });
});

userRouter.get("/register", (req, res) => {
  res.render("users/register", {
    error: "",
  });
});

// userRouter.get("/profile", isAuthenticated, (req, res) => {
//   res.render("users/profile", {
//     user: req.user
//   });
// });

userRouter.get("/upload-profile-photo-form", isAuthenticated, (req, res) => {
  res.render("users/uploadProfilePhoto", {
    user: req.user,
    error: "",
  });
});

userRouter.get("/upload-cover-photo-form", isAuthenticated, (req, res) => {
  res.render("users/uploadCoverPhoto", {
    user: req.user,
    error:""
  });
});
userRouter.get("/update-password", isAuthenticated, (req, res) => {
  res.render("users/updatePassword", {
    user: req.user,
  });
});

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.get("/logout", userController.logout);
userRouter.get("/profile", isAuthenticated, userController.profile);
userRouter.get("/:id", userController.userDetail);
userRouter.put("/update", isAuthenticated, userController.updateUser);

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
