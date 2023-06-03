module.exports = (sequelize, DataTypes, Model) => {
  class User extends Model {}
  User.init(
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
      },
      phone: {
        type: DataTypes.STRING(10),
        validate: {
          isNumeric: true,
          len: 10,
        },
      },
      username: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      avatar: {
        type: DataTypes.STRING(255),
      },
      role: {
        type: DataTypes.ENUM,
        values: ["admin", "gym-owner", "user", "guest"],
        defaultValue: "guest",
      },
    },
    {
      // Other model options go here
      sequelize, // We need to pass the connection instance
      modelName: "User", // We need to choose the model name
      timestamps: false,
    }
  );
  return User;
};
