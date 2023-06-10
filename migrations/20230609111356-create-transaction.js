'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      transactionId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
        field: 'transaction_id'
      },
      courierId: {
        type: Sequelize.STRING(4),
        allowNull: false,
        field: 'courier_id'
      },
      totalBill: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'total_bill'
      },
      buyerId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'buyer_id'
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

    await queryInterface.addConstraint('transactions', {
      fields: ['buyer_id'],
      type: 'foreign key',
      name: 'fk_transactions_users',
      references: {
        table: 'users',
        field: 'user_id'
      },
      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT'
    })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      'transactions',
      'fk_transactions_users'
    )
    await queryInterface.dropTable('transactions')
  }
}