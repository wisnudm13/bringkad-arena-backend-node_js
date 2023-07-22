'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('facility_items', {
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
      facilityID: {
        field: "facility_id",
        type: Sequelize.INTEGER,
        references: {
          model:"facilities",
          key:"id"
        },
        allowNull: false,
        onDelete: 'CASCADE',
      },
      name: {
        type: Sequelize.STRING
      },
      startTime: {
        field: "start_time",
        type: Sequelize.TIME
      },
      finishTime: {
        field: "finish_time",
        type: Sequelize.TIME
      },
      isActive: {
        field: "is_active",
        type: Sequelize.BOOLEAN,
        defaultValue: true
      }
    }).then(() => queryInterface.addConstraint("facility_items", {
      type: "FOREIGN KEY",
      fields: ["facility_id"],
      name: "fk_facility_items_facility_id",
      references: {
        table: "facilities",
        field: "id", // key in Target model
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    }))
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('facility_items');
  }
};