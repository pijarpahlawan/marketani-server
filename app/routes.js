const express = require('express')
const { root, login, register } = require('./controllers')
require('dotenv').config()

const routes = express.Router()

// root route
routes.get('/', root)

// authentication route
routes.post('/register', register)
routes.post('/login', login)

module.exports = routes
