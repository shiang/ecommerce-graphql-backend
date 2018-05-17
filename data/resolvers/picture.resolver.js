export default {
  Query: {
    picture: async (parent, args, { Picture }) => {
      const picture = await Picture.findOne({ _id: args._id });
      return picture;
    }
  },
  Mutation: {
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
    }
  },
  Picture: {
    product: async(picture, _, { Product }) => {
      const product = Product.find()
        .where("product")
        .equals(picture.product)
        .exec()
      
        return product;
    },
    vendor: async (picture, _, { Vendor }) => {
      const vendor = Vendor.find()
        .where("vendor")
        .equals(picture.vendor)
        .exec()

      return vendor;
    },
    customer: async (picture, _, { Customer }) => {
      const customer = Customer.find()
        .where("customer")
        .equals(picture.customer)
        .exec()

      return customer;
    },
  }
};