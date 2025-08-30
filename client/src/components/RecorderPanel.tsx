import { useRef, useState } from "react";
import { useRecorder } from "../hooks/useRecorder";

export default function RecorderPanel() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [started, setStarted] = useState(false);

  const recorder = useRecorder({
    sessionId: "sess1",
    userId: "u1",
    chunkMs: 3000,
  });

  const onStart = async () => {
    const stream = await recorder.start();
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }
    setStarted(true);
  };

  const onStop = async () => {
    await recorder.stop();
    setStarted(false);
  };

  return (
    <div style={{ fontFamily: "system-ui", padding: 16 }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{ width: 480, borderRadius: 8, marginBottom: 8 }}
      />
      <div style={{ display: "flex", gap: 8 }}>
        {!started ? (
          <button onClick={onStart}>Start Recording</button>
        ) : (
          <button onClick={onStop}>Stop Recording</button>
        )}
      </div>
      {recorder.lastError && (
        <p style={{ color: "crimson" }}>Error: {recorder.lastError}</p>
      )}
      <p>Status: {recorder.isRecording ? "Recording…" : "Idle"}</p>
    </div>
  );
}
