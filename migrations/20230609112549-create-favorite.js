'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('favorites', {
      buyerId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'buyer_id'
      },
      productId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'product_id'
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
      }
    })

    await queryInterface.addConstraint('favorites', {
      fields: ['buyer_id'],
      type: 'foreign key',
      name: 'fk_favorites_users',
      references: {
        table: 'users',
        field: 'user_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })

    await queryInterface.addConstraint('favorites', {
      fields: ['product_id'],
      type: 'foreign key',
      name: 'fk_favorites_products',
      references: {
        table: 'products',
        field: 'product_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })

    await queryInterface.addConstraint('favorites', {
      fields: ['buyer_id', 'product_id'],
      type: 'primary key'
    })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('favorites', 'fk_favorites_users')
    await queryInterface.removeConstraint('favorites', 'fk_favorites_products')
    await queryInterface.dropTable('favorites')
  }
}
