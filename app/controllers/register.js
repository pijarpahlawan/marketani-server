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

const register = async (req, res) => {
  const sequelize = new Sequelize(dev.database, dev.username, dev.password, {
    host: dev.host,
    dialect: dev.dialect
  })

  const Account = accountModel(sequelize, DataTypes)
  const User = userModel(sequelize, DataTypes)

  const { email, password, username } = req.body

  try {
    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)
    const encryptedPassword = await bcrypt.hash(password, salt)
    const newUserAccount = await sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED },
      async (t) => {
        const newAccount = await Account.create(
          {
            email,
            password: encryptedPassword
          },
          { transaction: t }
        )
        const newUser = await User.create(
          {
            avatarUrl: null,
            username,
            name: null,
            phone: null,
            provinceId: null,
            cityId: null,
            address: null,
            gender: null,
            accountId: newAccount.accountId
          },
          { transaction: t }
        )
        return { newAccount, newUser }
      }
    )

    const payload = { account: newUserAccount.newAccount.accountId }
    const token = jsonwebtoken.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '30d',
      algorithm: 'HS256'
    })

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000
    })

    return res.status(201).json({ token })
  } catch (error) {
    res.end()

    error.statusCode = error instanceof ValidationError ? 400 : 500

    console.error({ statusode: error.statusCode, message: error.message })

    // throw error
    // if (error instanceof ValidationError) {
    //   return res.status(400).json({ message: error.message })
    // } else {
    //   return res.status(500).json({ message: error.message })
    // }
  } finally {
    sequelize.close()
  }
}

module.exports = register
