module.exports = (sequelize, DataTypes, Model) => {
  class Review extends Model {}
  Review.init(
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      room_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      review: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      like: {
        type: DataTypes.INTEGER,
      },
      dislike: {
        type: DataTypes.INTEGER,
      },
    },
    {
      // Other model options go here
      sequelize, // We need to pass the connection instance
      modelName: "Review", // We need to choose the model name
      timestamps: true,
    }
  );
  return Review;
};
