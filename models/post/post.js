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
      enum: ["reactJs", "html", "css", "nodeJs", "javascript", "other","AI"],
    },
    image: {
      type: String,
      default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxW47z7BgHxNKYEE51jG_e7317mlWvs_IOhvzF1XHfFSkKztaY9Jx9gLTcLlQAjI6KOLw&usqp=CAU"
      // required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
        }
    ]
  },
  { timestamps: true }
);
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
