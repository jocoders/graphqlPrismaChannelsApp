import { extractFragmentReplacements } from 'prisma-binding'
import Query from './Query'
import Mutation from './Mutation'
import Subscription from './Subscription'
import User from './User'
import Post from './Post'
import Comment from './Comment'
import RefreshToken from './RefreshToken'

const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Post,
  RefreshToken,
  Comment
}

const fragmentReplacements = extractFragmentReplacements(resolvers)

export { resolvers, fragmentReplacements }
