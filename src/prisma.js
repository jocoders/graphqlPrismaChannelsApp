import { Prisma } from 'prisma-binding'
import { fragmentReplacements } from './resolvers'

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  //endpoint: 'http://localhost:4466',
  endpoint: 'https://prisma-auth-app-8fd8167ed9.herokuapp.com/prisma-auth-app/dev',
  secret: 'thisisasecret',
  fragmentReplacements
})

export { prisma as default }
