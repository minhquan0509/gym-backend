module.exports = (sequelize, DataTypes, Model) => {
  class ReviewImage extends Model {}
  ReviewImage.init(
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      review_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      // Other model options go here
      sequelize, // We need to pass the connection instance
      modelName: "ReviewImage", // We need to choose the model name
      timestamps: true,
    }
  );
  return ReviewImage;
};
