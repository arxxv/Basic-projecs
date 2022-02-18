const User = require("../models/user");
const Order = require("../models/order");
require("dotenv").config();

const bcrypt = require("bcrypt");
const saltRounds = parseInt(process.env.SALTROUNDS);

module.exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.json({ data: users });
};

module.exports.getUser = async (req, res) => {
  // Check userid
  const checkObject = new RegExp("^[0-9a-fA-F]{24}$");
  if (!checkObject.test(req.params.id))
    return res.status(404).json({ error: "User not found" });

  // Check if user exists
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ data: user });
};

module.exports.addUsers = async (req, res) => {
  //TODO: Auth

  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  // Email check
  let user = await User.findOne({ email: email });
  if (user)
    return res
      .status(409)
      .json({ error: "Email already in use. Try another instead?" });

  // Username check
  user = await User.findOne({ username: username });
  if (user)
    return res
      .status(409)
      .json({ error: "Username already in use. Try another instead?" });

  // Regex Validators
  const checkUsername = new RegExp("[a-zA-Z0-9 ]{5,18}");
  const checkEmail = new RegExp(
    "([0-9a-zA-Z]([-.w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-w]*[0-9a-zA-Z].)+[a-zA-Z]{2,9})"
  );
  const checkPassword = new RegExp(
    /(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,}/
  );

  // Validate
  if (!checkUsername.test(username))
    return res.status(403).json({
      error:
        "Invalid username\nUsername must be alpha-numeric of 5 to 20 characters",
    });
  if (!checkEmail.test(email))
    return res.status(403).json({ error: "Invalid email address" });
  if (!checkPassword.test(password))
    return res.status(403).json({
      error:
        "Invalid password\nPassword must be minimum eight characters long with at least one letter, one number and one special character(@, $, !, %, *, #, ?, &) ",
    });

  // Hashing password
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create user
  user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });
  const saved = await user.save();
  res.status(201).json({ data: saved });
};

module.exports.createdOrders = async (req, res) => {
  const id = req.params.id;
  // Check userid
  const checkObject = new RegExp("^[0-9a-fA-F]{24}$");
  if (!checkObject.test(id))
    return res.status(404).json({ error: "User not found" });

  // Check if user exists
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ error: "User not found" });

  const orders = await Order.find({ generatedBy: id }).populate("acceptedBy", {
    username: 1,
    contact: 1,
  });

  // Return Orders
  res.json({ data: orders });
};

module.exports.acceptedOrders = async (req, res) => {
  const id = req.params.id;
  // Check userid
  const checkObject = new RegExp("^[0-9a-fA-F]{24}$");
  if (!checkObject.test(id))
    return res.status(404).json({ error: "User not found" });

  // Check if user exists
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ error: "User not found" });

  // Return Orders
  const orders = await Order.find({ acceptedBy: id }).populate("generatedBy", {
    username: 1,
  });
  // console.log(orders);
  console.log(id);

  res.json({ data: orders });
};

module.exports.updateUser = async (req, res) => {
  const userid = req.params.id;
  const body = req.body;
  // Check userid
  const checkObject = new RegExp("^[0-9a-fA-F]{24}$");
  if (!checkObject.test(userid))
    return res.status(404).json({ error: "User not found" });

  // Check if user exists
  const user = await User.findById(userid);
  if (!user) return res.status(404).json({ error: "User not found" });

  if ("contact" in body) user.contact.push(body.contact);
  if ("address" in body) {
    if (
      typeof body.address !== "object" ||
      !("address" in body.address) ||
      body.address.address.trim().length === 0
    )
      return res.status(403).json({ error: "Invalid address" });
    user.address.push(body.address);
  }
  if ("paymentMethod" in body) {
    if (
      !("paymentType" in body.paymentMethod) ||
      !("paymentId" in body.paymentMethod) ||
      body.paymentMethod.paymentId.trim().length === 0
    )
      return res.status(403).json({ error: "Invalid payment method" });
    user.paymentMethod.push(body.paymentMethod);
  }

  try {
    await user.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server error" });
  }
  res.json({ data: user });
};
