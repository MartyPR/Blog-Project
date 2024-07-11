const asyncHandler = require("express-async-handler");
const User = require("../../models/user/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userController = {
  //!=========== Register function===============
  register: asyncHandler(async (req, res) => {
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password) {
      throw new Error("please all fields  are  required");
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error("User already exist");
    }
    //byscripjs to password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userCreated = User.create({
      fullname,
      email,
      password: hashedPassword,
    });
    console.log(userCreated);
    res.json({
      status: true,
      message: "register was successfull",
      user: {
        fullname,
        email,
      },
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
    const user = await User.findById(req?.user?.id).select("-password");
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


  updatePassword: asyncHandler(async (req, res) => {
    const { newPassword } = req.body;
    const user = await User.findById(req?.user);
    if (!user) {
      throw new Error("User not found");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    res.json({
      message: "Password changed succesfully ",
      user: { fullname: user.fullname, email: user.email },
    });
  }),

    //   uploadProfilePhoto: asyncHandler(async (req, res) => {}),
      //   uploadCoverImg: asyncHandler(async (req, res) => {}),
        //   updateUser: asyncHandler(async (req, res) => {}),
};
module.exports = userController;
