const express = require("express");
const mongoose = require("mongoose");
const { short } = require("node-url-shortener");
require("dotenv/config");
const shorturl = require("node-url-shortener");
const ShortUrl = require("./models/shorturls");
const open = require("open");

const app = express();

mongoose.connect(process.env.DB_L, () => {
  console.log("Connected To DB");
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const urls = await ShortUrl.find();
  res.render("index", { shortUrls: urls });
});

app.post("/shortUrls", async (req, res) => {
  let short = new ShortUrl({
    full: req.body.fullUrl,
    short: req.baseUrl + Math.random().toString(16).slice(2),
  });
  await short.save();
  res.redirect("/");
  //   shorturl.short(req.body.fullUrl, async function (err, url) {
  //     short = new ShortUrl({
  //       full: req.body.fullUrl,
  //       short: url,
  //     });
  //     await short.save();
  //     res.redirect("/");
  //   });
});

app.get("/:shortUrl", async (req, res) => {
  const shortlink = req.params.shortUrl;
  const shortUrl = await ShortUrl.findOne({ short: shortlink });
  if (shortUrl == null) return res.status(404).send("Not Found");

  await ShortUrl.findOneAndUpdate(
    { short: shortlink },
    { $inc: { clicks: 1 } }
  );
  app.redirect();
});

port = process.env.PORT | 3000;
app.listen(process.env.PORT | 3000, () =>
  console.log(`http://localhost:${port}`)
);
