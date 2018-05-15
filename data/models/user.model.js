import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "A user must have an email"]
  },
  name: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "A user must have a password"]
  },
  vender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor"
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer"
  }
},
{
    timestamps: true
}
);

export const User = mongoose.model("User", userSchema);
