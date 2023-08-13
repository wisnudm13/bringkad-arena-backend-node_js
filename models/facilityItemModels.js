module.exports = (sequelize, DataTypes) => {
  const FacilityItem = sequelize.define("facility_items", {
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
      facilityID: {
        field: "facility_id",
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model:"facilities",
            key:"id"
          },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      }, 
      startTime: {
        field: "start_time",
        type: DataTypes.TIME,
      },
      finishTime: {
        field: "finish_time",
        type: DataTypes.TIME,
      },
      price: {
        field: "price",
        type: DataTypes.FLOAT
      },
      isActive: {
        field: "is_active",
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },

  }, {
      createdAt: "created_at",
      updatedAt: "updated_at"
  });

  return FacilityItem
}
