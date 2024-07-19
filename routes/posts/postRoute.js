const express = require("express");
const postController = require("../../controllers/posts/postCtrl");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const multer = require("multer");
const Post = require("../../models/post/post");

const storage = multer.diskStorage({});

//instance of multer
const upload = multer({
  storage,
});

const postRouter = express.Router();

// form
postRouter.get("/form-post", isAuthenticated, (req, res) => {
  res.render("posts/addPost", {
    user: req.user,
    error: "",
  });
});

postRouter.get("/form-update-post/:id", isAuthenticated, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.render("posts/updatePost", { post, error: "", user: req.user });
  } catch (error) {
    res.render("posts/updatePost", { error, post: "", user: req.user });
  }
});
postRouter.post(
  "/",
  isAuthenticated,
  upload.single("file"),
  postController.create
);
postRouter.get("/", postController.listPosts);
postRouter.get("/user_post/", isAuthenticated, postController.listPostsUser);
postRouter.get("/:id", isAuthenticated, postController.postDetails);
postRouter.delete("/:id", isAuthenticated, postController.delete);

postRouter.put(
  "/:id",
  isAuthenticated,
  upload.single("file"),
  postController.update
);

module.exports = postRouter;
