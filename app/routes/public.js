const express = require('express')
const { root, login, register } = require('../controllers')

const routes = express.Router()

// root route
routes.get('/', root)

// authentication routes
routes.post('/register', register)
routes.post('/login', login)

module.exports = routes
