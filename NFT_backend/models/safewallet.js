"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SafeWallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SafeWallet.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
    toJSON() {
      return { ...this.get(), id: undefined, userId: undefined };
    }
  }
  SafeWallet.init(
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
      modelName: "SafeWallet",
      tableName: "\"safeWallets\"",
    }
  );
  return SafeWallet;
};
