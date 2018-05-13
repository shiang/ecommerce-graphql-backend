import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import mongoose from 'mongoose';
import schema from './data/schema';
import keys from './config/keys';
import { User } from "./data/models/user.model";
import { Picture } from "./data/models/picture.model";
import { Product } from "./data/models/product.model";
import { Customer } from "./data/models/customer.model";
import { Vendor } from "./data/models/vendor.model";
import { Order } from "./data/models/order.model";
import { OrderInfo } from "./data/models/orderInfo.model";
import jwt from 'jsonwebtoken';
import { logInSecret } from './config/keys';
import cors from 'cors';
import { createServer } from "http";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
require("dotenv").config();

//mongoose.connect(keys.mongoURI);
mongoose.connect(process.env.MONGO_URI)

// Initialize the app
const app = express();

const addUser = async(req, res) => {
  const token = req.header.authorization;
  try {
    const user = await jwt.verify(token, process.env.LOGIN_SECRET);
    req.user = user
  } catch(err) {
    console.log(err);
  }
  req.next();
};

app.use(cors('*'));
app.use(addUser);

// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress(req => ({ 
  schema,
  context: {
    User,
    Picture,
    Product,
    Customer,
    Vendor,
    Order,
    OrderInfo,
    SECRET: process.env.LOGIN_SECRET,
    user: req.user
  } 
})));

// GraphiQL, a visual editor for queries
app.use(
  "/graphiql",
  graphiqlExpress({
    endpointURL: "/graphql",
    subscriptionsEndpoint: "ws://localhost:4000/subscriptions"
  })
);

const server = createServer(app);

server.listen(4000, () => {
  console.log("Go to http://localhost:4000/graphiql to run queries!");
  new SubscriptionServer({
    execute,
    subscribe,
    schema,
  }, {
      server,
      path: '/subscriptions',
    });
});

// Start the server
// app.listen(3000, () => {
//   console.log('Go to http://localhost:3000/graphiql to run queries!');
// });