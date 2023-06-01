const { User, sequelize, QueryTypes } = require("../models/index");

exports.getAllUsers = async (req, res, next) => {
  const users = await User.findAll({ attributes: { exclude: ["password"] } });
  // const users = await sequelize.query("SELECT * FROM `users`", {
  //   type: QueryTypes.SELECT,
  // });
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
};
