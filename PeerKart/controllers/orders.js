const Order = require("../models/order");
const User = require("../models/user");

module.exports.getOrders = async (req, res) => {
  const orders = await Order.find({ state: "active" })
    .populate("generatedBy", { username: 1 })
    .populate("acceptedBy", { username: 1, contact: 1 })
    .populate("address")
    .populate("paymentMethod");
  res.json({ data: orders });
};

module.exports.getOrder = async (req, res) => {
  // validate orderid
  const checkObject = new RegExp("^[0-9a-fA-F]{24}$");
  if (!checkObject.test(req.params.id))
    return res.status(404).json({ error: "Order not found" });

  // get order
  let order;
  try {
    order = await Order.findById(req.params.id).populate("acceptedBy", {
      username: 1,
      contact: 1,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server error" });
  }

  // order doesn't exists
  if (!order) return res.status(404).json({ error: "Order not found" });

  res.json({ data: order });
};

module.exports.addOrder = async (req, res) => {
  const name = req.body.name;
  const items = req.body.items;
  const category = req.body.category.toLowerCase();
  const generatedBy = req.body.generatedBy;
  const points = items.length * 5; //FIXME: points
  const address = req.body.address;
  const paymentMethod = req.body.paymentMethod;
  const contact = req.body.contact;

  const categories = ["grocery", "electronics", "health"];

  // Validate

  if (name.trim().length === 0)
    // name
    return res.status(403).json({ error: "Invalid order name" });

  if (items.length === 0)
    //items
    return res.status(403).json({ error: "Item list cannot be empty" });
  if (!categories.includes(category))
    //categories
    return res.status(403).json({ error: "Invalid category" });
  try {
    //user
    const user = await User.findById(generatedBy);

    if (!user) return res.status(404).json({ error: "User not found" });
    if (
      user.address.length === 0 ||
      user.paymentMethod.length === 0 ||
      user.contact.length === 0
    ) {
      return res.status(403).json({ error: "Complete user details first" });
    }

    if (
      !paymentMethod ||
      !("paymentType" in paymentMethod) ||
      !("paymentId" in paymentMethod) ||
      paymentMethod.paymentId.trim().length === 0
    )
      return res.status(403).json({ error: "Invalid payment method" });
    if (!address?.address || address.address.trim().length === 0)
      return res.status(403).json({ error: "Invalid address" });
    if (!contact || contact.trim().length === 0)
      return res.status(403).json({ error: "Invalid contact details" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server error" });
  }

  // Create order
  let saved;
  try {
    const newOrder = new Order({
      name,
      category,
      items,
      generatedBy,
      points,
      address,
      paymentMethod,
      contact,
    });
    saved = await newOrder.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server error" });
  }

  // Return Id
  res.status(201).json({ data: saved });
};

module.exports.acceptOrder = async (req, res) => {
  const orderid = req.params.id;
  const userid = req.body.id;
  let order, user;

  // validate orderid
  const checkObject = new RegExp("^[0-9a-fA-F]{24}$");
  if (!checkObject.test(orderid))
    return res.status(404).json({ error: "Order not found" });

  // Check order
  try {
    order = await Order.findById(orderid);
    if (!order) return res.status(404).json({ error: "Order not found" });
    if (order.state !== "active")
      return res.status(403).json({ error: "The order cannot be accepted." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server error" });
  }

  // Check user
  try {
    user = await User.findById(userid);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (
      user.address.length === 0 ||
      user.paymentMethod.length === 0 ||
      user.contact.length === 0
    )
      return res.status(403).json({ error: "Complete user details first" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server error" });
  }

  // update
  order.acceptedBy = userid;
  order.state = "accepted";
  try {
    await order.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server error" });
  }

  res.json({ data: order });
};

module.exports.rejectOrder = async (req, res) => {
  const orderid = req.params.id;
  const userid = req.body.id;
  let order, user;

  // validate orderid
  const checkObject = new RegExp("^[0-9a-fA-F]{24}$");
  if (!checkObject.test(orderid))
    return res.status(404).json({ error: "Order not found" });

  // Check order
  try {
    order = await Order.findById(orderid);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server error" });
  }
  if (!order) return res.status(404).json({ error: "Order not found" });

  // Check user
  try {
    user = await User.findById(userid);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (order.state !== "accepted" || String(order.acceptedBy) !== userid)
      return res.status(403).json({ error: "You cannot reject this order" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server error" });
  }

  // update
  order.acceptedBy = null;
  order.state = "active";
  try {
    await order.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server error" });
  }

  res.json({ data: order });
};
