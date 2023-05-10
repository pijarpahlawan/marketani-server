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
      User.belongsTo(models.Account)
    }
  }
  User.init(
    {
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        field: 'user_id'
      },
      avatarUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'avatar_url'
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          name: 'username',
          msg: 'Username already exists'
        },
        field: 'username'
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'name'
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'phone'
      },
      provinceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'province_id'
      },
      cityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'city_id'
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'address'
      },
      gender: {
        type: DataTypes.ENUM,
        allowNull: true,
        value: ['L', 'P'],
        field: 'gender'
      },
      accountId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'account_id'
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
