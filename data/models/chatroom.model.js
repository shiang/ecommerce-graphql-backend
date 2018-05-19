import mongoose from "mongoose";

export const chatroomSchema = new mongoose.Schema(
    {
        name: { type: String },
        pictureUrl: { type: String },
        vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
        customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
        messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }]
    },
    { timestamps: true }
);

export const Chatroom = mongoose.model("Chatroom", chatroomSchema);
