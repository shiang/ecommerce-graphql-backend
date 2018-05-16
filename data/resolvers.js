import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import _ from "lodash";
import { PubSub } from "graphql-subscriptions";
import AWS from "aws-sdk";
import { withFilter } from "graphql-subscriptions";
import { merge } from "lodash";
import productResolver from "./resolvers/product.resolver";
import orderResolver from "./resolvers/order.resolver";
import customerResolver from "./resolvers/customer.resolver";
import vendorResolver from "./resolvers/vendor.resolver";
import orderInfoResolver from "./resolvers/orderInfo.resolver";
import pictureResolver from "./resolvers/picture.resolver";
require("now-env");

export const pubsub = new PubSub();

export const PRODUCT_CREATED = "PRODUCT_CREATED";

const rootResolver = {
  Subscription: {
    productCreated: {
      // subscribe: withFilter(() => pubsub.asyncIterator(POST_CREATED), (payload, variables) => {
      //   return payload.createdPost.title === variables.title;
      // })
      subscribe: () => pubsub.asyncIterator(PRODUCT_CREATED)
    }
  },
  Query: {
    user: async (root, args, { user, User }) => {
      if (user) {
        const userInfo = await User.findOne({ _id: user.user._id });
        return userInfo;
      }

      return null;
    },
    allUsers: async (parent, args, { User }) => {
      const users = User.find();
      return users;
    }
  },
  Mutation: {
    signS3: async (parent, { filename, filetype }) => {
      const s3 = new AWS.S3({
        signatureVersion: "v4",
        region: "us-east-1",
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY
      });

      const s3Params = {
        Bucket: process.env.S3_BUCKET,
        Key: filename,
        Expires: 60,
        ContentType: filetype,
        ACL: "public-read"
      };

      const signedRequest = await s3.getSignedUrl("putObject", s3Params);
      const url = `https://${
        process.env.S3_BUCKET
      }.s3.amazonaws.com/${filename}`;

      return {
        signedRequest,
        url
      };
    },
    signUp: async (parent, args, { User, Vendor }) => {
      args.password = await bcrypt.hash(args.password, 12);
      const user = await new User(args).save();

      const vendor = await new Vendor({
        user: user._id,
        name: args.email
      }).save();

      //await user.set({ vendor: vendor._id }).save();
      const updatedUser = await User.findByIdAndUpdate(user._id, { $set: { vendor: vendor } }, { new: true });

      updatedUser._id = updatedUser._id.toString();
      vendor._id = vendor._id.toString();

      return updatedUser;

    },
    login: async (parent, { email, password }, { User, SECRET }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User not found!");
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error("Password does not match!");
      }

      const token = jwt.sign(
        {
          user: _.pick(user, ["_id", "email", "name"])
        },
        SECRET,
        {
          expiresIn: "1y"
        }
      );

      return { token };
    }
  },
  Vendor: {
    products: (vendor, _, { Vendor }) => {
      const products = Product.find()
        .where("vendor")
        .equals(vendor._id)
        .exec();

      return products;
    },
    user: async (vendor, _, { User }) => {
      const user = await User.findById({ _id: vendor.user });

      return user;
    }
  },
  Product: {
    vendor: (product, _, { Vendor }) => {
      if (product.vendor) {
        const vendor = Vendor.findById({ _id: product.vendor });
        return vendor;
      }
    }
  },
  User: {
    customer: async (user, _, { Customer }) => {
      const customer = await Customer.find()
        .where("user")
        .equals(user._id)
        .exec();

      return customer[0];
    },
    vendor: async (user, _, { Vendor }) => {
      console.log("USER: ", user);

      const vendor = await Vendor.find()
        .where("user")
        .equals(user._id)
        .exec();

      return vendor[0];
    }
  },
  Customer: {
    user: async (customer, _, { User }) => {
      const user = await User.findById({ _id: customer.user });
      
      return user;
    }
  }
};

const resolvers = merge(
  rootResolver,
  productResolver,
  orderResolver,
  customerResolver,
  vendorResolver,
  orderInfoResolver,
  pictureResolver
);

export default resolvers;
