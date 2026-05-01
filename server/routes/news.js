import express from "express";
import News from "../models/News.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", requireAdmin, async (req, res) => {
  try {
    const news = await News.create(req.body);
    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (_req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
