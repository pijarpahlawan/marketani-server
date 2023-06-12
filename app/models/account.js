'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      this.User = Account.hasOne(models.User, {
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT',
        foreignKey: {
          name: 'accountId',
          type: DataTypes.UUID,
          allowNull: false
        }
      })
    }
  }
  Account.init(
    {
      accountId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      username: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: {
          name: 'username',
          msg: 'Username already exists'
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          name: 'email',
          msg: 'Email already exists'
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Account',
      tableName: 'accounts',
      underscored: true
    }
  )
  return Account
}
