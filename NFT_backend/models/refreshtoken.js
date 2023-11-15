"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RefreshToken.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  RefreshToken.init(
    {
      expires: DataTypes.STRING,
      token: DataTypes.STRING,
      createdByIP: DataTypes.STRING,
      revoked: DataTypes.DATE,
      revokedByIP: DataTypes.STRING,
      replaceByToken: DataTypes.STRING,
      isExpired: {
        type: DataTypes.BOOLEAN,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      modelName: "RefreshToken",
    }
  );
  return RefreshToken;
};
