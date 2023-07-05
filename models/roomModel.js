module.exports = (sequelize, DataTypes, Model) => {
  class Room extends Model {}
  Room.init(
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      owner_id: {
        type: DataTypes.INTEGER,
      },
      numberOfUsers: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      rating: {
        type: DataTypes.FLOAT,
      },
      pool: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      parking: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      sauna: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      coach: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      pool_rating: {
        type: DataTypes.FLOAT,
        defaultValue: null,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      phone: {
        type: DataTypes.STRING(10),
        validate: {
          isNumeric: true,
          len: 10,
        },
      },
    },
    {
      // Other model options go here
      sequelize, // We need to pass the connection instance
      modelName: "Room", // We need to choose the model name
      timestamps: false,
    }
  );
  return Room;
};
