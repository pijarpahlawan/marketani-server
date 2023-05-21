'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      this.Account = User.belongsTo(models.Account)
    }
  }
  User.init(
    {
      userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      avatarUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      username: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: {
          name: 'username',
          msg: 'Username already exists'
        }
      },
      name: {
        type: DataTypes.STRING(30),
        allowNull: true
      },
      phone: {
        type: DataTypes.STRING(15),
        allowNull: true
      },
      provinceId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      cityId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      address: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      gender: {
        type: DataTypes.STRING(1),
        allowNull: true
      },
      accountId: {
        type: DataTypes.UUID,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      underscored: true
    }
  )
  return User
}
