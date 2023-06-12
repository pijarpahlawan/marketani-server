'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      this.User = Product.belongsTo(models.User, {
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT',
        foreignKey: {
          name: 'sellerId',
          type: DataTypes.UUID,
          allowNull: false
        },
        as: 'seller'
      })
      this.Transaction = Product.belongsToMany(models.Transaction, {
        through: models.TransactionDetail,
        foreignKey: 'productId'
      })
      this.TransactionDetail = Product.hasMany(models.TransactionDetail, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        foreignKey: {
          name: 'productId',
          type: DataTypes.UUID,
          allowNull: false
        }
      })
      this.Cart = Product.hasMany(models.Cart, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        foreignKey: {
          name: 'productId',
          type: DataTypes.UUID,
          allowNull: false
        }
      })
    }
  }
  Product.init(
    {
      productId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      productName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      weight: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Product',
      tableName: 'products',
      underscored: true
    }
  )
  return Product
}
