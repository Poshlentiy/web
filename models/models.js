const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  train: { type: DataTypes.STRING, allowNull: false },
  master: { type: DataTypes.STRING, allowNull: false },
  med: { type: DataTypes.STRING, defaultValue: "none" },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  calendar: { type: DataTypes.DATEONLY, defaultValue: Date.now() },
  shift: { type: DataTypes.STRING, defaultValue: "Day" },
  traintype: { type: DataTypes.STRING, defaultValue: "Personal" },
  promo: { type: DataTypes.STRING, defaultValue: "none" },
  sendAd: { type: DataTypes.BOOLEAN, defaultValue: true },
  subject: { type: DataTypes.STRING, allowNull: false },
  image: { type: DataTypes.STRING, defaultValue: "none" },
});

module.exports = {
  User,
};
