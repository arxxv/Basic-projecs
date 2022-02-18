const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

require("dotenv").config();

const userController = require("./routes/users");
const orderController = require("./routes/orders");

const app = express();

app.use(bodyParser.json());
app.use("/users", userController);
app.use("/orders", orderController);

const PORT = 3000 || process.env.PORT;

mongoose
  .connect(process.env.DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Started on http://localhost:${PORT}`);
    });
  });
