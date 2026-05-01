import express from "express";
import Vote from "../models/Vote.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, candidateId } = req.body;

    if (!userId || !candidateId) {
      return res.status(400).json({ message: "userId and candidateId are required" });
    }

    const exists = await Vote.findOne({ userId });
    if (exists) return res.status(409).json({ message: "Already voted" });

    const vote = await Vote.create({ userId, candidateId });
    res.status(201).json(vote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", requireAdmin, async (_req, res) => {
  try {
    const votes = await Vote.find().sort({ createdAt: -1 });
    res.json(votes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
