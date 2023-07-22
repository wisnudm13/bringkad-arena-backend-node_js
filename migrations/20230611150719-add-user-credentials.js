'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('user_credentials', {
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
      userID: {
        field: "user_id",
        type: Sequelize.INTEGER,
        references: {
          model:"users",
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
    }).then(() => queryInterface.addConstraint("user_credentials", {
      type: "FOREIGN KEY",
      fields: ["user_id"],
      name: "fk_user_credentials_user_id",
      references: {
        table: "users",
        field: "id", // key in Target model
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    }))
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_credentials');
  }
};
