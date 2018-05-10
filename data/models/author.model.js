import mongoose from "mongoose";
import { postSchema } from "./post.model";

export const authorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Author must have a name"]
    },
    lastName: {
      type: String
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
      }
    ]
  },
  {
    timestamps: true
  }
);

export const Author = mongoose.model("Author", authorSchema);
