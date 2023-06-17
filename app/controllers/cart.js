const { Sequelize, ValidationError, Transaction, Op } = require('sequelize')
const { Product, Cart } = require('../models')
const env = process.env.NODE_ENV || 'development'
const dbConfig = require('../../config/database')[env]

/**
 * Get all products in cart
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getAllCart = async (req, res) => {
  const sequelize = new Sequelize(dbConfig)

  try {
    const carts = await sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED },
      async (t) => {
        return await Cart.findAll({ transaction: t, include: Product })
      }
    )

    // trow error if no product found
    if (Object.keys(carts).length === 0) {
      throw new ValidationError('No carts found')
    }

    const response = {
      code: 200,
      status: 'Ok',
      data: carts
    }

    return res.status(200).json(response)
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
  }
}

/**
 * Insert product to cart
 * @param {*} req
 * @param {*} res
 * @returns
 */
const createCart = async (req, res) => {
  const sequelize = new Sequelize(dbConfig)

  try {
    const { userId } = req.auth
    console.log(userId)
    const { productId, quantity } = req.body

    // insert product to cart
    await sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED },
      async (t) => {
        const product = await Product.findOne(
          {
            where: {
              productId
            }
          },
          { transaction: t }
        )

        if (product.stock < quantity) {
          throw new ValidationError('Product out of stock')
        }

        await Cart.create(
          {
            buyerId: userId,
            productId,
            quantity
          },
          { transaction: t }
        )
      }
    )

    const response = {
      code: 201,
      status: 'Created',
      message: 'Product added to cart successfully'
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

    console.error(error)
    return res.status(response.code).json(response)
  }
}

/**
 * Updae product in cart
 * @param {*} req
 * @param {*} res
 * @returns
 */
const updateCart = async (req, res) => {
  const sequelize = new Sequelize(dbConfig)

  try {
    const { userId } = req.auth
    const { productId, quantity } = req.body

    // update product in cart
    await sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED },
      async (t) => {
        const product = await Product.findOne(
          {
            where: {
              productId
            }
          },
          { transaction: t }
        )

        if (product.stock < quantity) {
          throw new ValidationError('Product out of stock')
        }

        await Cart.update(
          {
            quantity
          },
          {
            where: {
              [Op.and]: [{ productId }, { buyerId: userId }]
            }
          },
          { transaction: t }
        )
      }
    )

    const response = {
      code: 200,
      status: 'Ok',
      message: 'Cart updated successfully'
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

/**
 * Delete product in cart
 * @param {*} req
 * @param {*} res
 * @returns
 */
const deleteCart = async (req, res) => {
  const sequelize = new Sequelize(dbConfig)

  try {
    const { userId } = req.auth
    const { productId } = req.query

    // delete product in cart
    await sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED },
      async (t) => {
        await Cart.destroy(
          {
            where: {
              [Op.and]: [{ buyerId: userId }, { productId }]
            }
          },
          { transaction: t }
        )
      }
    )

    const response = {
      code: 200,
      status: 'Ok',
      message: 'Cart deleted successfully'
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

module.exports = {
  getAllCart,
  createCart,
  updateCart,
  deleteCart
}
