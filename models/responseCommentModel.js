module.exports = (sequelize, DataTypes, Model) => {
  class ResponseComment extends Model {}
  ResponseComment.init(
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
      review_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      response: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      // Other model options go here
      sequelize, // We need to pass the connection instance
      modelName: "ResponseComment", // We need to choose the model name
      timestamps: true,
    }
  );
  return ResponseComment;
};
