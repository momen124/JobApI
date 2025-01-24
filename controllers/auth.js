const { StatusCodes } = require('http-status-codes')
const { registerUser, loginUser } = require('../services/authService')

// Register Controller
const register = async (req, res) => {
  const { user, token } = await registerUser(req.body)

  // Shape the response as needed
  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
    },
    token,
  })
}

// Login Controller
const login = async (req, res) => {
  const { email, password } = req.body
  const { user, token } = await loginUser(email, password)

  // Shape the response as needed
  res.status(StatusCodes.OK).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
    },
    token,
  })
}

module.exports = {
  register,
  login,
}
