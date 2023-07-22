'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('admin_credentials', {
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
      adminID: {
        field: "admin_id",
        type: Sequelize.INTEGER,
        references: {
          model:"admins",
          key:"id"
        },
        allowNull: false,
        onDelete: 'CASCADE',
      },
      password: {
          type: Sequelize.STRING,
          allowNull: false
      }, 
      salt: {
          type: Sequelize.STRING,
          allowNull: false
      },
    }).then(() => queryInterface.addConstraint("admin_credentials", {
      type: "FOREIGN KEY",
      fields: ["admin_id"],
      name: "fk_admin_credentials_admin_id",
      references: {
        table: "admins",
        field: "id", // key in Target model
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    }))
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('admin_credentials');
  }
};
