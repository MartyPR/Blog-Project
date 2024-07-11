const asyncHandler = require("express-async-handler");

const postController = {
  create: asyncHandler(async (req, res) => {
    try {
      res.json({
        message:"new post"
      })
    } catch (error) {
      
    }
  }),

  listPosts: asyncHandler(async (req, res) => {}),

  postDetails: asyncHandler(async (req, res) => {}),

  delete: asyncHandler(async (req, res) => {}),

  update: asyncHandler(async (req, res) => {}),
};
module.exports = postController;