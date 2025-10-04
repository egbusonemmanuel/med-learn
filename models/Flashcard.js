// models/Flashcard.js
import mongoose from "mongoose";

const flashcardSchema = new mongoose.Schema(
  {
    front: { type: String, required: true },
    back: { type: String, required: true },
    topic: { type: String },
    color: { type: String, default: "#ffffff" }
  },
  { timestamps: true }
);

const Flashcard = mongoose.model("Flashcard", flashcardSchema);

export default Flashcard;
