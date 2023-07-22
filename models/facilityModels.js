module.exports = (sequelize, DataTypes) => {
  const Facility = sequelize.define("facilites", {
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
      uuid: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          unique: true
      },
      name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
      }, 
      type: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      description: {
          type: DataTypes.STRING,
      },
      status: {
          type: DataTypes.STRING,
      },

  }, {
      createdAt: "created_at",
      updatedAt: "updated_at"
  });

  return Facility
}
