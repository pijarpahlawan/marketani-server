const { Sequelize, ValidationError, Transaction, Op } = require('sequelize')
const { Product } = require('../models')
const env = process.env.NODE_ENV || 'development'
const dbConfig = require('../../config/database')[env]

const getAllProduct = async (req, res) => {
  const sequelize = new Sequelize(dbConfig)

  try {
    const { search = '' } = req.query

    const products = await sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED },
      async (t) => {
        return await Product.findAll(
          {
            where: {
              productName: {
                [Op.like]: `%${search}%`
              }
            },
            include: 'seller'
          },
          { transaction: t }
        )
      }
    )

    if (Object.keys(products).length === 0) {
      throw new ValidationError('No products found')
    }

    const response = {
      code: 200,
      status: 'Ok',
      data: products
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

    console.log(response)

    return res.status(response.code).json(response)
  }
}

const getSingleProduct = async (req, res) => {
  const sequelize = new Sequelize(dbConfig)

  try {
    const { productId } = req.params

    const product = await sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED },
      async (t) => {
        return await Product.findByPk(productId, {
          transaction: t,
          include: 'seller'
        })
      }
    )

    if (product === null) {
      throw new ValidationError('No products found')
    }

    const response = {
      code: 200,
      status: 'Ok',
      data: product
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

    console.log(response)

    return res.status(response.code).json(response)
  }
}

const createProduct = async (req, res) => {
  const sequelize = new Sequelize(dbConfig)

  try {
    const { userId } = req.auth
    const { productName, description, weight, stock, price } = req.body

    const { error } = Product.validate(req.body)

    if (error !== undefined) {
      throw new ValidationError(error.message)
    }

    await sequelize.transaction(
      {
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
      },
      async (t) => {
        await Product.create(
          {
            productName,
            description,
            weight,
            stock,
            price,
            sellerId: userId
          },
          { transaction: t }
        )
      }
    )

    const response = {
      code: 201,
      status: 'Created',
      message: 'Product successfully created'
    }

    return res.status(response.code).json(response)
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

    console.log(response)

    return res.status(response.code).json(response)
  }
}

const updateProduct = async (req, res) => {
  const sequelize = new Sequelize(dbConfig)

  try {
    const { productId } = req.params
    const { productName, description, weight, stock, price } = req.body

    const { error } = Product.validate(req.body)

    if (error !== undefined) {
      throw new ValidationError(error.message)
    }

    await sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED },
      async (t) => {
        await Product.update(
          {
            productName,
            description,
            weight,
            stock,
            price
          },
          {
            where: {
              productId
            }
          },
          { transaction: t }
        )
      }
    )

    const response = {
      code: 200,
      status: 'Ok',
      message: 'Product successfully updated'
    }

    return res.status(response.code).json(response)
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

    console.log(response)

    return res.status(response.code).json(response)
  }
}

const deleteProduct = async (req, res) => {
  const sequelize = new Sequelize(dbConfig)

  try {
    const { productId } = req.params

    await sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED },
      async (t) => {
        await Product.destroy(
          {
            where: {
              productId
            }
          },
          { transaction: t }
        )
      }
    )

    const response = {
      code: 200,
      status: 'Ok',
      message: 'Product successfully deleted'
    }

    return res.status(response.code).json(response)
  } catch (error) {
    error.code = 500
    error.status = 'Internal Server Error'

    const response = {
      code: error.code,
      status: error.status,
      message: error.message
    }

    console.log(response)

    return res.status(response.code).json(response)
  }
}

module.exports = {
  getAllProduct,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct
}
