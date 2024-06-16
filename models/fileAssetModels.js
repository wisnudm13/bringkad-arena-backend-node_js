'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FileAsset extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FileAsset.init({
    fileType: DataTypes.STRING,
    filePath: DataTypes.STRING,
    tableName: DataTypes.STRING,
    identifier: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'FileAsset',
  });
  return FileAsset;
};

module.exports = (sequelize, DataTypes) => {
  const Facility = sequelize.define("file_assets", {
      id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
      },
      isDeleted: {
          field: "is_deleted",
          type: DataTypes.BOOLEAN,
          defaultValue: false
      },
      deletedAt: {
          field: "deleted_at",
          type: DataTypes.DATE
      },
      fileType: {
        field: "file_type",
        type: DataTypes.STRING,
        allowNull: false,
      },
      filePath: {
        field: "file_path",
        type: DataTypes.STRING,
        allowNull: false,
      },
      referenceType: {
        field: "reference_type",
        type: DataTypes.STRING,
        allowNull: false,
      },
      referenceID: {
        field: "reference_id",
        type: DataTypes.INTEGER,
        allowNull: false,
      },

  }, {
      createdAt: "created_at",
      updatedAt: "updated_at"
  });

  return Facility
}
