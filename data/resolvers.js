const resolvers = {
  Query: {
    author: async (root, args, { Author }) => {
      const author = await Author.find({ _id: args._id });

      return author[0];
    },
    post: async (root, args, { Post }) => {
      const post = await Post.find({ _id: args._id });

      return post[0];
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
    createAuthor: async (parent, args, { Author, Post }) => {
      if (args.posts) {
        if (args.posts.length > 0) {
          const author = await new Author(args).save();

          args.posts.map(async pid => {
            const post = await Post.findById({ _id: pid });
            post.set({ author: author._id }).save();
          });

          author._id = author._id.toString();
          return author;
        }
      }

      const author = await new Author(args).save();
      author._id = author._id.toString();
      return author;
      //   Author.create(args, (error, author) => {
      //     if (error) {
      //       console.log(error);
      //     }

      //     if (args.posts.length > 0) {
      //       args.posts.map(pid => {
      //         Post.findById({ _id: pid }, (error, post) => {
      //           if (error) {
      //             console.log(error);
      //           }

      //           post.set({ author: author._id });
      //           post.save((error, updatedPost) => {
      //               if (error) {
      //                   console.log(error)
      //               }

      //               return updatedPost
      //           })
      //         });
      //       });
      //     }

      //     // author._id = author._id.toString();
      //     return author;
      //   });
    },
    createPost: async (parent, args, { Post }) => {
      const post = await new Post(args).save();
      post._id = post._id.toString();
      return post;
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
      const author = Author.findById({ _id: post.author });
      return author;
    }
  }
};

export default resolvers;
