const {
  Sequelize,
  DataTypes,
  Transaction,
  ValidationError
} = require('sequelize')
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const accountModel = require('../models/account')
const userModel = require('../models/user')
const { development: dev } = require('../../config/database')

const login = async (req, res) => {
  const sequelize = new Sequelize(dev.database, dev.username, dev.password, {
    host: dev.host,
    dialect: dev.dialect
  })

  const Account = accountModel(sequelize, DataTypes)
  const User = userModel(sequelize, DataTypes)
  Account.associate({ User })
  User.associate({ Account })

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

    const payload = { account: account.accountId }
    const token = jsonwebtoken.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '30d',
      algorithm: 'HS256'
    })

    res.cookie('marketaniAuthenticatedUser', token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json({ token })
  } catch (error) {
    error.statusCode = error instanceof ValidationError ? 400 : 500

    res.status(error.statusCode).json({ message: error.message })
    console.error({ statusode: error.statusCode, message: error.message })
  } finally {
    sequelize.close()
  }
}

module.exports = login
