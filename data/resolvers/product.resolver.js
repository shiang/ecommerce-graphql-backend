export default {
  Query: {
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
    }
  },
  Mutation: {
    createProduct: async (parent, { productInput }, { Product }) => {
      const product = await new Product(productInput).save();
      product._id = product._id.toString();
      pubsub.publish(PRODUCT_CREATED, { productCreated: product });
      return product;
    },
    updateProduct: async (parent, { productInput }, { Product }) => {
      const product = await Product.findOneAndUpdate(
        { _id: args._id },
        productInput,
        { new: true }
      );
      console.log(product);
      return product;
    },
    removeProduct: async (parent, args, { Product }) => {
      const product = await Product.findByIdAndRemove({ _id: args._id });

      return product;
    }
  }
};