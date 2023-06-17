const { Sequelize, ValidationError, Transaction, Op } = require('sequelize')
const {
  Product,
  Transaction: TransactionModel,
  TransactionDetail,
  Cart
} = require('../models')
const env = process.env.NODE_ENV || 'development'
const dbConfig = require('../../config/database')[env]

/**
 * Get all transactions
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getAllTransaction = async (req, res) => {
  const sequelize = new Sequelize(dbConfig)

  try {
    const { userId } = req.auth

    const transactions = await sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED },
      async (t) => {
        return await TransactionModel.findAll({
          where: { buyerid: userId },
          transaction: t,
          include: Product
        })
      }
    )

    // trow error if no product found
    if (Object.keys(transactions).length === 0) {
      throw new ValidationError('No transactions found')
    }

    const response = {
      code: 200,
      status: 'Ok',
      data: transactions
    }

    return res.status(response.code).json(response)
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

const createTransaction = async (req, res) => {
  const sequelize = new Sequelize(dbConfig)

  try {
    const { userId } = req.auth
    const { cart, courierId, courierCost, totalPrice } = req.body

    await sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED },
      async (t) => {
        // create transaction data
        const transaction = await TransactionModel.create(
          {
            courierId,
            courierCost,
            totalPrice,
            buyerid: userId
          },
          { transaction: t }
        )

        // iterate product in cart
        for (const item of cart) {
          // validate product
          const product = await Product.findOne({
            transaction: t,
            where: { id: item.id }
          })

          if (!product) {
            throw new ValidationError('Product not found')
          }

          if (product.stock < item.quantity) {
            throw new ValidationError('Product out of stock')
          }

          // update product stock
          await product.update(
            { stock: product.stock - item.quantity },
            { transaction: t }
          )

          // create transaction detail
          await TransactionDetail.create(
            {
              productId: item.id,
              transactionId: transaction.transactionId,
              quantity: item.quantity
            },
            { transaction: t }
          )

          // delete product from cart
          await Cart.destroy({
            where: {
              [Op.and]: [{ productId: item.id }, { buyerId: userId }]
            }
          })
        }
      }
    )

    const response = {
      code: 201,
      status: 'Created',
      message: 'Transaction created'
    }

    return res.status(response.code).json(response)
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

module.exports = { getAllTransaction, createTransaction }
