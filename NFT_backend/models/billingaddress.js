"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BillingAddress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BillingAddress.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
    toJSON() {
      return { ...this.get(), id: undefined, userid: undefined };
    }
  }
  BillingAddress.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      streetAddress: DataTypes.STRING,
      phone: DataTypes.STRING,
      zipcode: DataTypes.INTEGER,
      state: DataTypes.STRING,
      country: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "BillingAddress",
      tableName: "billingAddresses",
    }
  );
  return BillingAddress;
};
