import mongoose from "mongoose";

export const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "A product must have a name"] },
    description: { type: String },
    price: { type: Number, required: [true, "A product must have a price"] },
    tags: [{ type: String }],
    category: { type: String, required: [true, "You must supply a category to a product"] },
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Picture"
      }
    ],
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor"
    }
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
