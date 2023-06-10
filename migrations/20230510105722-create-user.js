'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      userId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
        field: 'user_id'
      },
      avatarUrl: {
        type: Sequelize.STRING,
        allowNull: true,
        field: 'avatar_url'
      },
      username: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
        field: 'username'
      },
      name: {
        type: Sequelize.STRING(30),
        allowNull: true,
        field: 'name'
      },
      phone: {
        type: Sequelize.STRING(15),
        allowNull: true,
        field: 'phone'
      },
      provinceId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'province_id'
      },
      cityId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'city_id'
      },
      address: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: 'address'
      },
      gender: {
        type: Sequelize.STRING(1),
        allowNull: true,
        field: 'gender'
      },
      accountId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'account_id'
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

    await queryInterface.addConstraint('users', {
      fields: ['account_id'],
      type: 'foreign key',
      name: 'fk_users_accounts',
      references: {
        table: 'accounts',
        field: 'account_id'
      },
      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT'
    })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('users', 'fk_users_accounts')
    await queryInterface.dropTable('users')
  }
}
