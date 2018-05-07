import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import mongoose from 'mongoose';
import schema from './data/schema';
import keys from './config/keys';
import { Author } from './data/models/author.model';
import { Post } from './data/models/post.model';
import { User } from "./data/models/user.model";

mongoose.connect(keys.mongoURI);

// Initialize the app
const app = express();

// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({ 
  schema,
  context: {
    Author,
    Post,
    User,
    SECRET: keys.logInSecret
  } 
}));

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

// Start the server
app.listen(3000, () => {
  console.log('Go to http://localhost:3000/graphiql to run queries!');
});