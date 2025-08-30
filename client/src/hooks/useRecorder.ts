import { useRef, useState } from "react";
import { finalizeSession, getPresignedUrl } from "../api/recording";

type UseRecorderOpts = {
  sessionId: string;
  userId: string;
  chunkMs?: number; // timeslice in ms
  contentType?: string; // "video/webm"
  ext?: string; // "webm"
};

export function useRecorder(opts: UseRecorderOpts) {
  const {
    sessionId,
    userId,
    chunkMs = 3000,
    contentType = "video/webm",
    ext = "webm",
  } = opts;

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<string[]>([]);
  const seqRef = useRef<number>(0);

  const [isRecording, setIsRecording] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  function padSeq(n: number, width = 4) {
    return n.toString().padStart(width, "0");
  }

  async function start(): Promise<MediaStream> {
    setLastError(null);
    chunksRef.current = [];
    seqRef.current = 0;

    // capture
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localStreamRef.current = stream;

    // setup recorder
    const mimeType = "video/webm;codecs=vp8,opus";
    const mr = new MediaRecorder(stream, { mimeType });
    mediaRecorderRef.current = mr;

    mr.ondataavailable = async (e: BlobEvent) => {
      try {
        if (!e.data || e.data.size === 0) return;

        // get signed url
        const seq = padSeq(seqRef.current++);
        const { key, url } = await getPresignedUrl({
          ext,
          contentType,
          sessionId,
          userId,
          seq,
        });

        // upload chunk
        await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": contentType },
          body: e.data,
        });

        chunksRef.current.push(key);
      } catch (err: any) {
        console.error("Chunk upload failed:", err);
        setLastError(err?.message || "Chunk upload failed");
      }
    };

    mr.onstart = () => setIsRecording(true);
    mr.onstop = () => setIsRecording(false);

    mr.start(chunkMs); // emit blobs every chunkMs
    return stream;
  }

  async function stop() {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== "inactive") {
      mr.stop();
    }
    // wait a tick so last ondataavailable fires
    await new Promise((r) => setTimeout(r, 200));

    const chunks = [...chunksRef.current];
    await finalizeSession({ sessionId, userId, chunks });

    // cleanup local stream tracks
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;

    return chunks;
  }

  return {
    start,
    stop,
    isRecording,
    lastError,
  };
}
