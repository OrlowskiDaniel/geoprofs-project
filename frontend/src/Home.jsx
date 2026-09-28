import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

export default function Home() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const date = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const time = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <main className="min-h-screen bg-[#F5F3FF] text-[#6D28D9]">
      <div className="flex justify-end px-20 pt-24">
        <div className="text-center text-xl">
          <p>{date}</p>
          <p>{time}</p>
        </div>
      </div>

      <div className="flex w-full justify-center pt-44">
        <h1 className="!text-5xl !font-normal !text-[#6D28D9]">
          Welcome "name"
        </h1>
      </div>
    </main>
  );
}
