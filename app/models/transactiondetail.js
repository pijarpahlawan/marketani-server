'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class TransactionDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      this.Product = TransactionDetail.belongsTo(models.Product, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        foreignKey: {
          name: 'productId'
        }
      })
      this.Transaction = TransactionDetail.belongsTo(models.Transaction, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        foreignKey: {
          name: 'transactionId'
        }
      })
    }
  }
  TransactionDetail.init(
    {
      productId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      transactionId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'TransactionDetail',
      tableName: 'transaction_details',
      underscored: true,
      paranoid: true
    }
  )
  return TransactionDetail
}
