import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

// Example route: fetch library items
app.get("/api/library", async (req, res) => {
  try {
    const db = await connectDB();
    const items = await db.collection("library_items").find().toArray();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Example route: add library item
app.post("/api/library", async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection("library_items").insertOne(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(4000, () => console.log("🚀 Server running on http://localhost:4000"));
