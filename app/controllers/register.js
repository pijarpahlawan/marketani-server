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

const sequelize = new Sequelize(dev.database, dev.username, dev.password, {
  host: dev.host,
  dialect: dev.dialect
})

const Account = accountModel(sequelize, DataTypes)
const User = userModel(sequelize, DataTypes)

const register = async (req, res) => {
  const { email, password, username, provinceId, cityId } = req.body

  const saltRounds = 10
  const salt = await bcrypt.genSalt(saltRounds)
  const encryptedPassword = await bcrypt.hash(password, salt)

  try {
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
            provinceId,
            cityId,
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
    return res.status(201).json({ token })
  } catch (error) {
    console.error(error.message)

    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message })
    } else {
      return res.status(500).json({ message: error.message })
    }
  }
}

sequelize.close()

module.exports = register
