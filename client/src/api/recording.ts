import { api } from "./http";

export type PresignResponse = { key: string; url: string };

export async function getPresignedUrl(params: {
  ext: string;
  contentType: string;
  sessionId: string;
  userId: string;
  seq: string; // zero-padded
}) {
  const res = await api.get<PresignResponse>("/api/uploads/presign", { params });
  return res.data;
}

export async function finalizeSession(body: {
  sessionId: string;
  userId: string;
  chunks: string[];
}) {
  const res = await api.post("/api/sessions/finalize", body);
  return res.data;
}
