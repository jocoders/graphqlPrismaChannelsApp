import jwt from 'jsonwebtoken'

const generateToken = (userId, tokenTime) => {
  const createdToken = jwt.sign({ userId }, 'thisisasecret', { expiresIn: tokenTime })
  return createdToken
}

export { generateToken as default }
