import { makeExecutableSchema } from "graphql-tools";
import resolvers from "./resolvers";

const typeDefs = `
type Query {
  picture(_id: String!): Picture
  product(_id: String!): Product!
  order(_id: String!): Order!
  customer(_id: String!): Customer!
  vendor(_id: String!): Vendor!
  orderInfo(_id: String!): OrderInfo!
  user(_id: String!): User
  chatroom(_id: String!): Chatroom!
  message(_id: String!): Message!
  allChatrooms: [Chatroom!]
  allMessages: [Message!]
  allUsers: [User!]
  allProducts: [Product!]
  allOrders: [Order!]
  allCustomers: [Customer!]
  allOrderInfoes: [OrderInfo!]
  allVendors: [Vendor!]
  searchProductsAlgolia(
      query: String,
      page: Int,
      hitsPerPage: Int,
      filters: String,
      minWordSizefor1Type: Int,
      minWordSizefor2Types: Int,
      aroundLatLng: String,
      aroundRadius: Int,
      aroundPrecision: Int,
      minimumAroundRadius: Int,
      insideBoundingBox: [Float]
      insidePolygon: [Float]
  ): SearchProductsAlgoliaPayload
}

type Mutation {
  signUp(email: String!, name: String, password: String!): User!
  login(email: String!, password: String!): AuthPayload!
  signS3(filename: String!, filetype: String!): S3Payload!
  createPicture(name: String!, pictureUrl: String!, product: String, vendor: String, customer: String): Picture!
  updatePicture(_id: String!, name: String!, pictureUrl: String!): Picture!
  removePicture(_id: String!): Picture!
  createProduct(productInput: ProductInput!): Product!
  updateProduct(_id: String!, productInput: ProductInput!): Product!
  removeProduct(_id: String!): Product!
  createOrder(orderInput: OrderInput!): Order!
  updateOrder(_id: String!, OrderInput: OrderInput!): Order!
  removeOrder(_id: String!): Order!
  createOrderInfo(orderInfoInput: OrderInfoInput!): OrderInfo!
  updateOrderInfo(_id: String!, orderedBy: String, quantity: Int, product: String, order: String): OrderInfo!
  removeOrderInfo(_id: String!, customerId: String!): OrderInfo!
  createVendor(vendorInput: VendorInput!): Vendor!
  updateVendor(_id: String!, vendorInput: VendorInput!): Vendor!
  removeVendor(_id: String!): Vendor!
  createCustomer(customerInput: CustomerInput!): Customer!
  updateCustomer(_id: String!, customerInput: CustomerInput!): Customer!
  removeCustomer(_id: String!): Customer!
  addToCart(orderedBy: String!, product: String!, quantity: Int!): OrderInfo!
  createChatroom(chatroomInput: ChatroomInput!): Chatroom!
  removeChatroom(_id: String!): Chatroom!
  createMessage(messageInput: MessageInput!): Message!
}

type Subscription {
  productCreated: Product
  chatroomCreated(vendor: String!): Chatroom
  messageCreated(inChatroom: String!): Message
  orderInfoCreated: OrderInfo!
}

type Chatroom {
  _id: String!
  name: String
  customer: Customer!
  vendor: Vendor!
  messages: [Message!]
  createdAt: String!
  updatedAt: String!
}

input ChatroomInput {
  name: String!
  customer: String!
  vendor: String!
}

type Message {
  _id: String!
  from: User
  inChatroom: Chatroom
  content: String
  createdAt: String!
  updatedAt: String!
}

input MessageInput {
  from: String!
  inChatroom: String!
  content: String!
}

type AuthPayload {
  token: String!
  createdAt: String!
  updatedAt: String!
}

type S3Payload {
  signedRequest: String!
  url: String!
  createdAt: String!
  updatedAt: String!
}

type Picture {
  _id: String
  name: String!
  product: Product
  vendor: Vendor
  customer: Customer
  pictureUrl: String!
  createdAt: String!
  updatedAt: String!
}

type Product {
  _id: String
  name: String!
  description: String
  price: Float!
  inOrderInfoes: [OrderInfo!]
  tags: [String!]
  category: String!
  images: [Picture]
  vendor: Vendor
  createdAt: String!
  updatedAt: String!
}

input ProductInput {
  name: String!
  description: String
  price: Float!
  tags: [String!]
  category: String!
  images: [String!]
  vendor: String,
  customer: String,
  product: String
} 

type SearchProductsAlgoliaPayload {
   hits: [String],
   page: Int,
   nbHits: Int,
   nbPages: Int,
   hitPerPage: Int,
   processingTimeMS: Int,
   query: String,
   params: String
}

type Vendor {
  _id: String
  name: String
  description: String
  address: String
  phone: String
  pictures: [Picture]
  products: [Product]
  likedBy: [Customer]
  orders: [Order]
  chats: [Chatroom!]
  user: User
  createdAt: String!
  updatedAt: String!
}

input VendorInput {
  name: String
  description: String
  address: String
  phone: String
  pictures: [String!]
  products: [String!]
  orders: [String!]
}

type Customer {
  _id: String
  name: String
  email: String
  mobile: String
  mobileVerified: Boolean
  profilePicture: Picture
  likedVendors: [Vendor]
  cart: [OrderInfo]
  orders: [Order]
  chats: [Chatroom!]
  user: User
  createdAt: String!
  updatedAt: String!
}

input CustomerInput {
  name: String
  user: String!
  email: String
  mobile: String
  mobileVerified: Boolean
  profilePicture: String
  cart: [String!]
  orders: [String!]
}

type Order {
  _id: String!
  vendor: Vendor
  customer: Customer
  total: Float
  billingDetail: BillingDetail
  shippingDetail: ShippingDetail
  orderedItems: [OrderInfo]
  orderStatus: OrderStatus
  createdAt: String!
  updatedAt: String!
}

type BillingDetail {
  _id: String!
  firstName: String
  lastName: String
  companyName: String
  email: String
  mobile: String
  country: String
  city: String
  address: String
  customer: Customer
  createdAt: String!
  updatedAt: String!
}

type ShippingDetail {
  _id: String!
  firstName: String
  lastName: String
  companyName: String
  email: String
  mobile: String
  country: String
  city: String
  address: String
  customer: Customer
  createdAt: String!
  updatedAt: String!
}

input OrderInput {
  vendor: String!
  customer: String!
  billingDetail: String!
  shippingDetail: String!
  total: Float!
  orderedItems: [String!]!
  orderStatus: String!
}

type OrderInfo {
  _id: String!
  orderedBy: Customer!
  order: Order
  product: Product!
  quantity: Int!
  createdAt: String!
  updatedAt: String!
}

input OrderInfoInput {
  orderedBy: String!
  product: String!
  quantity: Int!
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

type User {
  _id: String
  name: String
  email: String
  vendor: Vendor
  message: Message
  customer: Customer
  googleId: String
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
