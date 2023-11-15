"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class marketlistings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  marketlistings.init(
    {
      cardId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      status: DataTypes.STRING,
      price: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "marketListings",
    }
  );
  return marketlistings;
};
