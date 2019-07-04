import jsonwebtoken from 'jsonwebtoken'

function TokenGenerator(secretOrPrivateKey, secretOrPublicKey, options) {
  this.secretOrPrivateKey = secretOrPrivateKey
  this.secretOrPublicKey = secretOrPublicKey
  this.options = options //algorithm + keyid + noTimestamp + expiresIn + notBefore
}

TokenGenerator.prototype.sign = function(payload, signOptions) {
  const jwtSignOptions = Object.assign({}, signOptions, this.options)
  return jsonwebtoken.sign(payload, this.secretOrPrivateKey, jwtSignOptions)
}

// refreshOptions.verify = options you would use with verify function
// refreshOptions.jwtid = contains the id for the new token
TokenGenerator.prototype.refresh = function(token, refreshOptions) {
  console.log('token', token)
  console.log('refreshOptions', refreshOptions)
  console.log('secretOrPublicKey', this.secretOrPublicKey)
  console.log('refreshOptions.verify', refreshOptions.verify)

  const payload = jsonwebtoken.verify(token, this.secretOrPublicKey)
  console.log('payload', payload)
  delete payload.iat
  delete payload.exp
  delete payload.nbf
  delete payload.jti //We are generating a new token, if you are using jwtid during signing, pass it in refreshOptions
  const jwtSignOptions = Object.assign({}, this.options, {
    jwtid: refreshOptions.jwtid
  })
  // The first signing converted all needed options into claims, they are already in the payload
  return jsonwebtoken.sign(payload, this.secretOrPrivateKey, jwtSignOptions)
}

export { TokenGenerator as default }
