"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TradeWallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TradeWallet.belongsTo(models.User);
    }
    toJSON() {
      return {
        ...this.get(),
        id: undefined,
        userId: undefined,
      };
    }
  }
  TradeWallet.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      mneomic: DataTypes.STRING,
      privateKey: DataTypes.STRING,
      cashAddress: DataTypes.STRING,
      slpAddress: DataTypes.STRING,
      legacyAddress: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "TradeWallet",
      tableName: "tradeWallets",
    }
  );
  return TradeWallet;
};
