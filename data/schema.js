import { makeExecutableSchema } from "graphql-tools";
import resolvers from "./resolvers";

const typeDefs = `
type Query {
  author(_id: String!): Author
  post(_id: String!): Post
  allAuthors: [Author]!
  allPosts: [Post]!
  user: User
  getPicture(_id: String!): Picture
}
type Mutation {
  createAuthor(firstName: String!, lastName: String, posts: [String]): Author
  createPost(title: String!, text: String, views: Int, author: String): Post
  signUp(email: String!, name: String, password: String!): User!
  login(email: String!, password: String!): AuthPayload!
  signS3(filename: String!, filetype: String!): S3Payload!
  createPicture(name: String!, pictureUrl: String!): Picture!
}

type Subscription {
  postCreated: Post
}

type AuthPayload {
  token: String!
}

type S3Payload {
  signedRequest: String!
  url: String!
}

type Picture {
  _id: String
  name: String!
  pictureUrl: String!
  createdAt: String!
  updatedAt: String!
}

type Product {
  _id: String
  name: String!
  description: String
  price: Float
  tags: [String!]
  type: String
  images: [Picture]
  vendor: Vendor
}

type Vendor {
  _id: String
  name: String
  description: String
  address: String
  phone: String
  pictures: [Picture]
  products: [Product]
  orders: [Order]
}

type Customer {
  _id: String
  name: String
  email: String
  mobile: String
  mobileVerified: Boolean
  profilePicture: Picture
  orders: [Order]
}

type Order {
  _id: String
  vendor: Vendor
  customer: Customer
  total: Float
  orderedItems: [OrderInfo]
  orderStatus: OrderStatus
}

type OrderInfo {
  _id: String
  orderedFrom: Vendor
  orderedBy: Customer
  product: Product
  quantity: Int

}

enum OrderStatus {
  IsAccepted
  IsPreparing
  IsDelivered
  IsCancelled
  IsPickedUp
  ReadyForDelivery
  ReadyForPickup
  NewOrder
  IsConfirming
}

type Author {
  _id: String
  firstName: String
  lastName: String
  posts: [Post]
  createdAt: String!
  updatedAt: String!
}

type Post {
  _id: String
  title: String
  text: String
  views: Int
  author: Author
  createdAt: String!
  updatedAt: String!
}

type User {
  _id: String
  name: String!
  email: String!
  createdAt: String!
  updatedAt: String!
}

schema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
