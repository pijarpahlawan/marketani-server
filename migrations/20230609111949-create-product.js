'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      product_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      productName: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'product_name'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        field: 'description'
      },
      weight: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'weight'
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'stock'
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'price'
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
        field: 'image'
      },
      sellerId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'seller_id'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'created_at'
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'updated_at'
      },
      deletedAt: {
        type: Sequelize.DATE,
        field: 'deleted_at'
      }
    })
    await queryInterface.addConstraint('products', {
      fields: ['seller_id'],
      type: 'foreign key',
      name: 'fk_products_users',
      references: {
        table: 'users',
        field: 'user_id'
      },
      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT'
    })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('products', 'fk_products_users')
    await queryInterface.dropTable('products')
  }
}
