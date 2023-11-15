"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class balanceTransactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  balanceTransactions.init(
    {
      userId: DataTypes.INTEGER,
      paidAmount: DataTypes.INTEGER,
      method: DataTypes.STRING,
      currencyPurchased: DataTypes.STRING,
      amountPurchase: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "balanceTransactions",
    }
  );
  return balanceTransactions;
};
