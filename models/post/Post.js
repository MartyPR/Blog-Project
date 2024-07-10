const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["reactJs", "html", "css", "nodeJs", "javascript", "other"],
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const postModel = mongoose.model("Post", postSchema);

module.exports = postModel;
