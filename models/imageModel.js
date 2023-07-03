module.exports = (sequelize, DataTypes, Model) => {
  class Image extends Model {}
  Image.init(
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      room_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      // Other model options go here
      sequelize, // We need to pass the connection instance
      modelName: "Image", // We need to choose the model name
      timestamps: true,
    }
  );
  return Image;
};
