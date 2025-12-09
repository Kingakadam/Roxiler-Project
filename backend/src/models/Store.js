const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Store = sequelize.define("Store", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING(400),
    allowNull: false,
  },
  averageRating: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
});

// Store belongs to an OWNER
Store.belongsTo(User, { as: "owner", foreignKey: "ownerId" });
User.hasMany(Store, { as: "stores", foreignKey: "ownerId" });

module.exports = Store;
