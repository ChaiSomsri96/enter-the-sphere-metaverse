"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class markettransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  markettransaction.init(
    {
      buyerId: DataTypes.INTEGER,
      sellerId: DataTypes.INTEGER,
      cardId: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      type: DataTypes.STRING,
      paymentMethod: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "marketTransaction",
    }
  );
  return markettransaction;
};
