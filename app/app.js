const cors = require('cors')
const express = require('express')
const { expressjwt } = require('express-jwt')
const cookieParser = require('cookie-parser')
const publicRoutes = require('./routes/public')
const protectedRoutes = require('./routes/protected')
const { apiVersion, host, port, originAllowed } = require('../config/network')

const app = express()

const corsOptions = {
  origin: originAllowed,
  optionSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.use(
  `/${apiVersion}`,
  (req, res, next) => {
    res.setHeader('Content-Type', 'application/json')
    next()
  },
  publicRoutes
)
app.use(
  `/${apiVersion}`,
  expressjwt({
    secret: process.env.JWT_SECRET,
    getToken: (req) => req.cookies.marketaniAuthenticatedUser,
    algorithms: ['HS256']
  }),
  (req, res, next) => {
    res.setHeader('Content-Type', 'application/json')
    next()
  },
  protectedRoutes
)

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`)
})
