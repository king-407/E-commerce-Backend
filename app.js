const express = require("express");
require("dotenv/config");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const productsRouter = require("./routers/product");
const categoryRoutes = require("./routers/categories");
const userRoutes = require("./routers/user");
const api = process.env.URL;
const Product = require("./models/product");
const app = express();
app.use(bodyParser.json());
app.use(`${api}/products`, productsRouter);
app.use(`${api}/category`, categoryRoutes);
app.use(`${api}/user`, userRoutes);
mongoose
  .connect(
    "mongodb+srv://shivamtiwaritiwari0704:shivam@cluster0.gwmwwxm.mongodb.net/eshop?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("ready");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log("running");
});