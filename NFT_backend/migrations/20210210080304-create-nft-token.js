"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("nftTokens", {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      bundledCardId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "bundledCards",
          key: "id",
        },
      },
      tokenId: {
        type: DataTypes.STRING,
      },
      tokenTx: {
        type: DataTypes.STRING,
      },
      phase: {
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable("nftTokens");
  },
};
