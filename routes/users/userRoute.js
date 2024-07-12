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
