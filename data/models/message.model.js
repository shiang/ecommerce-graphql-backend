import mongoose from "mongoose";

export const messageSchema = new mongoose.Schema(
  {
    content: { type: String },
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    inChatroom: { type: mongoose.Schema.Types.ObjectId, ref: "Chatroom" },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
