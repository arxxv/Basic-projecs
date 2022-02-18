const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orders");

router.route("/").get(orderController.getOrders).post(orderController.addOrder);
router.route("/:id").get(orderController.getOrder);
//   .delete(orderController.deleteOrder);
router.route("/:id/accept").put(orderController.acceptOrder);
router.route("/:id/reject").put(orderController.rejectOrder);

module.exports = router;
