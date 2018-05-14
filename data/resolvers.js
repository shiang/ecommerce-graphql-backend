import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import _ from "lodash";
import { PubSub } from "graphql-subscriptions";
import AWS from 'aws-sdk';
import { withFilter } from "graphql-subscriptions";
import { merge } from 'lodash';
import productResolver from './resolvers/product.resolver';
import orderResolver from './resolvers/order.resolver';
import customerResolver from './resolvers/customer.resolver';
import vendorResolver from './resolvers/vendor.resolver';
import orderInfoResolver from './resolvers/orderInfo.resolver';
import pictureResolver from './resolvers/picture.resolver';

export const pubsub = new PubSub();

const PRODUCT_CREATED = "PRODUCT_CREATED";

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
        const userInfo = await User.findOne({ _id: user._id });
        return userInfo;
      }

      return null;
    },
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
    // createAuthor: async (parent, args, { Author, Post }) => {
    //   if (args.posts) {
    //     if (args.posts.length > 0) {
    //       const author = await new Author(args).save();

    //       args.posts.map(async pid => {
    //         //console.log(pid);
    //         const post = await Post.findOne({ _id: pid });
    //         //console.log(post);
    //         post.set({ author: author._id }).save();
    //       });

    //       author._id = author._id.toString();
    //       return author;
    //     }
    //   } else {
    //     const author = await new Author(args).save();
    //     author._id = author._id.toString();
    //     return author;
    //   }
    // },
    signUp: async (parent, args, { User }) => {
      args.password = await bcrypt.hash(args.password, 12);
      const user = await new User(args).save();
      user._id = user._id.toString();
      return user;
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
    vendors: (user, _, { User }) => {
      const vendor = Vendor.find()
        .where("user")
        .equals(user._id)
        .exec();

      return vendor;
    }
  },
  Vendor: {
    user: (vendor, _, { User }) => {
      if (vendor.user) {
        const user = User.findById({ _id: vendor.user });
        return user;
      }
    }
  },
  User: {
    customers: (user, _, { User }) => {
      const customer = User.find()
        .where("user")
        .equals(user._id)
        .exec();

      return customer;
    }
  },
  Customer: {
    user: (customer, _, { User }) => {
      if (customer.user) {
        const user = User.findById({ _id: customer.user });
        return user;
      }
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
)

export default resolvers;
