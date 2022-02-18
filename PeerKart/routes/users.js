const express = require("express");
const router = express.Router();

const userController = require("../controllers/users");

router.route("/").get(userController.getUsers).post(userController.addUsers);
router.route("/:id").get(userController.getUser).put(userController.updateUser);
router.route("/:id/orders/created").get(userController.createdOrders);
router.route("/:id/orders/accepted").get(userController.acceptedOrders);

module.exports = router;
