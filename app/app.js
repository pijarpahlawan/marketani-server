const cors = require('cors')
const express = require('express')
const { expressjwt } = require('express-jwt')
const routes = require('./routes')
const { apiVersion, host, port, originAllowed } = require('../config/network')

const app = express()

const corsOptions = {
  origin: originAllowed
}

// middleware
app.use(cors(corsOptions))
app.use(express.json())
app.use(
  expressjwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }).unless({
    path: [`/${apiVersion}/register`, `/${apiVersion}/login`]
  })
)

app.use(`/${apiVersion}`, routes)
app.get('/', (req, res) => {
  res.status(302).redirect(`/${apiVersion}`)
})

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`)
})
