const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./utils/db");
const storeRoute = require("./routes/stores");

connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/stores", storeRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
