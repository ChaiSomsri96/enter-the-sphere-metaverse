"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BundledCard extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BundledCard.belongsTo(models.User, {
        foreignKey: "userId",
      });
      BundledCard.belongsTo(models.Bundle, {
        foreignKey: "bundleId",
      });
      BundledCard.belongsTo(models.Card, {
        foreignKey: "cardId",
      });
      BundledCard.hasOne(models.NFTToken, {
        foreignKey: "bundledCardId",
      });
    }
    toJSON() {
      return {
        ...this.get(),
        id: undefined,
        userId: undefined,
        // bundleId: undefined,
        // cardId: undefined,
      };
    }
  }
  BundledCard.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      parentToken: DataTypes.STRING,
      tokenId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "BundledCard",
      tableName: "bundledCards",
    }
  );
  return BundledCard;
};
