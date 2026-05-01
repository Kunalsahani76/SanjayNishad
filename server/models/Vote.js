import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    candidateId: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("Vote", voteSchema);
