const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "you must be logged in" });
  }
  try {
    console.log(authorization);
    const { userId } = jwt.verify(authorization, "hihihi");

    req.user = await User.findOne({ _id: userId });
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).json({ error: "you must be logged in" });
  }
};
module.exports = auth;
