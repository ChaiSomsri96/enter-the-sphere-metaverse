"use strict";

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("users", {
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
      email: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      role: {
        type: DataTypes.STRING,
      },
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      gender: {
        type: DataTypes.STRING,
      },
      emailVerified: {
        type: DataTypes.BOOLEAN,
      },
      verificationToken: {
        type: DataTypes.STRING,
      },
      verified: {
        type: DataTypes.DATE,
      },
      active: {
        type: DataTypes.BOOLEAN,
      },
      resetToken: {
        type: DataTypes.STRING,
      },
      verified: { type: DataTypes.DATE },
      resetTokenExpires: {
        type: DataTypes.STRING,
      },
      telegramId: {
        type: DataTypes.STRING,
      },
      orbBalance: {
        type: DataTypes.INTEGER,
      },
      tgUserName: {
        type: DataTypes.STRING,
      },
      passwordReset: {
        type: DataTypes.DATE,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        get() {
          return !!(this.verified || this.passwordReset);
        },
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
    await queryInterface.dropTable("users");
  },
};
