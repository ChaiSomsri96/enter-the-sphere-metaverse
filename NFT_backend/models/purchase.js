"use strict";
const { v4: uuidv4 } = require("uuid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Purchase extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Bundle }) {
      // define association here
      Purchase.belongsTo(User, { foreignKey: "userId" });
      Purchase.hasMany(Bundle, {
        foreignKey: "purchaseId",
        as: "bundles",
      });
    }
    toJSON() {
      return { ...this.get(), id: undefined, userId: undefined };
    }
  }
  Purchase.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      price: DataTypes.INTEGER,
      paymentMethod: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Purchase",
      tableName: "purchases",
    }
  );
  // Purchase.beforeCreate((purchase) => (purchase.id = uuidv4()));

  return Purchase;
};
