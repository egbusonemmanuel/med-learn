import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  hasPaid: { type: Boolean, default: false },
  // add other fields...
});

// Use this pattern to avoid OverwriteModelError
export default mongoose.models.User || mongoose.model("User", userSchema);
