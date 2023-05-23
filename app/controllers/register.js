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
const accountValidator = require('../validation/accountValidator')
const userValidator = require('../validation/userValidator')
const { development: dev } = require('../../config/database')

const register = async (req, res) => {
  const sequelize = new Sequelize(dev.database, dev.username, dev.password, {
    host: dev.host,
    dialect: dev.dialect
  })

  const Account = accountModel(sequelize, DataTypes)
  const User = userModel(sequelize, DataTypes)
  Account.associate({ User })
  User.associate({ Account })

  try {
    const { email, password, repeatedPassword, username } = req.body
    const { error: accountError } = accountValidator.validate({
      email,
      password,
      repeatedPassword
    })
    const { error: userError } = userValidator.validate({ username })

    if (accountError !== undefined) {
      throw new ValidationError(accountError.message)
    } else if (userError !== undefined) {
      throw new ValidationError(userError.message)
    }

    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)
    const encryptedPassword = await bcrypt.hash(password, salt)

    const newAccount = await sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED },
      async (t) => {
        return await Account.create(
          {
            email,
            password: encryptedPassword,
            User: {
              avatarUrl: null,
              username,
              name: null,
              phone: null,
              provinceId: null,
              cityId: null,
              address: null,
              gender: null
            }
          },
          { transaction: t, include: [Account.User] }
        )
      }
    )

    const newUser = await newAccount.getUser()

    const payload = { userId: newUser.userId }

    const token = jsonwebtoken.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '30d',
      algorithm: 'HS256'
    })

    res.cookie('marketaniAuthenticatedUser', token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000
    })

    return res.status(201).json({ userId: newUser.userId })
  } catch (error) {
    error.statusCode = error instanceof ValidationError ? 400 : 500

    console.error({ statusode: error.statusCode, message: error.message })
    return res.status(error.statusCode).json({ message: error.message })
  } finally {
    await sequelize.close()
  }
}

module.exports = register
