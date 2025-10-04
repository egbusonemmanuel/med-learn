import express from "express";
import Flashcard from "../models/Flashcard.js";

const router = express.Router();

// 📌 Create flashcard
router.post("/", async (req, res) => {
  try {
    const { front, back, topic, color } = req.body;

    if (!front || !back) {
      return res.status(400).json({ error: "Front and back are required" });
    }

    const card = await Flashcard.create({
      front,
      back,
      topic,
      color
    });

    res.status(201).json({ card }); // ✅ wrapped
  } catch (err) {
    console.error("❌ Flashcard create error:", err);
    res.status(500).json({ error: "Error creating flashcard" });
  }
});

// 📌 Get all flashcards
router.get("/", async (req, res) => {
  try {
    const cards = await Flashcard.find().sort({ createdAt: -1 });
    res.json({ cards }); // ✅ wrapped in { cards }
  } catch (err) {
    console.error("❌ Flashcard fetch error:", err);
    res.status(500).json({ error: "Error fetching flashcards" });
  }
});

// 📌 Get single flashcard
router.get("/:id", async (req, res) => {
  try {
    const card = await Flashcard.findById(req.params.id);
    if (!card) return res.status(404).json({ error: "Not found" });
    res.json({ card });
  } catch (err) {
    console.error("❌ Flashcard fetch one error:", err);
    res.status(500).json({ error: "Error fetching flashcard" });
  }
});

// 📌 Update flashcard
router.put("/:id", async (req, res) => {
  try {
    const card = await Flashcard.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!card) return res.status(404).json({ error: "Not found" });
    res.json({ card });
  } catch (err) {
    console.error("❌ Flashcard update error:", err);
    res.status(500).json({ error: "Error updating flashcard" });
  }
});

// 📌 Delete flashcard
router.delete("/:id", async (req, res) => {
  try {
    const card = await Flashcard.findByIdAndDelete(req.params.id);
    if (!card) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("❌ Flashcard delete error:", err);
    res.status(500).json({ error: "Error deleting flashcard" });
  }
});

export default router;
