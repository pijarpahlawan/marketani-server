'use strict'

const { Model } = require('sequelize')
const joi = require('joi')

module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      this.User = Account.hasOne(models.User, {
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT',
        foreignKey: {
          name: 'accountId',
          type: DataTypes.UUID,
          allowNull: false
        }
      })
    }

    static validate (model) {
      const validationSchema = joi.object({
        email: joi.string().email().messages({
          'string.empty': 'Email cannot be empty',
          'string.email': 'Email is not valid'
        }),
        password: joi
          .string()
          .min(6)
          .max(30)
          .trim()
          .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*\s).*$/) // at least one lowercase, one uppercase, one number, no whitespace
          .messages({
            'string.empty': 'Password cannot be empty',
            'string.min': 'Password must be at least 6 characters long',
            'string.max': 'Password must be at most 30 characters long',
            'string.pattern.base':
              'Password must contain at least one lowercase letter, one uppercase letter, and one number without whitespace'
          }),
        passwordConfirmation: joi.ref('password')
      })

      return validationSchema.validate(model)
    }
  }
  Account.init(
    {
      accountId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          name: 'email',
          msg: 'Email already exists'
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Account',
      tableName: 'accounts',
      underscored: true,
      paranoid: true
    }
  )
  return Account
}
