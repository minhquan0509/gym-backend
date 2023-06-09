const { Sequelize, DataTypes, Model, QueryTypes } = require("sequelize");
const sequelize = new Sequelize("gym_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
  port: 3306,
});

// Connecting to MySQL Database
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

connectDB();

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.QueryTypes = QueryTypes;

// Make User Model
db.User = require("./userModel")(sequelize, DataTypes, Model);
db.Room = require("./roomModel")(sequelize, DataTypes, Model);
db.Room.belongsTo(db.User, {
  foreignKey: "owner_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.Review = require("./reviewModel")(sequelize, DataTypes, Model);
db.Review.belongsTo(db.User, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.Review.belongsTo(db.Room, {
  foreignKey: "room_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
// // Many to many relation
// db.User.belongsToMany(db.Room, { through: db.Review, uniqueKey: "user_id" });
// db.Room.belongsToMany(db.User, { through: db.Review, uniqueKey: "room_id" });

// Make ResponseComment Model

db.ResponseComment = require("./responseCommentModel")(
  sequelize,
  DataTypes,
  Model
);

db.ResponseComment.belongsTo(db.User, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.ResponseComment.belongsTo(db.Review, {
  foreignKey: "review_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.Image = require("./imageModel")(sequelize, DataTypes, Model);
// One to many relation

db.Room.hasMany(db.Image, {
  foreignKey: "room_id",
});

db.Room.hasMany(db.Review, {
  foreignKey: "room_id",
});

db.Image.belongsTo(db.Room, {
  foreignKey: "room_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.PoolRating = require("./poolRatingModel")(sequelize, DataTypes, Model);
db.PoolRating.belongsTo(db.Review, {
  foreignKey: "review_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.ReviewImage = require("./reviewImageModel")(sequelize, DataTypes, Model);
db.ReviewImage.belongsTo(db.Review, {
  foreignKey: "review_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.Review.hasMany(db.ReviewImage, {
  foreignKey: "review_id",
});

db.Review.hasOne(db.PoolRating, {
  foreignKey: "review_id",
});

db.sequelize.sync();

module.exports = db;
