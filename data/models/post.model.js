import mongoose from "mongoose";

export const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A post must have a title"]
    },
    text: {
      type: String
    },
    views: {
      type: Number
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author"
    }
  },
  {
    timestamps: true
  }
);

export const Post = mongoose.model("Post", postSchema);
