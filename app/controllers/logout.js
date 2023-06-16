/**
 * Logout user
 * @param {*} req
 * @param {*} res
 * @returns
 */
const logout = async (req, res) => {
  try {
    const response = {
      code: 200,
      status: 'Ok',
      message: 'Logout success'
    }

    // clear cookie
    res.clearCookie('marketaniAuthenticatedUser')

    return res.status(200).json(response)
  } catch (error) {
    error.code = 500

    const response = {
      code: error.code,
      status: 'Internal Server Error',
      message: error.message
    }

    console.error(response)
    return res.status(response.code).json(response)
  }
}

module.exports = logout
