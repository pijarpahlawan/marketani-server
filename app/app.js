const cors = require('cors')
const express = require('express')
const { expressjwt } = require('express-jwt')
const publicRoutes = require('./routes/public')
const protectedRoutes = require('./routes/protected')
const { apiVersion, host, port, originAllowed } = require('../config/network')
const cookieParser = require('cookie-parser')

const app = express()

const corsOptions = {
  origin: originAllowed,
  optionSuccessStatus: 200
}

// middleware
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.use(`/${apiVersion}`, publicRoutes)
app.use(
  `/${apiVersion}`,
  expressjwt({
    secret: process.env.JWT_SECRET,
    getToken: (req) => req.cookies.marketaniAuthenticatedUser,
    algorithms: ['HS256']
  }),
  protectedRoutes
)

app.get('/', (req, res) => {
  res.status(302).redirect(`/${apiVersion}`)
})

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`)
})
