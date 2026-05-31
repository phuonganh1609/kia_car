'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.removeColumn("appointments", "province_id");
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.addColumn("appointments", "province_id", {
    type: Sequelize.UUID,
    allowNull: true,
  });
}
