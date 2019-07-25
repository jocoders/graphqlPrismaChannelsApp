import { Prisma } from 'prisma-binding'
import { fragmentReplacements } from './resolvers'

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466',
  endpoint: 'https://channels-54c9d5c256.herokuapp.com/channels-botics/dev',
  secret: 'thisisasecret',
  fragmentReplacements
})

export { prisma as default }
