const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Category = require("../models/category");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
router.get("/", auth, async (req, res) => {
  const productList = await Product.find().populate("category");
  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});
router.post("/", auth, async (req, res) => {
  if (!req.user.isAdmin) {
    return res
      .status(200)
      .json({ error: "You cannot make changes as you are not an admin" });
  }
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(200).json({ error: "No category found" });
  }

  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    rating: req.body.rating,
    category: req.body.category,
    isFeatured: req.body.isFeatured,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });
  product
    .save()
    .then((created) => {
      res.status(201).json(created);
    })
    .catch((err) => {
      res.status(500).json({ error: err, success: false });
    });
});
router.delete("/:id", auth, async (req, res) => {
  if (!req.user.isAdmin) {
    return res
      .status(200)
      .json({ error: "You cannot make changes as you are not an admin" });
  }
  Product.findByIdAndRemove(req.params.id)
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
// router.get("/get/count", async (req, res) => {

//   if (!proCount) {
//     return res.status(200).json({ error: "error" });
//   }
//   return res.status(201).send({ count: proCount });
// });
router.get("/:id", auth, async (req, res) => {
  // if (!mongoose.isValidObjectId(req.params.id)) {
  //   res.status(200).send("Invalid id");

  const productList = await Product.find(req.params.id).populate("category");
  if (!productList) {
    res.status(500).json({ success: false, message: "Product not found" });
  }
  res.send(productList);
});
router.get("/get/featured", async (req, res) => {
  console.log("hi");
  try {
    const productList = await Product.find({ isFeatured: true });
    console.log(productList);
    res.send(productList);
  } catch (e) {
    console.log(e);
  }
});
router.get("/get/category/:cat", auth, async (req, res) => {
  try {
    const catig = await Product.find({ category: req.params.cat });
    res.send(catig);
  } catch (e) {
    console.log(e);
  }
});
module.exports = router;
