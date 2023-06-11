module.exports = (sequelize, DataTypes) => {
    const Token = sequelize.define("tokens", {
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
        adminID: {
            field: "admin_id",
            type: DataTypes.INTEGER,
        },
        userID: {
            field: "user_id",
            type: DataTypes.INTEGER,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isActive: {
            field: "is_active",
            type: DataTypes.BOOLEAN,
        },

    }, {
        createdAt: "created_at",
        updatedAt: "updated_at"
    });

    return Token
}