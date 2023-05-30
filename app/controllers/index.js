const login = require('./login')
const logout = require('./logout')
const register = require('./register')
const province = require('./province')
const city = require('./city')
const cost = require('./cost')
const { getProfile, updateProfile } = require('./profile')

module.exports = {
  login,
  register,
  province,
  city,
  cost,
  getProfile,
  updateProfile,
  logout
}
