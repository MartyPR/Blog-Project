const express = require("express");
const userController = require("../../controllers/users/userCtrl");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const userRouter = express.Router();

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.post("/logout", userController.logout);
userRouter.get("/profile",isAuthenticated, userController.profile);

module.exports = userRouter;
