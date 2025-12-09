const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Store = require("./Store");

const Rating = sequelize.define("Rating", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 },
  },
});

// relationships
Rating.belongsTo(User, { foreignKey: "userId", as: "user" });
Rating.belongsTo(Store, { foreignKey: "storeId", as: "store" });

User.hasMany(Rating, { foreignKey: "userId", as: "ratings" });
Store.hasMany(Rating, { foreignKey: "storeId", as: "ratings" });

module.exports = Rating;
