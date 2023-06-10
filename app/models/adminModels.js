module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define("admins", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        createdAt: "created_at",
        updatedAt: "updated_at",
        isDeleted: {
            type: DataTypes.BOOLEAN,
        },
        uuid: {
            type: DataTypes.UUID,
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

    })

    return Admin
}