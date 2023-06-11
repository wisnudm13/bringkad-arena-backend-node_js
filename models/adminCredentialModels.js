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
            defaultValue: false
        },
        deletedAt: {
            field: "deleted_at",
            type: DataTypes.DATE
        },
        adminID: {
            field: "admin_id",
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model:"admins",
                key:"id"
              },
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

    // AdminCredential.associate = function(models) {
    //     AdminCredential.belongsTo(models.Admin, {
    //         foreignKey: 'admin_id',
    //         as: 'admins',
    //         onDelete: 'CASCADE',
    //     });
    // };
    return AdminCredential
}