require('dotenv').config()

module.exports = {
  apiVersion: process.env.API_VERSION || 'v1',
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000,
  originAllowed:
    process.env.ORIGIN_ALLOWED ||
    `http://${process.env.HOST}:${process.env.PORT}`
}
