import mongoose from "mongoose";

export const vendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "A product must have a name"] },
    description: { type: String },
    address: { type: String },
    phone: { type: String },
    pictures: [{ type: mongoose.Schema.Types.ObjectId, ref: "Picture" }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }]
  },
  { timestamps: true }
);

export const Vendor = mongoose.model("Vendor", vendorSchema);
