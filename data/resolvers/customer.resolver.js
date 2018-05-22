import { pubsub, ORDERINFO_CREATED } from "../resolvers";

export default {
  Query: {
    customer: async (parent, args, { Customer, user }) => {
      console.log(user);
      const customer = await Customer.findOne({ _id: args._id });
      return customer;
    },
    allCustomers: async (parent, args, { Customer }) => {
      const customers = await Customer.find();
      return customers.map(customer => {
        customer._id = customer._id.toString();
        return customer;
      });
    }
  },
  Mutation: {
    createCustomer: async (parent, { customerInput }, { Customer }) => {
      const customer = await new Customer(customerInput).save();
      customer._id = customer._id.toString();
      return customer;
    },
    updateCustomer: async (parent, { customerInput }, { Customer }) => {
      const customer = await Customer.findOneAndUpdate(
        { _id: args._id },
        customerInput,
        { new: true }
      );

      return customer;
    },
    removeCustomer: async (parent, args, { Customer }) => {
      const customer = await Customer.findByIdAndRemove({ _id: args._id });

      return customer;
    },
    addToCart: async (parent, args, { Customer, OrderInfo }) => {
      const orderInfo = await new OrderInfo(args).save();
      await Customer.findByIdAndUpdate(
        args.orderedBy,
        { $push: { cart: orderInfo._id } },
        { new: true }
      );

      pubsub.publish(ORDERINFO_CREATED, { orderInfoCreated: orderInfo });

      return orderInfo;
    }
  },
  Customer: {
    user: async (customer, _, { User }) => {
      const user = await User.findById({ _id: customer.user });

      return user;
    },
    cart: async (customer, _, { OrderInfo }) => {
      const orderInfoes = await OrderInfo.find()
        .where("orderedBy")
        .equals(customer._id)
        .exec();

      return orderInfoes;
    },
    profilePicture: async (customer, _, { Picture }) => {
      const profilePicture = await Picture.findById({
        _id: customer.profilePicture
      });
      return profilePicture;
    },
    likedVendors: async (customer, _, { Vendor }) => {
        const likedVendors = await Vendor.find()
        .where("likedBy")
        .equals(customer._id)
        .exec();

        return likedVendors;
    },
    orders: async(customer, _, { Order }) => {
        const orders = await Order.find()
            .where("customer")
            .equals(customer._id)
            .exec()

        return orders;
    },
    chats: async (customer, _, { Chatroom }) => {
      const chats = await Chatroom.find()
        .where("customer")
        .equals(customer._id)
        .exec()

      return chats;
    }
  }
};