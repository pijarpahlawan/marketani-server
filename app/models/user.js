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
      this.Account = User.belongsTo(models.Account, {
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT',
        foreignKey: {
          name: 'accountId',
          type: DataTypes.UUID,
          allowNull: false
        }
      })
      this.Transaction = User.hasMany(models.Transaction, {
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT',
        foreignKey: {
          name: 'userId',
          type: DataTypes.UUID,
          allowNull: false
        }
      })
      this.Product = User.hasMany(models.Product, {
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT',
        foreignKey: {
          name: 'userId',
          type: DataTypes.UUID,
          allowNull: false
        }
      })
      this.Cart = User.hasMany(models.Cart, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        foreignKey: {
          name: 'userId',
          type: DataTypes.UUID,
          allowNull: false
        }
      })
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
