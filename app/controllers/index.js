const login = require('./login')
const logout = require('./logout')
const register = require('./register')
const province = require('./province')
const city = require('./city')
const cost = require('./cost')
const { getAccount, updateAccount, updatePassword } = require('./account')

module.exports = {
  login,
  register,
  logout,
  province,
  getAccount,
  updateAccount,
  updatePassword,
  city,
  cost
}
