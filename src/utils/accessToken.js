import jwt from 'jsonwebtoken'

const generateAccessToken = (userId, refreshTokenId) => {
  const createdToken = jwt.sign({ userId, refreshTokenId }, 'thisisasecret', { expiresIn: 1120 })
  return createdToken
}

export { generateAccessToken as default }
