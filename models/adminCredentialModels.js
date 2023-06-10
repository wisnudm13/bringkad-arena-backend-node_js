module.exports = (sequelize, DataTypes) => {
    const AdminCredential = sequelize.define("admin_credentials", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        createdAt: "created_at",
        updatedAt: "updated_at",
        isDeleted: {
            field: "is_deleted",
            type: DataTypes.BOOLEAN,
        },
        uuid: {
            type: DataTypes.UUID,
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

    })

    return AdminCredential
}