const asyncHandler = require("express-async-handler");

const postController = {
  create: asyncHandler(async (req, res) => {}),

  listPosts: asyncHandler(async (req, res) => {}),

  postDetails: asyncHandler(async (req, res) => {}),

  delete: asyncHandler(async (req, res) => {}),

  update: asyncHandler(async (req, res) => {}),
};
module.exports = postController;