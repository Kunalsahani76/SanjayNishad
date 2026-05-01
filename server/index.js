import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import newsRoutes from "./routes/news.js";
import voteRoutes from "./routes/vote.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get("/", (_req, res) => {
  res.json({ message: "News app API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/vote", voteRoutes);

if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));
} else {
  console.log("MONGO_URI is missing. Add it to server/.env before using the database.");
}

app.listen(port, () => console.log(`Server running on ${port}`));
