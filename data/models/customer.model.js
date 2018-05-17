import mongoose from "mongoose";

export const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "A product must have a name"] },
    description: { type: String },
    email: { type: String },
    mobile: { type: String },
    profilePicture: { type: mongoose.Schema.Types.ObjectId, ref: "Picture" },
    cart: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderInfo"
    }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    likedVendors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vendor" }],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

export const Customer = mongoose.model("Customer", customerSchema);
