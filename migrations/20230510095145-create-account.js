'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('accounts', {
      accountId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
        field: 'account_id'
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        field: 'email'
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'password'
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
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('accounts')
  }
}
