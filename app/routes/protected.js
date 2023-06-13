const express = require('express')
const {
  logout,
  getAccount,
  updateAccount,
  updatePassword,
  province,
  city,
  cost
} = require('../controllers')

const routes = express.Router()

routes.get('/logout', logout)

// account route
routes.get('/account', getAccount)
routes.put('/account', updateAccount)
routes.post('/account/password', updatePassword)

// third party routes
routes.get('/province', province)
routes.get('/province/:provinceId', province)
routes.get('/province/:provinceId/city', city)
routes.get('/province/:provinceId/city/:cityId', city)
routes.get('/cost', cost)

module.exports = routes
