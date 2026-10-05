import { useEffect, useState } from "react";
import { api } from "./api/client";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    // Connect the authentication API here when the backend is ready.
    setMessage(
      "The login form is ready. Authentication will be available once the backend is connected."
    );
  }

  return (
    <main className="grid min-h-svh place-items-center bg-linear-to-br from-[#f5f3ff] to-[#e0e7ff] p-6 font-sans text-[#1f2937] antialiased">
      <div className="w-full max-w-[420px] rounded-[20px] bg-white p-10 shadow-[0_20px_50px_rgba(46,32,92,0.12)] max-[480px]:px-[22px] max-[480px]:py-7">
        <div className="grid h-[52px] w-[52px] place-items-center rounded-[14px] bg-[#6d28d9] text-xl font-bold text-white">
          GP
        </div>

        <h1 className="mt-7 mb-2 text-[28px] leading-[1.2] font-bold text-[#1f2937]">
          Welcome to GeoProfs
        </h1>
        <p className="mb-[30px] text-[#6b7280]">
          Login to continue.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <label htmlFor="email" className="mb-2 text-sm font-semibold">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="mb-5 w-full rounded-[10px] border border-[#d1d5db] bg-white px-[14px] py-[13px] text-[#1f2937] outline-none focus:border-[#8b5cf6] focus:outline-2 focus:outline-offset-1 focus:outline-[#8b5cf6]"
          />

          <label htmlFor="password" className="mb-2 text-sm font-semibold">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="mb-5 w-full rounded-[10px] border border-[#d1d5db] bg-white px-[14px] py-[13px] text-[#1f2937] outline-none focus:border-[#8b5cf6] focus:outline-2 focus:outline-offset-1 focus:outline-[#8b5cf6]"
          />

          <button
            type="submit"
            className="w-full cursor-pointer rounded-[10px] bg-[#6d28d9] p-[14px] font-semibold text-white hover:bg-[#5b21b6] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#8b5cf6]"
          >
            Log in
          </button>
        </form>

        {message && (
          <p role="status" className="mt-[18px] text-sm leading-[1.5] text-[#5b21b6]">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
