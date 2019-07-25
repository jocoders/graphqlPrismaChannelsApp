import getUserId from '../utils/getUserId'

const Query = {
  async channel(parent, args, { prisma, request }, info) {
    const userId = getUserId(request, false)

    const channel = await prisma.query.channels(
      {
        where: {
          id: args.id,
          OR: [
            {
              title: args.title
            },
            {
              creator: {
                id: userId
              }
            }
          ]
        }
      },
      info
    )

    if (channels.length === 0) {
      throw new Error('Channel not found')
    }

    return channels[0]
  },
  channels(parent, args, { prisma }, info) {
    const opArgs = {}

    if (args.query) {
      opArgs.where = {
        OR: [
          {
            title_contains: args.query
          },
          {
            cover_contains: args.query
          }
        ]
      }
    }
    return prisma.query.channels(opArgs, info)
  },
  me(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    return prisma.query.user({
      where: {
        id: userId
      }
    })
  },
  myChannels(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const opArgs = {
      where: {
        creator: {
          id: userId
        }
      }
    }
    if (args.query) {
      opArgs.where.OR = [
        {
          title_contains: args.query
        },
        {
          cover_contains: args.query
        }
      ]
    }
    return prisma.query.channels(opArgs, info)
  },
  myTopics(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const opArgs = {
      where: {
        creator: {
          id: userId
        }
      }
    }
    if (args.query) {
      opArgs.where.OR = [
        {
          title_contains: args.query
        },
        {
          cover_contains: args.query
        }
      ]
    }
    return prisma.query.topics(opArgs, info)
  },
  async user(parent, args, { prisma }, info) {
    const opArgs = { where: { phone: args.query } }

    const user = await prisma.query.user({
      where: {
        phone: args.query
      }
    })

    if (!user) {
      throw new Error('User is not exists')
    }

    return prisma.query.user(opArgs, info)
  },
  users(parent, args, { prisma }, info) {
    const opArgs = {}

    if (args.query) {
      opArgs.where = {
        OR: [
          {
            name_contains: args.query
          },
          {
            phone_contains: args.query
          }
        ]
      }
    }

    return prisma.query.users(opArgs, info)
  },
  topics(parent, args, { prisma }, info) {
    return prisma.query.topics(null, info)
  }
}

export { Query as default }
