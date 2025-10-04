// src/routes/quizzes.js
import express from "express";
import Quiz from "../models/Quiz.js";
import QuizResult from "../models/QuizResult.js"; // FIXED case
import multer from "multer";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// ========== Upload handler ==========
const upload = multer({ storage: multer.memoryStorage() });

// ========== AI client ==========
const aiClient = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ====================
// GET all quizzes
// ====================
router.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (err) {
    console.error("Failed to fetch quizzes:", err);
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
});

// ====================
// POST generate quiz (AI)
// ====================
router.post("/generate", async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ error: "Topic required" });

    const prompt = `
      Generate a quiz on "${topic}".
      Return JSON with title, difficulty, and 5 questions with options and answers.
    `;

    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const output = response.text;
    const parsed = JSON.parse(output.match(/\{[\s\S]*\}/)?.[0] || "{}");

    const quiz = new Quiz({
      title: parsed.title || topic,
      topic,
      difficulty: parsed.difficulty || "medium",
      questions: parsed.questions || [],
    });

    await quiz.save();
    res.json(quiz);
  } catch (err) {
    console.error("Quiz generation error:", err);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
});

// ====================
// POST upload quiz (manual JSON file)
// ====================
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const data = JSON.parse(req.file.buffer.toString());

    const quiz = new Quiz({
      title: data.title || "Uploaded Quiz",
      topic: data.topic || "General",
      difficulty: data.difficulty || "medium",
      questions: data.questions || [],
    });

    await quiz.save();
    res.json(quiz);
  } catch (err) {
    console.error("Quiz upload error:", err);
    res.status(500).json({ error: "Failed to upload quiz" });
  }
});

// ====================
// POST submit quiz result
// ====================
router.post("/submit", async (req, res) => {
  try {
    const { userId, quizId, score, total } = req.body;
    if (!userId || !quizId) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const result = new QuizResult({ userId, quizId, score, total });
    await result.save();

    res.json(result);
  } catch (err) {
    console.error("Quiz result submission error:", err);
    res.status(500).json({ error: "Failed to submit quiz result" });
  }
});

// ====================
// GET user quiz results
// ====================
router.get("/results/:userId", async (req, res) => {
  try {
    const results = await QuizResult.find({ userId: req.params.userId })
      .populate("quizId", "title")
      .sort({ createdAt: -1 });

    res.json(results);
  } catch (err) {
    console.error("Fetch results error:", err);
    res.status(500).json({ error: "Failed to fetch results" });
  }
});

export default router;
