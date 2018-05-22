export default {
  Query: {
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
    }
  },
  Mutation: {
    createOrderInfo: async (parent, { orderInfoInput }, { OrderInfo }) => {
      const orderInfo = await new OrderInfo(orderInfoInput).save();
      orderInfo._id = orderInfo._id.toString();
      
      return orderInfo;
    },
    updateOrderInfo: async (parent, args, { OrderInfo }) => {
      const orderInfo = await OrderInfo.findOneAndUpdate(
        { _id: args._id },
        args,
        { new: true }
      );

      return orderInfo;
    },
    removeOrderInfo: async (parent, args, { OrderInfo, Customer }) => {

      // console.log(args);
      const orderInfo = await OrderInfo.findById(args._id);
      await Customer.findByIdAndUpdate(
        args.customerId,
        {
          $pull: { "cart": orderInfo._id  }
        }
      );

      const removedOrderInfo = await OrderInfo.findByIdAndRemove({ _id: args._id });

      return removedOrderInfo;
    }
  },
  OrderInfo: {
    product: async (orderInfo, _, { Product }) => {
      const product = await Product.findById({ _id: orderInfo.product });
      return product;
    },
    orderedBy: async (orderInfo, _, { Customer }) => {
      const orderedBy = await Customer.findById({ _id: orderInfo.orderedBy });
      return orderedBy;
    },
    order: async (orderInfo, _, { Order }) => {
      const order = await Order.findById({ _id: orderInfo.order });
      return order;
    }
  },
};