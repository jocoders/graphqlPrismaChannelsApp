const jwt = require('jsonwebtoken')
const TOP_SECRET = 'asdffgh23456'
const EXPIRES_IN = 30 * 24 * 60 * 60 // 30 days in seconds

function createToken(user) {
  return jwt.sign(user, TOP_SECRET, { expiresIn: EXPIRES_IN, algorithm: 'HS512' })
}

function validateToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, TOP_SECRET, function(err, decoded) {
      if (err) {
        console.log('TOKEN ERROR')
        reject(err)
      } else {
        resolve(decoded)
      }
    })
  })
}

module.exports = {
  createToken: createToken,
  validateToken: validateToken
}
