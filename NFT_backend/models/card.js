"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Card extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Card.hasMany(models.BundledCard, {
        foreignKey: "cardId",
      });
    }
    toJSON() {
      return { ...this.get(), id: undefined };
    }
  }
  Card.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      gameCardId: {
        type: DataTypes.INTEGER,
      },
      name: DataTypes.STRING,
      type: DataTypes.STRING,
      rarity: DataTypes.STRING,
      cost: DataTypes.INTEGER,
      shortDesc: DataTypes.STRING,
      desc: DataTypes.TEXT,
      cardImage: DataTypes.STRING,
      mechanicStatus: DataTypes.STRING,
      tokenId: DataTypes.STRING,
      illustration: DataTypes.STRING,
      chance: DataTypes.FLOAT,
      totalSupply: DataTypes.INTEGER,
      currentSupply: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Card",
      tableName: "cards",
    }
  );
  return Card;
};
