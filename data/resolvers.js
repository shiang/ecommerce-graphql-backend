import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import _ from "lodash";
import { PubSub } from "graphql-subscriptions";
import AWS from 'aws-sdk';
import { withFilter } from "graphql-subscriptions";

export const pubsub = new PubSub();

const PRODUCT_CREATED = "PRODUCT_CREATED";

const resolvers = {
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
    product: async (parent, args, { Product }) => {
      const product = await Product.findOne({ _id: args._id });
      return product;
    },
    allProducts: async (parent, args, { Product }) => {
      const products = await Product.find();
      return products.map(product => {
        product._id = product._id.toString();
        return product;
      });
    },
    order: async (parent, args, { Order }) => {
      const order = await Order.findOne({ _id: args._id });
      return order;
    },
    allOrders: async (parent, args, { Order }) => {
      const orders = await Order.find();
      return orders.map(order => {
        order._id = order._id.toString();
        return order;
      });
    },
    orderInfo: async (parent, args, { OrderInfo }) => {
      const orderInfo = await OrderInfo.findOne({ _id: args._id });
      return orderInfo;
    },
    allOrderInfoes: async (parent, args, { OrderInfo }) => {
      const orderInfoes = await OrderInfo.find();
      return orderInfoes.map(orderInfo => {
        orderInfo._id = orderInfo._id.toString();
        return orderInfo;
      });
    },
    customer: async (parent, args, { Customer }) => {
      const customer = await Customer.findOne({ _id: args._id });
      return customer;
    },
    allCustomers: async (parent, args, { Customer }) => {
      const customers = await Customer.find();
      return customers.map(customer => {
        customer._id = customer._id.toString();
        return customer;
      });
    },
    vendor: async (parent, args, { Vendor }) => {
      const vendor = await Vendor.findOne({ _id: args._id });
      return vendor;
    },
    allVendors: async (parent, args, { Vendor }) => {
      const vendors = await Vendor.find();
      return vendors.map(vendor => {
        vendor._id = vendor._id.toString();
        return vendor;
      });
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
    createProduct: async (parent, args, { Product }) => {
      const product = await new Product(args).save();
      product._id = product._id.toString();
      pubsub.publish(PRODUCT_CREATED, { productCreated: product });
      return product;
    },
    updateProduct: async (parent, args, { Product }) => {
      const product = await Product.findOneAndUpdate(
        { _id: args._id },
        args.productInput,
        { new: true }
      );
      console.log(product);
      return product;
    },
    removeProduct: async (parent, args, { Product }) => {
      const product = await Product.findByIdAndRemove({ _id: args._id });

      return product;
    },
    createPicture: async (parent, args, { Picture }) => {
      const picture = await new Picture(args).save();
      picture._id = picture._id.toString();

      return picture;
    },
    updatePicture: async (parent, args, { Picture }) => {
      const picture = await Picture.findOneAndUpdate(
        { _id: args._id },
        args.customerInput,
        { new: true }
      );

      return picture;
    },
    removePicture: async (parent, args, { Picture }) => {
      const picture = await Customer.findByIdAndRemove({ _id: args._id });

      return picture;
    },
    createCustomer: async (parent, args, { Customer }) => {
      const customer = await new Customer(args).save();
      customer._id = customer._id.toString();
      return customer;
    },
    updateCustomer: async (parent, args, { Customer }) => {
      const customer = await Customer.findOneAndUpdate(
        { _id: args._id },
        args.customerInput,
        { new: true }
      );

      return customer;
    },
    removeCustomer: async (parent, args, { Customer }) => {
      const customer = await Customer.findByIdAndRemove({ _id: args._id });

      return customer;
    },
    createVendor: async (parent, args, { Vendor }) => {
      const vendor = await new Vendor(args).save();
      vendor._id = vendor._id.toString();
      return vendor;
    },
    updateVendor: async (parent, args, { Vendor }) => {
      const vendor = await Vendor.findOneAndUpdate(
        { _id: args._id },
        args.customerInput,
        { new: true }
      );

      return vendor;
    },
    removeVendor: async (parent, args, { Vendor }) => {
      const vendor = await Vendor.findByIdAndRemove({ _id: args._id });

      return vendor;
    },
    createOrder: async (parent, args, { Order }) => {
      const order = await new Order(args).save();
      order._id = order._id.toString();
      return order;
    },
    updateOrder: async (parent, args, { Order }) => {
      const order = await Order.findOneAndUpdate(
        { _id: args._id },
        args.customerInput,
        { new: true }
      );

      return order;
    },
    removeOrder: async (parent, args, { Order }) => {
      const order = await Order.findByIdAndRemove({ _id: args._id });

      return order;
    },
    createOrderInfo: async (parent, args, { OrderInfo }) => {
      const orderInfo = await new OrderInfo(args).save();
      orderInfo._id = orderInfo._id.toString();
      return orderInfo;
    },
    updateOrderInfo: async (parent, args, { OrderInfo }) => {
      const orderInfo = await OrderInfo.findOneAndUpdate(
        { _id: args._id },
        args.customerInput,
        { new: true }
      );

      return orderInfo;
    },
    removeOrderInfo: async (parent, args, { OrderInfo }) => {
      const orderInfo = await OrderInfo.findByIdAndRemove({ _id: args._id });

      return orderInfo;
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
  }
  // Author: {
  //   posts: (author, _, { Post }) => {
  //     const posts = Post.find()
  //       .where("author")
  //       .equals(author._id)
  //       .exec();

  //     return posts;
  //   }
  // },
  // Post: {
  //   author(post, _, { Author }) {
  //     if (post.author) {
  //       const author = Author.findById({ _id: post.author });
  //       return author;
  //     }
  //   }
  // }
};

export default resolvers;
