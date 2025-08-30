import { Router } from "express";
import { presignPut } from "../services/s3.service.js";

const r = Router();

/**
 * GET /api/uploads/presign?ext=webm&contentType=video/webm&sessionId=...&userId=...&seq=0001
 * Returns: { key, url }
 */
r.get("/presign", async (req, res, next) => {
  try {
    const {
      ext = "webm",
      contentType = "video/webm",
      sessionId = "testSession",
      userId = "u1",
      seq = "0000",
    } = req.query;

    const stamp = Date.now(); // keeps keys unique even if seq repeats
    const key = `recordings/${sessionId}/${userId}/${stamp}.${seq}.${ext}`;

    const url = await presignPut({ Key: key, ContentType: contentType });
    console.log("Presigned URL:", url);
    res.json({ key, url });
  } catch (e) {
    next(e);
  }
});

export default r;
