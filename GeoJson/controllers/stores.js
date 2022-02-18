const Store = require("../models/Store");

module.exports.getStores = async (req, res) => {
  try {
    const stores = await Store.find();
    return res.json({
      success: true,
      count: stores.length,
      data: stores,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

module.exports.addStores = async (req, res) => {
  try {
    const store = await Store.create(req.body);
    return res.json({
      success: true,
      data: store,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({
        error: "Another store with the ID already exists",
      });
    }
    res.status(500).json({ error: err });
  }
};

// module.exports.closest = async (req, res) => {
//   const lat = req.body.lat;
//   const long = req.body.long;
//   const dist = req.body.dist;
//   const stores = await Store.find({
//     location: {
//       $near: {
//         $geometry: {
//           type: "Point",
//           coordinates: [long, lat],
//         },
//         $maxDistance: dist,
//       },
//     },
//   });

//   res.json({ data: stores });
// };
