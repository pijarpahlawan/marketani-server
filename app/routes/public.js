const express = require('express')
const {
  root,
  login,
  register,
  province,
  city,
  cost
} = require('../controllers')

const routes = express.Router()

// root route
routes.get('/', root)

// authentication routes
routes.post('/register', register)
routes.post('/login', login)

// third party routes
routes.get('/province', province)
routes.get('/province/:provinceId', province)
routes.get('/province/:provinceId/city', city)
routes.get('/province/:provinceId/city/:cityId', city)
routes.get('/cost', cost)

module.exports = routes
