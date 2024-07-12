const express = require("express");
const postController = require("../../controllers/posts/postCtrl");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const multer = require("multer");

const storage = multer.diskStorage({});

//instance of multer
const upload = multer({
  storage,
});

const postRouter = express.Router();

postRouter.post(
  "/",
  isAuthenticated,
  upload.single("file"),
  postController.create
);

postRouter.get("/", postController.listPosts);
postRouter.get("/user_post/", isAuthenticated, postController.listPostsUser);
postRouter.get("/:id", postController.postDetails);
postRouter.delete("/:id", isAuthenticated, postController.delete);

postRouter.put(
  "/:id",
  isAuthenticated,
  upload.single("file"),
  postController.update
);

module.exports = postRouter;
