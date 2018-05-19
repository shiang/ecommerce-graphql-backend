import { pubsub, CHATROOM_CREATED } from "../resolvers";

export default {
  Query: {
    chatroom: async (parent, args, { Chatroom }) => {
      const chatroom = await Chatroom.findOne({ _id: args._id });
      return chatroom;
    },
    allChatrooms: async (parent, args, { Chatroom }) => {
      const chatrooms = await Chatroom.find();
      return chatrooms.map(chatroom => {
        chatroom._id = chatroom._id.toString();
        return chatroom;
      });
    }
  },
  Mutation: {
    createChatroom: async (parent, { chatroomInput }, { Chatroom, Customer, Vendor }) => {
      const chatroom = await new Chatroom(chatroomInput).save();
      chatroom._id = chatroom._id.toString();

      pubsub.publish(CHATROOM_CREATED, { chatroomCreated: chatroom });
      
      await Customer.findByIdAndUpdate({ _id: chatroomInput.customer }, { $push: { chats: chatroom }}, { new: true })
      await Vendor.findByIdAndUpdate({ _id: chatroomInput.vendor }, { $push: { chats: chatroom }}, { new: true })

      console.log(chatroom);
      return chatroom;
    },
    // updateCustomer: async (parent, { customerInput }, { Customer }) => {
    //     const customer = await Customer.findOneAndUpdate(
    //         { _id: args._id },
    //         customerInput,
    //         { new: true }
    //     );

    //     return customer;
    // },
    removeChatroom: async (parent, args, { Chatroom }) => {
      const chatroom = await Chatroom.findByIdAndRemove({ _id: args._id });

      return chatroom;
    }
  },
  Chatroom: {
    customer: async (chatroom, _, { Customer }) => {
      const customer = await Customer.findById({ _id: chatroom.customer });

      return customer;
    },
    vendor: async (chatroom, _, { Vendor }) => {
      const vendor = await Vendor.findById({ _id: chatroom.vendor });

      return vendor;
    },
    messages: async (chatroom, _, { Message }) => {
      const messages = await Message.find()
        .where("inChatroom")
        .equals(chatroom._id)
        .exec();

      return messages;
    }
  }
};