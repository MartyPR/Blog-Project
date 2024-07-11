const asyncHandler = require("express-async-handler");

const commentController = {
  create: asyncHandler(async (req, res) => {}),
  commentDetail: asyncHandler(async (req, res) => {}),
  delete: asyncHandler(async (req, res) => {}),
  update: asyncHandler(async (req, res) => {}),
};

module.exports = commentController;
