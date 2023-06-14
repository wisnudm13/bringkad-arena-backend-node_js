module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("users", {
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
        phoneNumber: {
            field: "phone_number",
            type: DataTypes.STRING,
        },
  
    }, {
        createdAt: "created_at",
        updatedAt: "updated_at"
    });
  
    return User
  }