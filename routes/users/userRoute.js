const express = require("express");
const userController = require("../../controllers/users/userCtrl");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const userRouter = express.Router();

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.post("/logout", userController.logout);
userRouter.get("/profile", isAuthenticated, userController.profile);
userRouter.get("/:id", userController.userDetail);
userRouter.put("/update/:id", isAuthenticated, userController.updateUser);
userRouter.put("/update_password", isAuthenticated, userController.updatePassword);

module.exports = userRouter;
