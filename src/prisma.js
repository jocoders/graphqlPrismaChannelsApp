import { Prisma } from 'prisma-binding'
import { fragmentReplacements } from './resolvers'

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  //endpoint: 'http://localhost:4466',
  endpoint: 'https://rn-city-dev-80415d33b2.herokuapp.com/rn-city-dev/dev',
  secret: 'thisisasecret',
  fragmentReplacements
})

export { prisma as default }
