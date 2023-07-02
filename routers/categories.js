const Category = require("../models/category");
const express = require("express");
const router = express.Router();
router.get("/", async (req, res) => {
  const category = await Category.find();
  if (!category) {
    res.status(500).json({ success: false });
  }
  res.send(category);
});
router.post("/", async (req, res) => {
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });
  category = await category.save();
  if (!category) return res.status(404).send("category cannot be created");
  res.send(category);
});
router.delete("/:id", async (req, res) => {
  Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        return res.status(200).json({ success: true, message: "deleted" });
      } else {
        return res
          .status(200)
          .json({ success: false, message: "failed to delete" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});
router.get("/:id", async (req, res) => {
  Category.findById({ _id: req.params.id })
    .then((category) => {
      if (category) {
        return res.status(200).send(category);
      } else {
        return res
          .status(200)
          .json({ success: false, message: "failed to get" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});
module.exports = router;
