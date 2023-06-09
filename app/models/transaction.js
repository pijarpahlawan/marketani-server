'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      this.Product = Transaction.belongsToMany(models.Product, {
        through: models.TransactionDetail,
        foreignKey: 'transactionId'
      })
      this.TransactionDetail = Transaction.hasMany(models.TransactionDetail, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        foreignKey: {
          name: 'transactionId'
        }
      })
      this.User = Transaction.belongsTo(models.User, {
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT',
        foreignKey: {
          name: 'buyerId'
        },
        as: 'buyer'
      })
    }
  }
  Transaction.init(
    {
      transactionId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      courierId: {
        type: DataTypes.ENUM,
        values: ['jne', 'tiki', 'pos'],
        allowNull: false
      },
      courierCost: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      totalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      buyerId: {
        type: DataTypes.UUID,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Transaction',
      tableName: 'transactions',
      underscored: true,
      paranoid: true
    }
  )
  return Transaction
}
