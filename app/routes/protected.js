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
  deleteProduct,
  getAllCart,
  createCart,
  updateCart,
  deleteCart,
  updateAvatar
} = require('../controllers')

const routes = express.Router()

routes.get('/logout', logout)

// account route
routes.get('/profile', getProfile)
routes.put('/profile', updateProfile)
routes.post('/profile/password', updatePassword)
routes.post('/profile/avatar', updateAvatar)

// third party routes
routes.get('/province', province)
routes.get('/province/:provinceId/city', city)
routes.get('/province/city', city)
routes.get('/cost', cost)

// product routes
routes.post('/product', createProduct)
routes.get('/product', getAllProduct)
routes.get('/product/:productId', getSingleProduct)
routes.put('/product/:productId', updateProduct)
routes.delete('/product', deleteProduct)

// cart routes
routes.get('/cart', getAllCart)
routes.post('/cart', createCart)
routes.put('/cart', updateCart)
routes.delete('/cart', deleteCart)

module.exports = routes
