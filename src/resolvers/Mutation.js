import fetch from 'node-fetch'
import jwt from 'jsonwebtoken'
import jwtDecode from 'jwt-decode'
import GQLError from '../utils/GQLError.js'
import getUserId from '../utils/getUserId'
import generateAccessToken from '../utils/accessToken'
import generateRefreshToken from '../utils/refreshToken'

const FB_APP_ID = '315261496071780'
const FB_APP_SECRET = 'e3f01ca5a52668c568490fc7bc385067'
const FB_ACCESS_URL = 'https://graph.accountkit.com/v1.3/access_token'
const FB_ME_URL = 'https://graph.accountkit.com/v1.3/me'

async function getFBAccessTokenByFBCode(code) {
  console.log('code', code)
  const url = `https://graph.accountkit.com/v1.3/access_token?grant_type=authorization_code&code=${code}&access_token=AA|${FB_APP_ID}|${FB_APP_SECRET}`
  const accessFBToken = (await (await fetch(url)).json()).access_token
  return accessFBToken
}

async function getPhoneByFacebookAccessToken(token, appSecret) {
  const url = `https://graph.accountkit.com/v1.3/me/?access_token=${token}`
  const phoneNumber = (await (await fetch(url)).json()).phone.number
  return phoneNumber
}

const Mutation = {
  async createChannel(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    return await prisma.mutation.createChannel(
      {
        data: {
          title: args.data.title,
          cover: args.data.cover,
          creator: {
            connect: {
              id: userId
            }
          }
        }
      },
      info
    )
  },
  async createMessage(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const topicExists = await prisma.exists.Topic({
      id: args.data.topic
    })

    if (!topicExists) {
      throw new Error('Unable to find topic')
    }

    return prisma.mutation.createMessage(
      {
        data: {
          text: args.data.text,
          creator: {
            connect: {
              id: userId
            }
          },
          topic: {
            connect: {
              id: args.data.topic
            }
          }
        }
      },
      info
    )
  },
  async createUser(parent, args, { prisma }, info) {
    const phoneTaken = await prisma.exists.User({ phone: args.data.phone })
    if (phoneTaken) {
      log.warn('Phone alredy taken')
      throw new GQLError({ message: 'Phone already taken', code: 404 })
    }

    const user = await prisma.mutation.createUser({
      data: {
        phone: args.data.phone
      }
    })
    console.log('user', user)
    const refreshToken = await prisma.mutation.createRefreshToken({
      data: {
        token: generateRefreshToken(user.id),
        owner: {
          connect: {
            id: user.id
          }
        }
      }
    })
    console.log('refreshToken', refreshToken)
    return {
      user,
      refreshToken: refreshToken.token,
      accessToken: generateAccessToken(user.id, refreshToken.id)
    }
  },
  async createTopic(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const channelExists = await prisma.exists.Channel({
      id: args.data.channel
    })

    if (!channelExists) {
      throw new Error('Unable to find channel')
    }

    return prisma.mutation.createTopic(
      {
        data: {
          title: args.data.title,
          avatar: args.data.avatar,
          creator: {
            connect: {
              id: userId
            }
          },
          channel: {
            connect: {
              id: args.data.channel
            }
          }
        }
      },
      info
    )
  },

  async deleteChannel(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const channelExists = await prisma.exists.Channel({
      id: args.id,
      creator: {
        id: userId
      }
    })

    if (!channelExists) {
      throw new Error('Unable to delete channel')
    }

    return prisma.mutation.deleteChannel(
      {
        where: {
          id: args.id
        }
      },
      info
    )
  },
  async deleteMessage(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const messageExists = await prisma.exists.Message({
      id: args.id,
      creator: {
        id: userId
      }
    })

    if (!messageExists) {
      throw new Error('Unable to delete message')
    }

    return prisma.mutation.deleteMessage(
      {
        where: {
          id: args.id
        }
      },
      info
    )
  },
  deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    console.log('userId', userId)

    return prisma.mutation.deleteUser(
      {
        where: {
          id: userId
        }
      },
      info
    )
  },
  async deleteTopic(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const topicExists = await prisma.exists.Topic({
      id: args.id,
      creator: {
        id: userId
      }
    })

    if (!topicExists) {
      throw new Error('Unable to delete topic')
    }

    return prisma.mutation.deleteTopic(
      {
        where: {
          id: args.id
        }
      },
      info
    )
  },

  async updateChannel(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const channelExists = await prisma.exists.Channel({
      id: args.id,
      creator: {
        id: userId
      }
    })

    if (!channelExists) {
      throw new Error('Unable to update channel')
    }

    return prisma.mutation.updateChannel(
      {
        where: {
          id: args.id
        },
        data: args.data
      },
      info
    )
  },
  async updateMessage(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const messageExists = await prisma.exists.Message({
      id: args.id,
      creator: {
        id: userId
      }
    })

    if (!messageExists) {
      throw new Error('Unable to update message')
    }

    return prisma.mutation.updateMessage(
      {
        where: {
          id: args.id
        },
        data: args.data
      },
      info
    )
  },
  async updateTokens(parent, args, { prisma }, info) {
    console.log('args.refreshToken', args.refreshToken)
    const decodeRefreshToken = jwt.verify(args.refreshToken, 'thisisasecret')
    const user = await prisma.query.user({
      where: {
        id: decodeRefreshToken.userId
      }
    })
    console.log('user', user)

    if (!user) {
      log.warn('Wrong JWT token validation attempt')
      throw new GQLError({ message: 'User not found', code: 404 })
    }

    const refreshToken = await prisma.query.refreshToken({
      where: {
        id: args.refreshTokenId
      }
    })
    console.log('refreshToken', refreshToken)

    if (!refreshToken) {
      log.warn('Wrong JWT token validation attempt')
      throw new GQLError({ message: 'User not found', code: 404 })
    }
    if (args.refreshToken === refreshToken.token) {
      console.log('Go to!!!')
      const deleteRefreshToken = await prisma.mutation.deleteRefreshToken({
        where: {
          id: refreshToken.id
        }
      })
      const newRefreshToken = await prisma.mutation.createRefreshToken({
        data: {
          token: generateRefreshToken(user.id),
          owner: {
            connect: {
              id: user.id
            }
          }
        }
      })
      console.log('newRefreshToken', newRefreshToken)
      console.log('newRefreshToken.id', newRefreshToken.id)
      return {
        user,
        refreshToken: newRefreshToken.token,
        accessToken: generateAccessToken(user.id, newRefreshToken.id)
      }
    }
  },
  async updateTopic(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const topicExists = await prisma.exists.Topic({
      id: args.id,
      creator: {
        id: userId
      }
    })

    if (!topicExists) {
      throw new Error('Unable to update topic')
    }

    return prisma.mutation.updateTopic(
      {
        where: {
          id: args.id
        },
        data: args.data
      },
      info
    )
  },
  updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    return prisma.mutation.updateUser(
      {
        where: {
          id: userId
        },
        data: args.data
      },
      info
    )
  },

  async signIn(parent, { code }, { prisma }, info) {
    const accessFBToken = await getFBAccessTokenByFBCode(code)
    console.log('accessFBToken', accessFBToken)
    const phone = await getPhoneByFacebookAccessToken(accessFBToken)
    console.log('phone', phone)
    const user = await prisma.query.user({
      where: {
        phone
      }
    })
    console.log('user', user)

    if (!user) {
      const createdUser = await prisma.mutation.createUser({
        data: {
          phone
        }
      })
      const refreshToken = await prisma.mutation.createRefreshToken({
        data: {
          token: generateRefreshToken(createdUser.id),
          owner: {
            connect: {
              id: createdUser.id
            }
          }
        }
      })
      return {
        user: createdUser,
        refreshToken: refreshToken.token,
        accessToken: generateAccessToken(createdUser.id, refreshToken.id)
      }
    } else {
      const refreshToken = await prisma.mutation.createRefreshToken({
        data: {
          token: generateRefreshToken(user.id),
          owner: {
            connect: {
              id: user.id
            }
          }
        }
      })
      return {
        user: user,
        refreshToken: refreshToken.token,
        accessToken: generateAccessToken(user.id, refreshToken.id)
      }
    }
  },
  async signOut(parent, args, { prisma }, info) {
    console.log('args.refreshToken', args.refreshToken)
    console.log('args.refreshTokenId', args.refreshTokenId)
    const verifyRefreshToken = jwt.verify(args.refreshToken, 'thisisasecret')

    const user = await prisma.query.user({
      where: {
        id: verifyRefreshToken.userId
      }
    })
    console.log('user', user)

    if (!user) {
      log.warn('Wrong JWT token validation attempt')
      throw new GQLError({ message: 'User not found', code: 404 })
    }

    const deleteRefreshToken = await prisma.mutation.deleteRefreshToken({
      where: {
        id: args.refreshTokenId
      }
    })
    return {
      user: user,
      signedOut: true
    }
  }
}

export { Mutation as default }
