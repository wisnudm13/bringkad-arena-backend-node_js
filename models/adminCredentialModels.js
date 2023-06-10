module.exports = (sequelize, DataTypes) => {
    const AdminCredential = sequelize.define("admin_credentials", {
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
        adminID: {
            field: "admin_id",
            type: DataTypes.INTEGER,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }, 
        salt: {
            type: DataTypes.STRING,
            allowNull: false
        },

    }, {
        createdAt: "created_at",
        updatedAt: "updated_at"
    });
    return AdminCredential
}