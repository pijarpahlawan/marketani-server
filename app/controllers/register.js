const {
  Sequelize,
  Transaction,
  ValidationError,
  UniqueConstraintError
} = require('sequelize')
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const { Account, User } = require('../models')
const env = process.env.NODE_ENV || 'development'
const dbConfig = require('../../config/database')[env]

const register = async (req, res) => {
  const sequelize = new Sequelize(dbConfig)

  try {
    const { username, email, password, passwordConfirmation } = req.body

    const { error: accountError } = Account.validate({
      email,
      password,
      passwordConfirmation
    })

    const { error: userError } = User.validate({ username })

    if ((accountError || userError) !== undefined) {
      throw new ValidationError((accountError || userError).message)
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
              username
            }
          },
          { transaction: t, include: [Account.User] }
        )
      }
    )

    const newUser = await newAccount.getUser()

    const token = jsonwebtoken.sign(
      { userId: newUser.userId },
      process.env.JWT_SECRET,
      {
        expiresIn: '30d',
        algorithm: 'HS256'
      }
    )

    res.cookie('marketaniAuthenticatedUser', token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000
    })

    const response = {
      code: 201,
      status: 'Created',
      message: 'User has been successfully created'
    }

    return res.status(201).json(response)
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      error.code = 409
      error.status = 'Conflict'
    } else if (error instanceof ValidationError) {
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

module.exports = register
