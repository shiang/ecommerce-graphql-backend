import mongoose from "mongoose";

export const pictureSchema = new mongoose.Schema(
  {
    name: { type: String },
    pictureUrl: { type: String },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
  },
  { timestamps: true }
);

export const Picture = mongoose.model("Picture", pictureSchema);
