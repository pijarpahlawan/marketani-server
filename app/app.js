const express = require('express')
const cors = require('cors')
const { expressjwt } = require('express-jwt')
const cookieParser = require('cookie-parser')
const qs = require('qs')
const publicRoutes = require('./routes/public')
const protectedRoutes = require('./routes/protected')
const { host, port } = require('../config/network')

const app = express()

app.set('query parser', (str) => qs.parse(str, { arrayLimit: 1000 }))

// TODO: give environment variable to cors origin
// TODO: Loging in sequelize, please turn off when in production
// ! RETRIVE ONLY COLUMN NEEDED
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(cookieParser())
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  next()
})

app.use(publicRoutes)
app.use(
  expressjwt({
    secret: process.env.JWT_SECRET,
    getToken: (req) => req.cookies.marketaniAuthenticatedUser,
    algorithms: ['HS256']
  }),
  (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      const response = {
        code: err.status,
        status: 'Unauthorized',
        message: err.message
      }

      console.error(response)
      return res.status(response.code).json(response)
    }
  },
  protectedRoutes
)

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`)
})
