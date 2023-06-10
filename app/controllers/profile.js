const { Sequelize, Transaction, ValidationError } = require('sequelize')
const { User } = require('../models')
const userValidator = require('../validation/userValidator')
const env = process.env.NODE_ENV || 'development'
const dbConfig = require('../../config/database')[env]

const getProfile = async (req, res) => {
  const sequelize = new Sequelize(dbConfig)

  try {
    const { userId } = req.auth

    const user = await sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED },
      async (t) => {
        return await User.findByPk(userId, { transaction: t })
      }
    )

    const body = {
      code: 200,
      status: 'OK',
      message: 'Success',
      data: user
    }

    return res.status(200).json(body)
  } catch (error) {
    error.statusCode = 500

    const body = {
      code: error.statusCode,
      status: 'Internal Server Error',
      message: error.message
    }

    console.error(body)
    return res.status(body.code).json(body)
  } finally {
    await sequelize.close()
  }
}

const updateProfile = async (req, res) => {
  const sequelize = new Sequelize(dbConfig)

  try {
    const { userId } = req.auth
    const update = req.body

    const { error } = userValidator.validate(update)

    if (error !== undefined) {
      throw new ValidationError(error.message)
    }

    const numberAffected = await sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED },
      async (t) => {
        return await User.update(
          update,
          { where: { userId } },
          { transaction: t }
        )
      }
    )

    const body = {
      code: 200,
      status: 'OK',
      message: 'Success',
      data: numberAffected
    }

    return res.status(200).json(body)
  } catch (error) {
    error.statusCode = error instanceof ValidationError ? 400 : 500

    const body = {
      code: error.statusCode,
      status:
        error.statusCode === 400 ? 'Bad Request' : 'Internal Server Error',
      message: error.message
    }

    console.error(body)
    return res.status(error.statusCode).json(body)
  } finally {
    await sequelize.close()
  }
}

module.exports = { getProfile, updateProfile }
