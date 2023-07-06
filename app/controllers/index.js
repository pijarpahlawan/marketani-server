const city = require('./city')
const cost = require('./cost')
const province = require('./province')
const register = require('./register')
const login = require('./login')
const logout = require('./logout')
const {
  getProfile,
  updateProfile,
  updatePassword,
  updateAvatar
} = require('./profile')
const {
  getAllProduct,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('./product')
const { getAllCart, createCart, updateCart, deleteCart } = require('./cart')

module.exports = {
  province,
  city,
  cost,
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  updatePassword,
  updateAvatar,
  getAllProduct,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllCart,
  createCart,
  updateCart,
  deleteCart
}
