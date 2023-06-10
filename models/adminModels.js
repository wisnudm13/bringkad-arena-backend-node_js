module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define("admins", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        isDeleted: {
            field: "is_deleted",
            type: DataTypes.BOOLEAN,
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
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }, 
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        isActive: {
            field: "is_active",
            type: DataTypes.BOOLEAN,
        },
        phoneNumber: {
            field: "phone_number",
            type: DataTypes.STRING,
        },

    }, {
        createdAt: "created_at",
        updatedAt: "updated_at"
    });

    return Admin
}