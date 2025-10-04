import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: {
    type: [{ type: String }],
    required: true,
    validate: [arr => arr.length === 4, "Exactly 4 options are required"],
  },
  correctAnswer: { type: String, required: true },
  explanation: { type: String, default: "No explanation provided" },
});

const QuizSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    questions: [QuestionSchema],

    // 🔹 Additions for multi-user platform
    type: { type: String, enum: ["quiz", "exam", "competition"], default: "quiz" },
    duration: { type: Number }, // in minutes
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", QuizSchema);
