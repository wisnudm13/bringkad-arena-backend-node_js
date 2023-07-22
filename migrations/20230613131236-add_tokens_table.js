'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('tokens', {
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
        allowNull: true,
        onDelete: 'CASCADE',
      },
      userID: {
        field: "user_id",
        type: Sequelize.INTEGER,
        references: {
          model:"users",
          key:"id"
        },
        allowNull: true,
        onDelete: 'CASCADE',
      },
      token: {
          type: Sequelize.STRING,
          allowNull: false
      }, 
      isActive: {
          field: "is_active",
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
      },
    }).then(() => queryInterface.addConstraint("tokens", {
      type: "FOREIGN KEY",
      fields: ["admin_id"],
      name: "fk_token_admin_id",
      references: {
        table: "admins",
        field: "id", // key in Target model
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    })).then(() => queryInterface.addConstraint("tokens", {
      type: "FOREIGN KEY",
      fields: ["user_id"],
      name: "fk_token_user_id",
      references: {
        table: "users",
        field: "id", // key in Target model
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    }))
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tokens');
  }
};
