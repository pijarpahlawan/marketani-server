const { Sequelize, Transaction, ValidationError } = require('sequelize')
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const { Account } = require('../models')
const env = process.env.NODE_ENV || 'development'
const dbConfig = require('../../config/database')[env]

const login = async (req, res) => {
  const sequelize = new Sequelize(dbConfig)

  try {
    const { email = '', password = '' } = req.body

    const account = await sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED },
      async (t) => {
        return await Account.findOne({ where: { email } }, { transaction: t })
      }
    )

    if (!account) {
      throw new ValidationError('Email not found')
    }

    const match = await bcrypt.compare(password, account.password)

    if (!match) {
      throw new ValidationError('Wrong password')
    }

    const user = await account.getUser()

    const payload = { userId: user.userId }

    const token = jsonwebtoken.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '30d',
      algorithm: 'HS256'
    })

    res.cookie('marketaniAuthenticatedUser', token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000
    })

    const response = {
      code: 200,
      status: 'Ok',
      message: 'Login successful'
    }

    return res.status(200).json(response)
  } catch (error) {
    if (error instanceof ValidationError) {
      error.code = 400
      error.status = 'Bad Request'
    } else {
      error.code = 500
      error.status = 'Internal Server Error'
    }

    const response = {
      code: error.code,
      status: error.status,
      message: error.message
    }

    console.error(response)
    return res.status(response.code).json(response)
  } finally {
    await sequelize.close()
  }
}

module.exports = login
