const express = require("express");
const commentController = require("../../controllers/comments/commentsCtrl");

const commentRouter = express.Router();

commentRouter.post("/", commentController.create);
commentRouter.get("/:id", commentController.commentDetail);
commentRouter.delete("/:id", commentController.delete);
commentRouter.put("/:id", commentController.update);


module.exports = commentRouter;