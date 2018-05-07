import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `
type Query {
  author(_id: String!): Author
  post(_id: String!): Post
  allAuthors: [Author]!
  allPosts: [Post]!
}
type Mutation {
  createAuthor(firstName: String!, lastName: String, posts: [String]): Author
  createPost(title: String!, text: String, views: Int, author: String): Post
  signUp(email: String!, name: String, password: String!): User!
  login(email: String!, password: String!): String!
}

type Token {
  token: String
}

type Author {
  _id: String
  firstName: String
  lastName: String
  posts: [Post]
}
type Post {
  _id: String
  title: String
  text: String
  views: Int
  author: Author
}
type User {
  _id: String
  name: String!
  email: String!
  createdAt: String!
  updatedAt: String!
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });


export default schema;