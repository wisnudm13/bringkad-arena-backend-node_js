module.exports = (sequelize, DataTypes) => {
    const UserCredential = sequelize.define("user_credentials", {
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
        userID: {
            field: "user_id",
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model:"users",
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

    // UserCredential.associate = function(models) {
    //     UserCredential.belongsTo(models.Admin, {
    //         foreignKey: 'admin_id',
    //         as: 'admins',
    //         onDelete: 'CASCADE',
    //     });
    // };
    return UserCredential
}