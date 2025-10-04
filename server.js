// =====================
// Load env variables first
// =====================
import dotenv from "dotenv";
dotenv.config(); // MUST be first

// =====================
// Imports
// =====================
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import { Readable } from "stream";
import { GridFSBucket } from "mongodb";
import path from "path";
import { fileURLToPath } from "url";

// =====================
// Helpers for __dirname in ES module
// =====================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =====================
// Routes
// =====================
import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/users.js";
import quizRoutes from "./routes/quizzes.js";
import competitionRoutes from "./routes/competitions.js";
import examRoutes from "./routes/exams.js";

// =====================
// Models
// =====================
import Course from "./models/Course.js";
import Flashcard from "./models/Flashcard.js";
import Leaderboard from "./models/leaderboard.js";
import Group from "./models/Group.js";

// =====================
// Express app setup
// =====================
const app = express();
const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || "development";

// =====================
// Middleware
// =====================
app.use(helmet());
app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json({ limit: "6mb" }));
app.use(express.urlencoded({ extended: true, limit: "6mb" }));

// =====================
// Multer for file uploads
// =====================
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// =====================
// MongoDB + GridFS
// =====================
const mongoURI = process.env.MONGO_URI;
let gridFSBucket = null;

mongoose.connect(mongoURI).catch((err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

mongoose.connection.once("open", () => {
  gridFSBucket = new GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
  console.log("✅ MongoDB connected & GridFS ready");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// =====================
// API Routes
// =====================
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/competitions", competitionRoutes);
app.use("/api/exams", examRoutes);

// =====================
// Flashcards
// =====================
const flashcardRouter = express.Router();
flashcardRouter.get("/", async (req, res) => {
  try {
    const cards = await Flashcard.find();
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch flashcards" });
  }
});
flashcardRouter.post("/", async (req, res) => {
  try {
    const { front, back, topic } = req.body;
    const card = new Flashcard({ front, back, topic });
    await card.save();
    res.json(card);
  } catch (err) {
    res.status(500).json({ error: "Failed to add flashcard" });
  }
});
flashcardRouter.delete("/:id", async (req, res) => {
  try {
    await Flashcard.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Flashcard deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete flashcard" });
  }
});
app.use("/api/flashcards", flashcardRouter);

// =====================
// Courses
// =====================
app.get("/api/courses", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// =====================
// Library (GridFS uploads)
// =====================
app.post("/api/library/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    if (!gridFSBucket) return res.status(500).json({ error: "GridFS not initialized" });

    const readableStream = Readable.from(req.file.buffer);
    const uploadStream = gridFSBucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    readableStream.pipe(uploadStream).on("finish", () =>
      res.json({ message: "File uploaded successfully", id: uploadStream.id })
    );
  } catch (err) {
    res.status(500).json({ error: "Failed to upload file" });
  }
});

app.get("/api/library", async (req, res) => {
  try {
    if (!gridFSBucket) return res.status(500).json({ error: "GridFS not initialized" });
    const cursor = gridFSBucket.find({});
    const files = await cursor.toArray();
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch library files" });
  }
});

// =====================
// Leaderboard
// =====================
app.get("/api/leaderboard", async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find().sort({ xp: -1, streak: -1 });
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

// =====================
// Groups
// =====================
app.get("/api/groups", async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch groups" });
  }
});

// =====================
// Serve frontend (Vite/React)
// =====================
app.use(express.static(path.join(__dirname, "dist")));

// Regex wildcard for SPA routing (fixes PathError)
app.get(/^\/.*$/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// =====================
// Start server
// =====================
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
