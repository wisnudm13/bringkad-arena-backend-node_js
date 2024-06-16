'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('file_assets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      createdAt: {
        field: "created_at",
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        field: "updated_at",
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        field: "deleted_at",
        type: Sequelize.DATE
      },
      isDeleted: {
        field: "is_deleted",
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      fileType: {
        field: "file_type",
        type: Sequelize.STRING,
        allowNull: false,
      },
      filePath: {
        field: "file_path",
        type: Sequelize.STRING,
        allowNull: false,
      },
      reference_type: {
        field: "reference_type",
        type: Sequelize.STRING,
        allowNull: false,
      },
      reference_id: {
        field: "reference_id",
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('file_assets');
  }
};