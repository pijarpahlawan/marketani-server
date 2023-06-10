const { Sequelize, Transaction, ValidationError } = require('sequelize')
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const { Account } = require('../models')
const accountValidator = require('../validation/accountValidator')
const userValidator = require('../validation/userValidator')
const env = process.env.NODE_ENV || 'development'
const dbConfig = require('../../config/database')[env]

const register = async (req, res) => {
  const sequelize = new Sequelize(dbConfig)

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

    const body = {
      code: 201,
      status: 'Created',
      message: 'User successfully registered',
      data: {
        userId: newUser.userId
      }
    }

    return res.status(201).json(body)
  } catch (error) {
    error.statusCode = error instanceof ValidationError ? 400 : 500

    const body = {
      code: error.statusCode,
      status:
        error.statusCode === 400 ? 'Bad Request' : 'Internal Server Error',
      message: error.message
    }

    console.error(body)
    return res.status(body.code).json(body)
  } finally {
    await sequelize.close()
  }
}

module.exports = register
