import { useEffect, useState } from "react";
import { api } from "./api/client";

export default function App() {
  const [message, setMessage] = useState("Loading...");
  const [error, setError] = useState(null);

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>GeoProfs — React Client</h1>
    </div>
  );
}
