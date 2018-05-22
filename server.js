import express from "express";
import bodyParser from "body-parser";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import mongoose from "mongoose";
import schema from "./data/schema";
import { User } from "./data/models/user.model";
import { Picture } from "./data/models/picture.model";
import { Product } from "./data/models/product.model";
import { Customer } from "./data/models/customer.model";
import { Vendor } from "./data/models/vendor.model";
import { Order } from "./data/models/order.model";
import { OrderInfo } from "./data/models/orderInfo.model";
import { Chatroom } from "./data/models/chatroom.model";
import { Message } from "./data/models/message.model";
import jwt from "jsonwebtoken";
import cors from "cors";
import { createServer } from "http";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import cookieSession from "cookie-session";
require("now-env");

//const CORS = require("micro-cors")();

//mongoose.connect(keys.mongoURI);
mongoose.connect(process.env.MONGO_URL);

// Initialize the app
const app = express();
app.use(cors({
  credentials: true,
  origin: 'https://ur-shop-graphql-client.now.sh'
}));

const addUser = async (req, res) => {
  const token = req.headers.authorization;

  try {
    const user = await jwt.verify(token, process.env.LOGIN_SECRET);
    req.user = user;
  } catch (err) {
    console.log(err);
  }
  req.next();
};

//app.use(cors('*'));
app.use(addUser);

//Passport google-oauth

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: "https://ur-shop-graphql-server.now.sh/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      // console.log("token: ", accessToken);
      // console.log("profile: ", profile);

      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        done(null, existingUser);
      } else {
        const user = await new User({ googleId: profile.id }).save();
        const customer = await new Customer({
          user: user._id,
          name: profile.name.givenName
        }).save();

        user.set({ customer: customer._id }).save();

        done(null, user);
      }
    }
  )
);



app.use(
  cookieSession({
    name: 'session',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.SESSION_KEY]
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById({ _id: id }).then(user => {
    done(null, user);
  });
});


// The GraphQL endpoint
app.use(
  "/graphql",
  bodyParser.json(),
  (req, _, next) => {
    console.log("REQ: ", req.user);
    return next()
  },
  graphqlExpress((req, res) => ({
    schema,
    context: {
      User,
      Picture,
      Product,
      Customer,
      Vendor,
      Order,
      OrderInfo,
      Chatroom,
      Message,
      SECRET: process.env.LOGIN_SECRET,
      user: req.user,
      //session: req.session
    }
  }))
);

// GraphiQL, a visual editor for queries
app.use(
  "/graphiql",
  graphiqlExpress({
    endpointURL: "/graphql",
    subscriptionsEndpoint: "wss://ur-shop-graphql-server.now.sh/subscriptions"
  })
);

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  (req, res) => {
    res.redirect("https://ur-shop-graphql-client.now.sh/");
    //res.redirect("/");
  }
);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("https://ur-shop-graphql-client.now.sh/");
  //res.redirect("/");
});

app.get("/current_user", (req, res) => {
  console.log("CHECK_USER: ", req.user)
  res.send(JSON.stringify(req.user));
});


const server = createServer(app);

server.listen(4000, () => {
  console.log("Server ready to run queries!");
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema
    },
    {
      server,
      path: "/subscriptions"
    }
  );
});

// Start the server
// app.listen(3000, () => {
//   console.log('Go to http://localhost:3000/graphiql to run queries!');
// });
