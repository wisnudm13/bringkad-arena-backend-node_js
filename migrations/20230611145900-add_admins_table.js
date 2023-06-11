'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('admins', {
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
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      }, 
      email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
      },
      isActive: {
          field: "is_active",
          type: Sequelize.BOOLEAN,
          defaultValue: true
      },
      phoneNumber: {
          field: "phone_number",
          type: Sequelize.STRING,
      },
      
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('admins');
  }
};