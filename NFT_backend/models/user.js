"use strict";
const { Model, UUIDV4 } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.BillingAddress, {
        as: "billingAddresses",
        foreignKey: "userId",
      });
      User.hasOne(models.TradeWallet, {
        as: "tradeWallets",
        foreignKey: "userId",
      });
      User.hasOne(models.SafeWallet, {
        as: "safeWallets",
        foreignKey: "userId",
      });
      User.hasMany(models.Purchase, { as: "purchases", foreignKey: "userId" });
      User.hasMany(models.Bundle, {
        as: "bundles",
        foreignKey: "userId",
      });
      User.hasMany(models.NFTToken, {
        as: "nftTokens",
        foreignKey: "userId",
      });
      User.hasOne(models.RefreshToken, {
        as: "RefreshTokens",
        foreignKey: "userId",
      });
    }
    toJSON() {
      return { ...this.get(), id: undefined };
    }
  }

  User.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      role: DataTypes.STRING,
      gender: DataTypes.STRING,
      emailVerified: DataTypes.BOOLEAN,
      active: DataTypes.BOOLEAN,
      verificationToken: { type: DataTypes.STRING },
      verified: { type: DataTypes.DATE },
      resetToken: { type: DataTypes.STRING },
      resetTokenExpires: { type: DataTypes.STRING },
      passwordReset: { type: DataTypes.DATE },
      verified: { type: DataTypes.DATE },
      orbBalance: {
        type: DataTypes.INTEGER,
      },
      telegramId: {
        type: DataTypes.STRING,
      },
      tgUserName: {
        type: DataTypes.STRING,
      },
      isVerified: {
        type: DataTypes.VIRTUAL,
        get() {
          return !!(this.verified || this.passwordReset);
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
    }
  );
  // User.beforeCreate((user) => (user.id = uuidv4()));
  return User;
};
