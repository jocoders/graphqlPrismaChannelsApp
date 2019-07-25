import { extractFragmentReplacements } from 'prisma-binding'
import Query from './Query'
import Mutation from './Mutation'
import Subscription from './Subscription'
import User from './User'
import Channel from './Channel'
import Topic from './Topic'
import Message from './Message'
import RefreshToken from './RefreshToken'

const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  RefreshToken,
  Channel,
  Topic,
  Message
}

const fragmentReplacements = extractFragmentReplacements(resolvers)

export { resolvers, fragmentReplacements }
