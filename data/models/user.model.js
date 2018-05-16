import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  googleId: {
    type: String,
  },
  name: {
    type: String,
  },
  password: {
    type: String,
  },
  vendor: {
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
