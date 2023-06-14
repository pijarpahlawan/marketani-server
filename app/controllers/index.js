const login = require('./login')
const logout = require('./logout')
const register = require('./register')
const province = require('./province')
const city = require('./city')
const cost = require('./cost')
const { getAccount, updateAccount, updatePassword } = require('./account')
const {
  createProduct,
  deleteProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct
} = require('./product')

module.exports = {
  login,
  register,
  logout,
  province,
  city,
  cost,
  getAccount,
  updateAccount,
  updatePassword,
  createProduct,
  deleteProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct
}
