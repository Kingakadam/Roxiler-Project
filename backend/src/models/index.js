const sequelize = require("../config/db");
const User = require("./User");
const Store = require("./Store");
const Rating = require("./Rating");

async function syncModels() {
  try {
    await sequelize.authenticate();
    console.log("DB connected successfully");
    await sequelize.sync({ alter: true });
    console.log("Models synced successfully");
  } catch (err) {
    console.error("DB sync error", err);
  }
}

module.exports = {
  sequelize,
  User,
  Store,
  Rating,
  syncModels,
};
