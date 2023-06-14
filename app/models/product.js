'use strict'

const joi = require('joi')
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

    static validate (model) {
      const validationSchema = joi.object({
        productName: joi.string().min(1).max(60).trim().messages({
          'string.empty': 'Product name cannot be empty',
          'string.pattern.base':
            'Product name must be alphanumeric and 3-60 characters long'
        }),
        description: joi.string().trim().messages({
          'string.empty': 'Description cannot be empty'
        }),
        weight: joi.number().integer().min(1).messages({
          'number.base': 'Weight must be a number',
          'number.empty': 'Weight cannot be empty',
          'number.min': 'Weight must be greater than 0'
        }),
        stock: joi.number().integer().min(1).messages({
          'number.base': 'Stock must be a number',
          'number.empty': 'Stock cannot be empty',
          'number.min': 'Stock must be greater than 0'
        }),
        price: joi.number().integer().min(1).messages({
          'number.base': 'Price must be a number',
          'number.empty': 'Price cannot be empty',
          'number.min': 'Price must be greater than 0'
        })
      })
      return validationSchema.validate(model)
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
      underscored: true,
      paranoid: true
    }
  )
  return Product
}
