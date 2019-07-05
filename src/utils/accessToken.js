import jwt from 'jsonwebtoken'

const generateAccessToken = (userId, refreshTokenId) => {
  const createdToken = jwt.sign({ userId, refreshTokenId }, 'thisisasecret', { expiresIn: 1800 })
  return createdToken
}

export { generateAccessToken as default }
