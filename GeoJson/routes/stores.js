const express = require("express");
const router = express.Router();

const stores = require("../controllers/stores");

router.route("/").get(stores.getStores).post(stores.addStores);
// router.route("/closest").post(stores.closest);

module.exports = router;
