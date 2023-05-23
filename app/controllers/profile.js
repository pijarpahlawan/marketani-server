const { Sequelize, DataTypes, Transaction } = require('sequelize')
const userModel = require('../models/user')
const { development: dev } = require('../../config/database')

const getProfile = async (req, res) => {
  const sequelize = new Sequelize(dev.database, dev.username, dev.password, {
    host: dev.host,
    dialect: dev.dialect
  })

  const User = userModel(sequelize, DataTypes)

  try {
    const { userId } = req.auth

    const user = await sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED },
      async (t) => {
        return await User.findByPk(userId, { transaction: t })
      }
    )

    return res.status(200).json({ user })
  } catch (error) {
    error.statusCode = 500
    console.error({ statusode: error.statusCode, message: error.message })
    return res.status(error.statusCode).json({ error: error.message })
  } finally {
    await sequelize.close()
  }
}

const updateProfile = async (req, res) => {
  const sequelize = new Sequelize(dev.database, dev.username, dev.password, {
    host: dev.host,
    dialect: dev.dialect
  })

  const User = userModel(sequelize, DataTypes)

  try {
    const { userId } = req.auth
    const update = req.body

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

    return res.status(200).json({ numberAffected })
  } catch (error) {
    error.statusCode = 500
    console.error({ statusode: error.statusCode, message: error.message })
    return res.status(error.statusCode).json({ error: error.message })
  } finally {
    await sequelize.close()
  }
}

module.exports = { getProfile, updateProfile }
