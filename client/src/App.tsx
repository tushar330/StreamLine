import { useEffect, useState } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { apiGet } from "./api/http";

export default function App() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    apiGet("/health").then(setHealth).catch(console.error);
  }, []);

  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <h1>Riverside Plus</h1>
      <pre>{JSON.stringify(health, null, 2)}</pre>
    </div>
  );
}
