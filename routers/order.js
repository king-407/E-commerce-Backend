const Order = require("../models/order");
const express = require("express");
const auth = require("../middleware/auth");
const OrderItem = require("../models/orderItems");

const router = express.Router();
router.put("/:id", auth, async (req, res) => {
  if (req.user.isAdmin !== true) {
    return res
      .status(201)
      .json({ error: "you are not allowed to change the details" });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      {
        new: true,
      }
    );
    res.status(200).send(order);
  } catch (e) {
    console.log(e);
  }
});
router.delete("/:id", (req, res) => {
  Order.findByIdAndRemove(req.params.id)
    .then(async (order) => {
      if (order) {
        await order.orderItems.map(async (orderItem) => {
          await OrderItem.findByIdAndRemove(orderItem);
        });
        return res
          .status(200)
          .json({ success: true, message: "the order has been deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "order not found" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});
router.get("/", async (req, res) => {
  try {
    const orderList = await Order.find()
      .populate("user", "name")
      .populate({ path: "orderItems", populate: "product" })
      .sort({ dateOrdered: -1 });
    res.status(200).send(orderList);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const orderList = await Order.findById(req.params.id).populate(
      "user",
      "name"
    );

    res.status(200).send(orderList);
  } catch (e) {
    console.log(e);
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
  let puura = 0;
  const prices = Promise.all(
    finalaId.map(async (order) => {
      const dup = await OrderItem.findById(order).populate("product", "price");
      console.log(dup);
      puura += dup.quantity * dup.product.price;
      return 0;
    })
  );
  const totalPrice = await prices;
  console.log(puura);

  let order = new Order({
    orderItems: finalaId,
    address: req.body.address,

    user: req.user._id,
    total: puura,
  });
  order = await order.save();

  res.send(order);
});
module.exports = router;
