'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      this.User = Cart.belongsTo(models.User, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        foreignKey: {
          name: 'buyerId'
        },
        as: 'buyer'
      })
      this.Product = Cart.belongsTo(models.Product, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        foreignKey: {
          name: 'productId'
        }
      })
    }
  }
  Cart.init(
    {
      buyerId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
      },
      productId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Cart',
      tableName: 'carts',
      underscored: true,
      paranoid: true
    }
  )
  return Cart
}
