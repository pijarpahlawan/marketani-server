'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      this.User = Favorite.belongsTo(models.User, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        foreignKey: {
          name: 'buyerId',
          type: DataTypes.UUID,
          allowNull: false
        },
        as: 'buyer'
      })
      this.Product = Favorite.belongsTo(models.Product, {
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
  Favorite.init(
    {},
    {
      sequelize,
      modelName: 'Favorite',
      tableName: 'favorites',
      underscored: true
    }
  )
  return Favorite
}
