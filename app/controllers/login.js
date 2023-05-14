const {
  Sequelize,
  DataTypes,
  Transaction,
  ValidationError
} = require('sequelize')
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const accountModel = require('../models/account')
const { development: dev } = require('../../config/database')

const sequelize = new Sequelize(dev.database, dev.username, dev.password, {
  host: dev.host,
  dialect: dev.dialect
})

const Account = accountModel(sequelize, DataTypes)

const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const account = await sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED },
      async (t) => {
        const accountFinded = await Account.findOne(
          { where: { email } },
          { transaction: t }
        )

        return accountFinded
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

    return res.status(200).json({ token })
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

module.exports = login
