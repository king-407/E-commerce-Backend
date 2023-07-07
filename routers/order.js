const Order = require("../models/order");
const express = require("express");
const auth = require("../middleware/auth");
const OrderItem = require("../models/orderItems");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const orderList = await Order.find().populate("user", "name");
    res.status(200).send(orderList);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});
router.post("/", auth, async (req, res) => {
  const orderItemsId = Promise.all(
    req.body.orderItems.map(async (order) => {
      let newItem = new OrderItem({
        quantity: order.quantity,
        product: order.product,
      });
      newItem = await newItem.save();
      return newItem._id;
    })
  );
  const finalaId = await orderItemsId;
  let order = new Order({
    orderItems: finalaId,
    address: req.body.address,

    user: req.user._id,
  });
  order = await order.save();

  res.send(order);
});
module.exports = router;
