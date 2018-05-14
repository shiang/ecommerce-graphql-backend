export default {
  Query: {
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
    }
  },
  Mutation: {
    createOrder: async (parent, { orderInput }, { Order }) => {
      const order = await new Order(orderInput).save();
      order._id = order._id.toString();
      return order;
    },
    updateOrder: async (parent, { orderInput }, { Order }) => {
      const order = await Order.findOneAndUpdate(
        { _id: args._id },
        orderInput,
        { new: true }
      );

      return order;
    },
    removeOrder: async (parent, args, { Order }) => {
      const order = await Order.findByIdAndRemove({ _id: args._id });

      return order;
    }
  }
};