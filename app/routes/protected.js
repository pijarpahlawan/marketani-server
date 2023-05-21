const express = require('express')
const { province, city, cost } = require('../controllers')

const routes = express.Router()

// third party routes
routes.get('/province', province)
routes.get('/province/:provinceId', province)
routes.get('/province/:provinceId/city', city)
routes.get('/province/:provinceId/city/:cityId', city)
routes.get('/cost', cost)

module.exports = routes
