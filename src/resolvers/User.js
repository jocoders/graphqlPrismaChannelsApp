import getUserId from '../utils/getUserId'

const User = {
  channels: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, { prisma }, info) {
      return prisma.query.channels({
        where: {
          creator: {
            id: parent.id
          }
        }
      })
    }
  },
  email: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, { request }, info) {
      const userId = getUserId(request, false)

      if (userId && userId === parent.id) {
        return parent.email
      } else {
        return null
      }
    }
  }
}

export { User as default }
