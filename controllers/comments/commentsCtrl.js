const asyncHandler = require("express-async-handler");
const Post = require("../../models/post/post");
const Comment = require("../../models/comment/comment");
const User = require("../../models/user/user");
const appErr = require("../../utils/appErr");

const commentController = {
  create: asyncHandler(async (req, res, next) => {
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
    } catch (error) {
      next(appErr(error.message));
    }
  }),
  commentDetail: asyncHandler(async (req, res, next) => {
    try {
      const comment = await Comment.findById(req.params.id);
      res.json({
        status: "success",
        comment,
      });
    } catch (error) {
      next(appErr(error.message));
    }
  }),
  delete: asyncHandler(async (req, res, next) => {
    try {
      const comment = await Comment.findById(req.params.id);
      if (comment.user.toString() !== req.user) {
        return next(appErr("You are not allowes to delete this comment", 403));
      }
      const deletedComment = await Comment.findByIdAndDelete(req.params.id);
      res.json({
        status: "success",
        message: "Comment has been deleted suceess",
        deletedComment,
      });
    } catch (error) {
      next(appErr(error.message));
    }
  }),
  update: asyncHandler(async (req, res, next) => {
    const { message } = req.body;
    try {
      const comment = await Comment.findById(req.params.id);
      if (comment.user.toString() !== req.user) {
        return next(appErr("You are not allowes to update this comment", 403));
      }

      const updatedComment = await Comment.findByIdAndUpdate(req.params.id, {
        message,
      });
      res.json({
        status: "success",
        message:"Comment has been updated",
        updatedComment,
      });
    } catch (error) {
      next(appErr(error.message));
    }
  }),
};

module.exports = commentController;
