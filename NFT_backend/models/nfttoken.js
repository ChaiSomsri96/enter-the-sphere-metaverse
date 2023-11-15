"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NFTToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      NFTToken.belongsTo(models.BundledCard, { foreignKey: "bundledCardId" });
    }
    toJSON() {
      return {
        ...this.get(),
        id: undefined,
        userId: undefined,
        bundledCardId: undefined,
      };
    }
  }
  NFTToken.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      tokenId: DataTypes.STRING,
      tokenTx: DataTypes.STRING,
      phase: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "NFTToken",
      tableName: "nftTokens",
    }
  );
  return NFTToken;
};
