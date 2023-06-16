const { Sequelize, ValidationError, Transaction, Op } = require('sequelize')
const { Product } = require('../models')
const env = process.env.NODE_ENV || 'development'
const dbConfig = require('../../config/database')[env]

/**
 * Get all products
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getAllProduct = async (req, res) => {
  const sequelize = new Sequelize(dbConfig)

  try {
    const { search = '' } = req.query

    // search product by name
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

    // trow error if no product found
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

/**
 * Get a single product
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getSingleProduct = async (req, res) => {
  const sequelize = new Sequelize(dbConfig)

  try {
    const { productId } = req.params

    // Get product information
    const product = await sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED },
      async (t) => {
        return await Product.findByPk(productId, {
          transaction: t,
          include: 'seller'
        })
      }
    )

    // throw error if no product found
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

/**
 * Create a new product
 * @param {*} req
 * @param {*} res
 * @returns
 */
const createProduct = async (req, res) => {
  const sequelize = new Sequelize(dbConfig)

  try {
    const { userId } = req.auth
    const { productName, description, weight, stock, price } = req.body

    // validate request body
    const { error } = Product.validate(req.body)

    if (error !== undefined) {
      throw new ValidationError(error.message)
    }

    // create new product
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

/**
 * Update a product
 * @param {*} req
 * @param {*} res
 * @returns
 */
const updateProduct = async (req, res) => {
  const sequelize = new Sequelize(dbConfig)

  try {
    const { productId } = req.params
    const { productName, description, weight, stock, price } = req.body

    // validate request body
    const { error } = Product.validate(req.body)

    if (error !== undefined) {
      throw new ValidationError(error.message)
    }

    // update product
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

/**
 * Delete a product
 * @param {*} req
 * @param {*} res
 * @returns
 */
const deleteProduct = async (req, res) => {
  const sequelize = new Sequelize(dbConfig)

  try {
    const { productId } = req.params

    // delete product
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
