const cors = require('cors')
const express = require('express')
const { expressjwt } = require('express-jwt')
const cookieParser = require('cookie-parser')
const publicRoutes = require('./routes/public')
const protectedRoutes = require('./routes/protected')
const { host, port } = require('../config/network')

const app = express()

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
      const body = {
        code: err.status,
        status: 'Unauthorized',
        message: err.message
      }

      console.error(body)
      return res.status(body.code).json(body)
    }
  },
  protectedRoutes
)

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`)
})
