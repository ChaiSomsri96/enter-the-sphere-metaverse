"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Bundle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Bundle.belongsTo(models.User, {
        foreignKey: "userId",
      });
      Bundle.hasMany(models.BundledCard, {
        foreignKey: "bundleId",
      });
    }
    toJSON() {
      return { ...this.get(), id: undefined, userId: undefined };
    }
  }
  Bundle.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      name: DataTypes.STRING,
      price: DataTypes.INTEGER,
      status: DataTypes.STRING,
      phase: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Bundle",
      tableName: "bundles",
    }
  );
  return Bundle;
};
