input PostCreateInput {
  id: ID
  title: String!
  body: String!
  published: Boolean!
  author: UserCreateOneWithoutPostsInput!
  comments: CommentCreateManyWithoutPostInput
}

input RefreshTokenCreateInput {
  id: ID
  token: String!
  owner: UserCreateOneWithoutRefreshTokensInput!
}
