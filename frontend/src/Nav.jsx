import { useEffect, useState } from "react";
import { api } from "./api/client";
import Logo from './assets/FinalProfs.png';

export default function App() {
  const [message, setMessage] = useState("Loading...");
  const [error, setError] = useState(null);

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <div className="flex flex-row items-center h-16 w-full bg-[#2D898B] px-6">
        <img
            src={Logo}
            alt="GeoProfs"
            className="h-12 w-auto"
        />
        </div>
    </div>
  );
}
