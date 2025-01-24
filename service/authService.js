const User = require('../models/User')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const registerUser = async (userData) => {
  // Create user
  const user = await User.create(userData)
  // Generate token
  const token = user.createJWT()

  // Return both user and token so the controller can shape the response
  return { user, token }
}

const loginUser = async (email, password) => {
  // Basic checks
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }

  // Find user
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials')
  }

  // Compare password
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials')
  }

  // Generate token
  const token = user.createJWT()

  // Return both user and token so the controller can shape the response
  return { user, token }
}

module.exports = {
  registerUser,
  loginUser,
}
