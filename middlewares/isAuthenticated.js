const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  // console.log(req.headers);
  const headerObj = req.headers;
  const token = headerObj?.authorization?.split(" ")[1];

  const verifyToken = jwt.verify(token, "ExpensesKey", (err, decoded) => {
    if (err) {
      return false;
    } else {
      return decoded;
    }
  });

  if (verifyToken) {
    req.user = verifyToken.id;
    next();
  } else {
    const err = new Error("Token expired, login again");
    next(err);
  }
};

module.exports = isAuthenticated;
