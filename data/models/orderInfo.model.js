import mongoose from "mongoose";

export const orderInfoSchema = new mongoose.Schema(
    {
        quantity: { type: Number },
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        orderedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" }
    },
    { timestamps: true }
);

export const OrderInfo = mongoose.model("OrderInfo", orderInfoSchema);
