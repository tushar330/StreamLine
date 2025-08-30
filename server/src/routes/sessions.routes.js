import { Router } from "express";
import mongoose from "mongoose";
import RecordingSession from "../models/RecordingSession.js";

const r = Router();

/**
 * POST /api/sessions/finalize
 * body: { sessionId, userId, chunks: string[] }
 * For Phase 1 we just persist if DB connected, else log.
 */
r.post("/finalize", async (req, res, next) => {
  try {
    const { sessionId = "testSession", userId = "u1", chunks = [] } = req.body || {};

    // If Mongo is connected, store; otherwise log and continue.
    const connected = mongoose.connection?.readyState === 1;

    if (connected) {
      await RecordingSession.create({
        sessionId,
        userId,
        chunks,
        status: "processing", // Phase 2 will do the merge and update to 'done'
      });
    } else {
      console.log("[FINALIZE] (no DB) ", { sessionId, userId, chunksCount: chunks.length });
    }

    res.json({ ok: true, chunks });
  } catch (e) {
    next(e);
  }
});

export default r;
