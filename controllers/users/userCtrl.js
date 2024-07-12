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
    if (!fullname || !email || !password) {
      throw new Error("please all fields  are  required");
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      //   throw new Error("User already exist");
      next(appErr("User already exist"));
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

    res.json({
      status: true,
      message: "register was successfull",
      userCreated,
    });
  }),

  //! ===============login function===============
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Please complete all fields");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("invalid credentials");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("invalid login credentials");
    }
    //create a token with jsonwebtoken
    const token = jwt.sign({ id: user._id }, "ExpensesKey", {
      expiresIn: "30d",
    });
    //send the cookiesinto cookies
    res.cookie({
      httpOnly: true,
      secure: process.env.NODE_ENV === "Production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    //send a response
    res.json({
      message: "Login Success",
      token,
      id: user._id,
      email: user.email,
      username: user.username,
    });
  }),
  //! ===============logout function===============
  logout: asyncHandler(async (req, res) => {
    res.cookie("token", "", { maxAge: 1 });
    res.status(200).json({ message: "Logged out successfully" });
  }),

  //! ===============profile function===============

  profile: asyncHandler(async (req, res) => {
    const user = await User.findById(req?.user)
      .select("-password")
      .populate("posts")
      .populate("comments")

    if (user) {
      res.status(500).json({
        status: "sucess",
        user,
      });
    } else {
      res.status(400);
      throw new Error("User not found");
    }
  }),

  updatePassword: asyncHandler(async (req, res, next) => {
    const { newPassword } = req.body;
    try {
      const user = await User.findById(req?.user);
      console.log(user);
      if (!user) {
        res.json(next(appErr("User not found")));
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
      await user.save();
      res.json({
        message: "Password has been changed succesfully ",
        user: { fullname: user.fullname, email: user.email },
      });
    } catch (error) {
      res.json(next(appErr(error.message)));
    }
  }),

  userDetail: async (req, res) => {
    try {
      console.log(req?.params);
      const userId = req?.params.id;
      //finde
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      res.json({
        status: "success",
        data: user,
      });
    } catch (error) {
      res.json(error);
    }
  },

  updateUser: asyncHandler(async (req, res, next) => {
    const { fullname, email } = req?.body;
    console.log(email);
    try {
      if (email) {
        const emailTaken = await User.findOne({ email });
        if (emailTaken) {
          return next(appErr("Email is taken", 400));
        }
      }
      //update the user
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          fullname,
          email,
        },
        {
          new: true,
        }
      );
      res.json({
        status: "success",
        data: "User update",
        user,
      });
    } catch (error) {
      res.json(next(appErr(error.message)));
    }
  }),

  uploadProfilePhoto: asyncHandler(async (req, res, next) => {
    // console.log(req.file);
    try {
      const result = await uploadToCloudinary(req.file.path);

      const userFound = await User.findById(req?.user);
      userFound.profileImage = result.secure_url;
      await userFound.save();

      res.json({ success: true, url: result.secure_url });
    } catch (error) {
      res.json(next(appErr(error.message)));
    }
  }),

  uploadCoverImg: asyncHandler(async (req, res, next) => {
    try {
      const result = await uploadToCloudinary(req.file.path);

      const userFound = await User.findById(req?.user);
      userFound.coverImage = result.secure_url;
      await userFound.save();

      res.json({ success: true, url: result.secure_url });
    } catch (error) {
      res.json(next(appErr(error.message)));
    }
  }),
};
module.exports = userController;
