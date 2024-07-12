const express = require("express");
const commentController = require("../../controllers/comments/commentsCtrl");
const isAuthenticated = require("../../middlewares/isAuthenticated");

const commentRouter = express.Router();

commentRouter.post("/:id",isAuthenticated, commentController.create);
commentRouter.get("/:id", commentController.commentDetail);
commentRouter.delete("/:id",isAuthenticated, commentController.delete);
commentRouter.put("/:id",isAuthenticated, commentController.update);


module.exports = commentRouter;