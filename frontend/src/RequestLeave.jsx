import { useState } from "react";

export default function RequestLeave() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!reason.trim()) {
      setError("Please enter a reason for your leave.");
      return;
    }

    if (endDate < startDate) {
      setError("The end date must be on or after the start date.");
      return;
    }

    const request = {
      startDate,
      endDate,
      reason: reason.trim(),
    };

    // Send request to the backend when the API is ready.
    // The backend must associate it with the signed-in employee.
    setMessage(
      "Your request is ready for submission. It has not been sent because the backend is not connected."
    );
  }

  return (
    <main className="min-h-[calc(100svh-80px)] bg-[#f7f5ff] px-5 py-10 font-sans text-[#1f2937]">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-semibold text-[#6335d1]">
          Request leave
        </h1>

        <p className="mt-3 text-gray-600">
          Select your leave dates and explain the reason for your request.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-xl bg-[#6335d1] p-6 text-white sm:p-10"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <label>
              <span className="mb-2 block font-medium">Start date *</span>
              <input
                type="date"
                value={startDate}
                onChange={(event) => {
                  setStartDate(event.target.value);
                  setError("");
                  setMessage("");
                }}
                required
                className="w-full rounded-lg bg-white px-4 py-3 text-gray-900 focus:outline-2 focus:outline-offset-2 focus:outline-white"
              />
            </label>

            <label>
              <span className="mb-2 block font-medium">End date *</span>
              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(event) => {
                  setEndDate(event.target.value);
                  setError("");
                  setMessage("");
                }}
                required
                className="w-full rounded-lg bg-white px-4 py-3 text-gray-900 focus:outline-2 focus:outline-offset-2 focus:outline-white"
              />
            </label>
          </div>

          <label className="mt-6 block">
            <span className="mb-2 block font-medium">Reason *</span>
            <textarea
              value={reason}
              onChange={(event) => {
                setReason(event.target.value);
                setError("");
                setMessage("");
              }}
              placeholder="Enter the reason for your leave..."
              required
              maxLength={1000}
              rows={6}
              aria-describedby="reason-count"
              className="w-full resize-y rounded-lg bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-2 focus:outline-offset-2 focus:outline-white"
            />
          </label>

          <p id="reason-count" className="mt-2 text-right text-sm text-white/80">
            {reason.length}/1000 characters
          </p>

          {error && (
            <p role="alert" className="mt-5 rounded-lg bg-white p-4 text-red-700">
              {error}
            </p>
          )}

          {message && (
            <p role="status" className="mt-5 rounded-lg bg-white p-4 text-[#5330a8]">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="mt-6 cursor-pointer rounded-lg bg-white px-6 py-3 font-semibold text-[#6335d1] hover:bg-[#eee8ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Submit request
          </button>
        </form>
      </div>
    </main>
  );
}