'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('transaction_details', {
      transactionId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'transaction_id'
      },
      productId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'product_id'
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'quantity'
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

    await queryInterface.addConstraint('transaction_details', {
      fields: ['transaction_id'],
      type: 'foreign key',
      name: 'fk_transaction_details_transactions',
      references: {
        table: 'transactions',
        field: 'transaction_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })

    await queryInterface.addConstraint('transaction_details', {
      fields: ['product_id'],
      type: 'foreign key',
      name: 'fk_transaction_details_products',
      references: {
        table: 'products',
        field: 'product_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })

    await queryInterface.addConstraint('transaction_details', {
      fields: ['transaction_id', 'product_id'],
      type: 'primary key'
    })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      'transaction_details',
      'fk_transaction_details_products'
    )
    await queryInterface.removeConstraint(
      'transaction_details',
      'fk_transaction_details_transactions'
    )
    await queryInterface.dropTable('transaction_details')
  }
}
