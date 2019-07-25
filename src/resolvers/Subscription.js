import getUserId from '../utils/getUserId'

const Subscription = {
  channel: {
    subscribe(parent, args, { prisma }, info) {
      return prisma.subscription.channel(
        {
          where: {
            node: {
              title: args.title
            }
          }
        },
        info
      )
    }
  },
  myChannel: {
    subscribe(parent, args, { prisma, request }, info) {
      const userId = getUserId(request)

      return prisma.subscription.channel(
        {
          where: {
            node: {
              creator: {
                id: userId
              }
            }
          }
        },
        info
      )
    }
  },
  topic: {
    subscribe(parent, { channelId }, { prisma }, info) {
      return prisma.subscription.topic(
        {
          where: {
            node: {
              channel: {
                id: channelId
              }
            }
          }
        },
        info
      )
    }
  }
}

export { Subscription as default }
