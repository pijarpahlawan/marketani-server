const express = require('express')
const { login, register } = require('../controllers')

const routes = express.Router()

// authentication routes
routes.post('/register', register)
routes.post('/login', login)

module.exports = routes
