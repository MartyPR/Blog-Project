const express = require("express");
const userController = require("../../controllers/users/userCtrl");
const userRouter = express.Router();

userRouter.post("/api/v1/user/register", userController.register);
userRouter.post("/api/v1/user/login", userController.login);
userRouter.post("/api/v1/user/logout", userController.logout);
userRouter.get("/api/v1/user/profile", userController.profile);

module.exports = userRouter;
