const asyncHandler = require("express-async-handler");
const Post = require("../../models/post/post");
const Comment = require("../../models/comment/comment");
const User = require("../../models/user/user");

const commentController = {
  create: asyncHandler(async (req, res) => {
    const { message } = req.body;
    try {
      //find the post
      const post = await Post.findById(req.params.id);
      //create the comment
      const comment = await Comment.create({
        user: req.user,
        message,
      });
      post.comments.push(comment._id);
      //find the user
      const user = await User.findById(req.user);
      user.comments.push(comment._id);
      //disable validation
      //save
      await post.save({ validateBeforeSave: false });
      await user.save({ validateBeforeSave: false });

      res.json({
        message: "success",
        data: comment,
      });
    } catch (error) {}
  }),
  commentDetail: asyncHandler(async (req, res) => {}),
  delete: asyncHandler(async (req, res) => {}),
  update: asyncHandler(async (req, res) => {}),
};

module.exports = commentController;
