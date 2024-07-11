const express = require("express");
const userController = require("../../controllers/users/userCtrl");
const userRouter = express.Router();

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.post("/logout", userController.logout);
userRouter.get("/profile", userController.profile);

module.exports = userRouter;
