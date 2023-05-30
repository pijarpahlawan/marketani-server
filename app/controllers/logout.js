const logout = async (req, res) => {
  const body = {
    code: 200,
    status: 'OK',
    message: 'Success',
    data: null
  }

  res.clearCookie('marketaniAuthenticatedUser')

  return res.status(200).json(body)
}

module.exports = logout
