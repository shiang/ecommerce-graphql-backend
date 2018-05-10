import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import _ from "lodash";
import { PubSub } from "graphql-subscriptions";
import AWS from 'aws-sdk';
import { withFilter } from "graphql-subscriptions";

export const pubsub = new PubSub();

const POST_CREATED = "POST_CREATED";

const resolvers = {
  Subscription: {
    postCreated: {
      // subscribe: withFilter(() => pubsub.asyncIterator(POST_CREATED), (payload, variables) => {
      //   return payload.createdPost.title === variables.title;
      // })
      subscribe: () => pubsub.asyncIterator(POST_CREATED)
    }
  },
  Query: {
    author: async (root, args, { Author }) => {
      const author = await Author.find({ _id: args._id });

      return author[0];
    },
    post: async (root, args, { Post }) => {
      const post = await Post.find({ _id: args._id });

      return post[0];
    },
    user: async (root, args, { user, User }) => {
      if (user) {
        const userInfo = await User.findOne({ _id: user._id });
        return userInfo;
      }

      return null;
    },
    allAuthors: async (parent, args, { Author }) => {
      const authors = await Author.find();
      return authors.map(author => {
        author._id = author._id.toString();
        return author;
      });
    },
    allPosts: async (parent, args, { Post }) => {
      const posts = await Post.find();
      return posts.map(post => {
        post._id = post._id.toString();
        return post;
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
    createPicture: async (parent, args, { Picture }) => {
      const picture = await new Picture(args).save();
      picture._id = picture._id.toString();
      console.log(picture);
      return picture;
    },
    createAuthor: async (parent, args, { Author, Post }) => {
      if (args.posts) {
        if (args.posts.length > 0) {
          const author = await new Author(args).save();

          args.posts.map(async pid => {
            //console.log(pid);
            const post = await Post.findOne({ _id: pid });
            //console.log(post);
            post.set({ author: author._id }).save();
          });

          author._id = author._id.toString();
          return author;
        }
      } else {
        const author = await new Author(args).save();
        author._id = author._id.toString();
        return author;
      }
    },
    createPost: async (parent, args, { Post }) => {
      const post = await new Post(args).save();
      post._id = post._id.toString();

      pubsub.publish(POST_CREATED, { postCreated: post });
      console.log(post);
      return post;
    },
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
  Author: {
    posts: (author, _, { Post }) => {
      const posts = Post.find()
        .where("author")
        .equals(author._id)
        .exec();

      return posts;
    }
  },
  Post: {
    author(post, _, { Author }) {
      if (post.author) {
        const author = Author.findById({ _id: post.author });
        return author;
      }
    }
  }
};

export default resolvers;
