const express = require('express')
const { province, city, cost, getProfile } = require('../controllers')
const { updateProfile } = require('../controllers/profile')

const routes = express.Router()

// third party routes
routes.get('/province', province)
routes.get('/province/:provinceId', province)
routes.get('/province/:provinceId/city', city)
routes.get('/province/:provinceId/city/:cityId', city)
routes.get('/cost', cost)

// profile route
routes.get('/profile', getProfile)
routes.put('/profile', updateProfile)

module.exports = routes
