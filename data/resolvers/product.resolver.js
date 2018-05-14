import { productIndex } from "../algolia";
import { pubsub, PRODUCT_CREATED } from '../resolvers';

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
      const productObj = {
        product,
        objectID: product._id
      }
      productIndex.addObject(productObj, (err, content) => {
        if(err) {
          console.log(err)
        }

        console.log(content);
      })
      return product;
    },
    updateProduct: async (parent, args, { Product }) => {
      const product = await Product.findOneAndUpdate(
        { _id: args._id },
        args.productInput,
        { new: true }
      );

      const productObj = {
        product,
        objectID: product._id
      };

      productIndex.saveObject(productObj, (err, content) => {
        if(err) {
          console.log(err)
        }

        console.log(content);
      })
      console.log(product);
      return product;
    },
    removeProduct: async (parent, args, { Product }) => {
      const product = await Product.findByIdAndRemove({ _id: args._id });

      return product;
    }
  }
};