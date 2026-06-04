'use strict';

export default {
  async up(queryInterface, Sequelize) {
    console.log("ADD COLUMN RUNNING");

    await queryInterface.addColumn("appointments", "carID", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.renameColumn(
      "appointments",
      "content",
      "address"
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(
      "appointments",
      "carID"
    );

    await queryInterface.renameColumn(
      "appointments",
      "address",
      "content"
    );
  }
};