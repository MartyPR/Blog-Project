const express = require("express");
const postController = require("../../controllers/posts/postCtrl");

const postRouter = express.Router();

postRouter.post("/", postController.create);
postRouter.get("/", postController.listPosts);
postRouter.get("/:id", postController.postDetails);
postRouter.delete("/:id", postController.delete);
postRouter.put("/:id", postController.update);

module.exports = postRouter;
