module.exports = (sequelize, DataTypes, Model) => {
  class PoolRating extends Model {}
  PoolRating.init(
    {
      // Model attributes are defined here
      // room_id: {
      //   type: DataTypes.INTEGER,
      //   primaryKey: true,
      // },
      review_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      rating: {
        type: DataTypes.FLOAT,
      },
    },
    {
      // Other model options go here
      sequelize, // We need to pass the connection instance
      modelName: "PoolRating", // We need to choose the model name
      timestamps: true,
    }
  );
  return PoolRating;
};
