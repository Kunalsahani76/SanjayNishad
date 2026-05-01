import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    mediaUrl: String,
    type: { type: String, default: "video" },
    isLive: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("News", newsSchema);
