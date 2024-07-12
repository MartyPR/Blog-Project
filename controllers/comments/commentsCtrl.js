const asyncHandler = require("express-async-handler");
const Post = require("../../models/post/post");

const commentController = {
  create: asyncHandler(async (req, res) => {
    const{message}=req.body;
    try {
      //find the post
      const post= await Post.findById(req.user);
      //create the comment
      res.json({
        message:"new comment"
      })
    } catch (error) {
      
    }
  }),
  commentDetail: asyncHandler(async (req, res) => {}),
  delete: asyncHandler(async (req, res) => {}),
  update: asyncHandler(async (req, res) => {}),
};

module.exports = commentController;
