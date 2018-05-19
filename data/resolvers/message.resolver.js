import { pubsub, MESSAGE_CREATED } from "../resolvers";

export default {
    Query: {
        message: async (parent, args, { Message }) => {
            const message = await Message.findOne({ _id: args._id });
            return message;
        },
        allMessages: async (parent, args, { Message }) => {
            const messages = await Message.find();
            return messages.map(message => {
                message._id = message._id.toString();
                return message;
            });
        }
    },
    Mutation: {
        createMessage: async (parent, { messageInput }, { Message }) => {
            const message = await new Message(messageInput).save();
            message._id = message._id.toString();
            pubsub.publish(MESSAGE_CREATED, { messageCreated: message });
            return message;
        },
        // updateCustomer: async (parent, { customerInput }, { Customer }) => {
        //     const customer = await Customer.findOneAndUpdate(
        //         { _id: args._id },
        //         customerInput,
        //         { new: true }
        //     );

        //     return customer;
        // },
        // removeChatroom: async (parent, args, { Chatroom }) => {
        //     const chatroom = await Chatroom.findByIdAndRemove({ _id: args._id });

        //     return chatroom;
        // }
    },
    Message: {
        from: async (message, _, { User }) => {
            const from = await User.findById({ _id: message.from });

            return from;
        },
        inChatroom: async (message, _, { Chatroom }) => {
            const inChatroom = await Chatroom.findById({ _id: message.inChatroom });

            return inChatroom;
        }
    }
};