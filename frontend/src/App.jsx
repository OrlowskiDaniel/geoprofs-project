import { useEffect, useState } from "react";
import { api } from "./api/client";

export default function App() {
  const [message, setMessage] = useState("Loading...");
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .hello()
      .then((data) => setMessage(data.message))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>GeoProfs — React Client</h1>
      <p>This message came from the Laravel API, which read it from MySQL:</p>
      {error ? (
        <p style={{ color: "red" }}>Error: {error}. Is the Laravel server running?</p>
      ) : (
        <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{message}</p>
      )}
    </div>
  );
}
