import mongoose from "mongoose";

export const orderSchema = new mongoose.Schema(
  {
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    orderedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "OrderInfo" }],
    total: { type: Number, required: [true, "An order must have a total"] },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
