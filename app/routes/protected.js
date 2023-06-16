const express = require('express')
const {
  province,
  city,
  cost,
  logout,
  getProfile,
  updateProfile,
  updatePassword,
  getAllProduct,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers')

const routes = express.Router()

routes.get('/logout', logout)

// account route
routes.get('/profile', getProfile)
routes.put('/profile', updateProfile)
routes.post('/profile/password', updatePassword)

// third party routes
routes.get('/province', province)
routes.get('/province/:provinceId', province)
routes.get('/province/:provinceId/city', city)
routes.get('/province/:provinceId/city/:cityId', city)
routes.get('/cost', cost)

// product routes
routes.post('/product', createProduct)
routes.get('/product', getAllProduct)
routes.get('/product/:productId', getSingleProduct)
routes.put('/product/:productId', updateProduct)
routes.delete('/product/:productId', deleteProduct)

module.exports = routes
