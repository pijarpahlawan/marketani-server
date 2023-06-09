const {
  Sequelize,
  Transaction,
  ValidationError,
  UniqueConstraintError
} = require('sequelize')
const bcrypt = require('bcrypt')
const { User, Account } = require('../models')
const env = process.env.NODE_ENV || 'development'
const dbConfig = require('../../config/database')[env]
const { uploadAvatarPath } = require('../../config/fileUpload')

/**
 * Get user profile
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getProfile = async (req, res) => {
  const sequelize = new Sequelize(dbConfig)

  try {
    const { userId } = req.auth

    // Get user information
    const user = await sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED },
      async (t) => {
        return await User.findByPk(userId, {
          transaction: t,
          include: [
            {
              model: Account,
              attributes: ['email']
            }
          ]
        })
      }
    )

    if (Object.keys(user).length === 0) {
      throw new ValidationError('User not found')
    }

    const reponse = {
      code: 200,
      status: 'Ok',
      data: user
    }

    return res.status(200).json(reponse)
  } catch (error) {
    if (error instanceof ValidationError) {
      error.code = 404
      error.status = 'Not Found'
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

/**
 * Update user profile
 * @param {*} req
 * @param {*} res
 * @returns
 */
const updateProfile = async (req, res) => {
  const sequelize = new Sequelize(dbConfig)

  try {
    const { userId } = req.auth
    const {
      email,
      username,
      name,
      phone,
      provinceId,
      cityId,
      address,
      gender
    } = req.body

    // validate request body
    const { error: userError } = User.validate({
      username,
      name,
      phone,
      provinceId,
      cityId,
      address,
      gender
    })

    const { error: accountError } = Account.validate({ email })

    if ((userError || accountError) !== undefined) {
      throw new ValidationError((userError || accountError).message)
    }

    // update user information
    await sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED },
      async (t) => {
        const user = await User.findByPk(userId, {
          transaction: t,
          include: Account
        })

        await User.update(
          {
            username,
            name,
            phone,
            provinceId,
            cityId,
            address,
            gender
          },
          { where: { userId } },
          { transaction: t }
        )

        await Account.update(
          {
            email
          },
          { where: { accountId: user.Account.accountId } },
          { transaction: t }
        )
      }
    )

    const response = {
      code: 200,
      status: 'Ok',
      message: 'User updated successfully'
    }

    return res.status(200).json(response)
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

/**
 * Update user password
 * @param {*} req
 * @param {*} res
 * @returns
 */
const updatePassword = async (req, res) => {
  const sequelize = new Sequelize(dbConfig)

  try {
    const { userId } = req.auth
    const { oldPassword, newPassword, passwordConfirmation } = req.body

    // validate request body
    const { error } = Account.validate({
      password: newPassword,
      passwordConfirmation
    })

    if (error !== undefined) {
      throw new ValidationError(error.message)
    }

    // update user password
    await sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED },
      async (t) => {
        const user = await User.findByPk(userId, {
          transaction: t,
          include: Account
        })

        const match = await bcrypt.compare(oldPassword, user.Account.password)

        if (!match) {
          throw new ValidationError('Old password is invalid')
        }

        const saltRounds = 10
        const salt = await bcrypt.genSalt(saltRounds)
        const encryptedPassword = await bcrypt.hash(newPassword, salt)

        await user.Account.update(
          {
            password: encryptedPassword
          },
          { where: { userId } },
          { transaction: t }
        )
      }
    )

    const response = {
      code: 200,
      status: 'Ok',
      message: 'Password updated successfully'
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
  }
}

const updateAvatar = async (req, res) => {
  const sequelize = new Sequelize(dbConfig)

  try {
    const uploadFile = req.files.avatar
    const name = uploadFile.name
    const md5 = uploadFile.md5
    const saveAs = `${md5}_${name}`
    const filePath = `${uploadAvatarPath}/${saveAs}`

    await uploadFile.mv(filePath)

    await sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED },
      async (t) => {
        const { userId } = req.auth

        await User.update(
          {
            avatarUrl: saveAs
          },
          { where: { userId } },
          { transaction: t }
        )
      }
    )

    const response = {
      code: 200,
      status: 'Ok',
      message: 'Avatar updated successfully'
    }

    return res.status(200).json(response)
  } catch (error) {
    error.code = 500
    error.status = 'Internal Server Error'

    const response = {
      code: error.code,
      status: error.status,
      message: error.message
    }

    console.error(response)
    return res.status(response.code).json(response)
  }
}
module.exports = { getProfile, updateProfile, updatePassword, updateAvatar }
