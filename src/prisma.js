import { Prisma } from 'prisma-binding'
import { fragmentReplacements } from './resolvers'

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466',
  endpoint: 'https://prisma-auth-app-e7b7691557.herokuapp.com/prisma-auth-app/dev',
  secret: 'thisisasecret',
  fragmentReplacements
})

export { prisma as default }
