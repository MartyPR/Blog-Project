const asyncHandler = require("express-async-handler");
const Post = require("../../models/post/post");
const User = require("../../models/user/user");
const appErr = require("../../utils/appErr");
const { uploadToCloudinary } = require("../../config/cloudinary");
const Comment = require("../../models/comment/comment");

const postController = {
  create: asyncHandler(async (req, res, next) => {
    const { title, description, category, image } = req.body;

    try {
      if (!title || !description || !category) {
        // return next(appErr("All fields are required"));
        console.log("asd");
        return res.render("posts/addPost", {
          error: "All fields are required",
        });
      }
      //find the user
      const user = await User.findById(req?.user);
      // console.log(user);
      //add the image,
   
      const file = await uploadToCloudinary(req?.file?.path);
   
      //create a post
      const post = await Post.create({
        title,
        description,
        category,
        image: file.secure_url,
        user: user._id,
      });
      //push posts in user
      user.posts.push(post._id);
      await user.save();

      res.redirect("/api/v1/user/profile");
    } catch (error) {
      return res.render("posts/addPost", {
        error: error.message,
      });
    }
  }),

  listPosts: asyncHandler(async (req, res) => {
    try {
      const posts = await Post.find().populate("comments");
      res.json({
        status: "success",
        data: posts,
      });
    } catch (error) {
      next(appErr(error.message));
    }
  }),
  listPostsUser: asyncHandler(async (req, res) => {
    try {
      const user = req?.user;

      const posts = await Post.find({ user }).populate("comments");
      res.json({
        status: "success",
        data: posts,
      });
    } catch (error) {
      next(appErr(error.message));
    }
  }),

  postDetails: asyncHandler(async (req, res, next) => {
    try {
      const id = req.params.id;
      const post = await Post.findById(id)
        .populate("comments")
        .populate("user");
      const comments = await Promise.all(
        post.comments.map((res) => Comment.findById(res.id).populate("user"))
      );
      // console.log(comments);
      // res.json({
      //   status: "success",
      //   post,
      // });
      res.render("posts/postDetails", {
        user: req.user,
        post,
        comments,
        error: "",
      });
    } catch (error) {
      res.json(next(appErr(error.message)));
    }
  }),

  delete: asyncHandler(async (req, res, next) => {
    try {
      const post = await Post.findById(req.params.id);
      console.log(post);
      console.log(req.user.id);
      //check if the post belong to the user

      if (post.user.toString() !== req.user.id) {
        return next(appErr("You are not allowes to delete this post", 403));
      }
      const deteledPost = await Post.findByIdAndDelete(req.params.id);
      res.redirect("/api/v1/user/profile");
    } catch (error) {
      res.json(next(appErr(error.message)));

      //! crear una alerta en caso de no tener acceso o otro problema
    }
  }),

  update: asyncHandler(async (req, res, next) => {
    const { title, description, category,image } = req.body;
    console.log(req.body);
    try {
      if (!title || !description || !category) {
       
        return res.render("posts/updatePost", {
          error: "All fields are required",
        });
      }


      const post = await Post.findById(req.params.id);
      //check if the post belog to the user
      if (post.user.toString() !== req.user.id) {
        return res.render("posts/updatePost", {
          error: "you can't change this Post "  ,
        });
      }
      //cloudinary new file

      const file = await uploadToCloudinary(req?.file?.path);

      //check if user is updating image
      if (req.file) {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            title,
            description,
            category,
            image: file.secure_url,
          },
          {
            new: true,
          }
        );
      }else{
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            title,
            description,
            category,
          },
          {
            new: true,
          }
        );
      }


      // res.json({
      //   status:"success",
      //   data:"Post updated",
      //   updatedPost
      // })
      res.redirect("/api/v1/user/profile");
    } catch (error) {
      return res.render("posts/updatePost", {
        error: error.message,
      });
    }
  }),
};
module.exports = postController;

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2OTA3ZmQ1NmFiN2FkOGRmZjEwZjJkNSIsImlhdCI6MTcyMDgyMjc0NywiZXhwIjoxNzIzNDE0NzQ3fQ.NNR2bz0ChljwWeN2y_OCLDQm8TK5JPHysFhA1XleXvQ
