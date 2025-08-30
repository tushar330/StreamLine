import mongoose from "mongoose";

const schema = new mongoose.Schema({
  sessionId: String,
  userId: String,
  chunks: [String],
  finalKey: String,
  status: {
    type: String,
    enum: ["pending", "processing", "done", "failed"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.RecordingSession ||
  mongoose.model("RecordingSession", schema);
