"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([
      // queryInterface.addColumn(
      //   "users", // table name
      //   "orbBalance", // new field name
      //   {
      //     type: Sequelize.INTEGER,
      //     allowNull: true,
      //   }
      // ),
      // queryInterface.addColumn(
      //   "users", // table name
      //   "tgUserName", // new field name
      //   {
      //     type: Sequelize.STRING,
      //     allowNull: true,
      //   }
      // ),
      // queryInterface.addColumn(
      //   "users", // table name
      //   "verificationToken", // new field name
      //   {
      //     type: Sequelize.STRING,
      //     allowNull: true,
      //   }
      // ),
      // queryInterface.addColumn(
      //   "safeWallets", // table name
      //   "mneomic", // new field name
      //   {
      //     type: Sequelize.STRING,
      //     allowNull: true,
      //   }
      // ),
      // queryInterface.addColumn(
      //   "safeWallets", // table name
      //   "privateKey", // new field name
      //   {
      //     type: Sequelize.STRING,
      //     allowNull: true,
      //   }
      // ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
