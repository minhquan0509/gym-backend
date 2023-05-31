const { User } = require("../models/index");

exports.getAllUsers = async (req, res, next) => {
  const users = await User.findAll();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
};
