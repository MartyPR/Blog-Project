const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/user/user");

const isAuthenticated = asyncHandler(async (req, res, next) => {
  if (req.cookies.token) {
    try {
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      return next();
    } catch (error) {
      res.clearCookie("token");
      return res.redirect("/api/v1/user/login");
    }
  } else {
    return res.redirect("/api/v1/user/login");
  }
});

module.exports = isAuthenticated;