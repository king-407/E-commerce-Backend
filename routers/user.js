const User = require("../models/user");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

module.exports = router;

router.post("/", async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  user
    .save()
    .then((created) => {
      res.status(201).json(created);
    })
    .catch((err) => {
      res.status(500).json({ error: err, success: false });
    });
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user) {
      if (password == user.password) {
        console.log(user);
        const token = jwt.sign({ userId: user._id }, "hihihi");
        res.status(201).json({ token });
      } else {
        return res.status(200).json({ error: "Wrong credentials" });
      }
    } else {
      return res.status(200).json({ error: "Wrong credentials" });
    }
  } catch (e) {
    console.log(e);
  }
});
