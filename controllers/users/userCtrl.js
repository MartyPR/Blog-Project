const asyncHandler = require("express-async-handler");
const User = require("../../models/user/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const appErr = require("../../utils/appErr");
const { uploadToCloudinary } = require("../../config/cloudinary");

const userController = {
  //!=========== Register function===============
  register: asyncHandler(async (req, res, next) => {
    const { fullname, email, password } = req.body;
    console.log(req.body);
    if (!fullname || !email || !password) {
      // throw new Error("please all fields  are  required");

      return res.render("users/register", {
        error: "All fields are required",
      });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      //   throw new Error("User already exist");
      return res.render("users/register", {
        error: "User Already exist",
      });
    }
    //byscripjs to password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userCreated = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });
    console.log(userCreated);

    // res.json({
    //   status: true,
    //   message: "register was successfull",
    //   userCreated,
    // });

    //redirect
    res.redirect("/api/v1/user/login");
  }),

  //! ===============login function===============
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.render("users/login", {
        error: "Please complete all fields",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.render("users/login", {
        error: "Invalid credential",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("users/login", {
        error: "Invalid Credentials",
      });
    }
    //create a token with jsonwebtoken
    const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET, {
      expiresIn: "3d", //token expires in 3 days
    });
    console.log(token);
    //set the token into cookie (http only)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, //1 day
    });

    //send a response
    console.log({
      message: "Login Success",
      token,
      id: user._id,
      email: user.email,
      username: user.username,
    });

    res.redirect("/api/v1/user/profile");
  }),
  //! ===============logout function===============
  logout: asyncHandler(async (req, res) => {
    res.cookie("token", "", { maxAge: 1 });
    // res.status(200).json({ message: "Logged out successfully" });
    res.redirect("/api/v1/user/login");
  }),

  //! ===============profile function===============

  profile: asyncHandler(async (req, res) => {
    const user = await User.findById(req?.user)
      .select("-password")
      .populate("posts")
      .populate("comments");

    if (user) {
      res.render("users/profile", {
        user,
      });
      // res.status(500).json({
      //   status: "sucess",
      //   user,
      // });
    } else {
      res.status(400);
      throw new Error("User not found");
    }
  }),

  updatePassword: asyncHandler(async (req, res, next) => {
    const { newPassword, confirmPassword } = req.body;
    try {
      if (newPassword !== confirmPassword || !newPassword || !confirmPassword) {
        return res.render("users/updatePassword", {
          error: "Please complete all the fields",
          user: req?.user,
        });
      }

      const user = await User.findById(req?.user);
      // console.log(user);
      if (!user) {
        res.json(next(appErr("User not found")));
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
      await user.save();
      // res.json({
      //   message: "Password has been changed succesfully ",
      //   user: { fullname: user.fullname, email: user.email },
      // });
      console.log({ message: "Password has been changed succesfully ",});
      res.redirect("/api/v1/user/profile");

    } catch (error) {
      res.json(next(appErr(error.message)));
    }
  }),

  userDetail: async (req, res) => {
    try {
      // console.log(req?.params);
      const userId = req?.params.id;
      //finde
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      // res.json({
      //   status: "success",
      //   data: user,
      // });
      res.render("users/updateUser", {
        user,
        error:""
      });
    } catch (error) {
      res.json(error);
    }
  },

  updateUser: asyncHandler(async (req, res, next) => {
    const { fullname, email } = req?.body;
    const detailsUser = await User.findById(req?.user);
    try {
      if (!fullname || !email ) {
        return res.render("users/updateUser", {
          error: "Please complete all the fields",
          user: req?.user,
        });
      }
      if (email !== detailsUser.email) {
        const emailTaken = await User.findOne({ email });
        console.log(emailTaken);
        if (emailTaken) {
          
          return res.render("users/updateUser", {
            error: "The email is taken",
            user: req?.user,
          });
        }
      } 
      //update the user
      await User.findByIdAndUpdate(
        req?.user,
        {
          fullname: fullname,
          email: email,
        },
        {
          new: true,
        }
      );

      // res.json({
      //   status: "success",
      //   data: "User update",
      //   user,
      // });
      console.log({
        status: "success",
        data: "User update",
      });

      res.redirect("/api/v1/user/profile");
    } catch (error) {
      console.log(error.message);
      return res.render("users/updateUser", {
        error: error.message,
      });
    }
  }),

  uploadProfilePhoto: asyncHandler(async (req, res, next) => {
    // console.log(req.file);
    try {
      if (!req.file) {
        return res.render("users/uploadProfilePhoto", {
          error: "file not found",
        });
      }
      console.log(req.file.path);
      const result = await uploadToCloudinary(req.file.path);

      const userFound = await User.findById(req?.user);
      if (!userFound) {
        return res.render("users/login", {
          error: "User no connected",
        });
      }
      userFound.profileImage = result.secure_url;
      await userFound.save();

      // res.json({ success: true, url: result.secure_url });
      res.redirect("/api/v1/user/profile");
    } catch (error) {
      res.json(next(appErr(error.message)));
    }
  }),

  uploadCoverImg: asyncHandler(async (req, res, next) => {
    try {
      if (!req.file) {
        return res.render("users/uploadCoverPhoto", {
          error: "file not found",
        });
      }
      const result = await uploadToCloudinary(req.file.path);

      const userFound = await User.findById(req?.user);
      if (!userFound) {
        return res.render("users/login", {
          error: "User no connected",
        });
      }
      userFound.coverImage = result.secure_url;
      await userFound.save();

      // res.json({ success: true, url: result.secure_url });
      res.redirect("/api/v1/user/profile");
    } catch (error) {
      res.json(next(appErr(error.message)));
    }
  }),
};
module.exports = userController;
