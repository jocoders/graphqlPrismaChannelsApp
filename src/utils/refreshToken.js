import jwt from 'jsonwebtoken'

const generateRefreshToken = (userPhone) => {
  const createdToken = jwt.sign({ userPhone }, 'thisisasecret', { expiresIn: '60 days' })
  return createdToken
}

export { generateRefreshToken as default }
