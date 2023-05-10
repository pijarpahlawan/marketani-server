const express = require('express')
const root = require('./controllers/root')
require('dotenv').config()

const routes = express.Router()

// root route
routes.get('/', root)

module.exports = routes
