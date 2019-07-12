import jwt from 'jsonwebtoken'

const generateRefreshToken = (userId) => {
  const createdToken = jwt.sign({ userId }, 'thisisasecret', { expiresIn: '60 days' })
  return createdToken
}

export { generateRefreshToken as default }
