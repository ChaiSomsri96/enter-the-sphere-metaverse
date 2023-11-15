"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("cards", {
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
      gameCardId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
      },
      rarity: {
        type: DataTypes.STRING,
      },
      cost: {
        type: DataTypes.INTEGER,
      },
      shortDesc: {
        type: DataTypes.STRING,
      },
      desc: {
        type: DataTypes.TEXT,
      },
      cardImage: {
        type: DataTypes.STRING,
      },
      mechanicStatus: {
        type: DataTypes.STRING,
      },
      tokenId: {
        type: DataTypes.STRING,
      },
      chance: {
        type: DataTypes.FLOAT,
      },
      totalSupply: {
        type: DataTypes.INTEGER,
      },
      currentSupply: {
        type: DataTypes.INTEGER,
      },
      illustration: {
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
    await queryInterface.dropTable("cards");
  },
};
