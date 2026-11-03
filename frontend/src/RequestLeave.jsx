import { useState } from "react";

// Demo options. Match these values with the backend before integration.
const leaveTypes = [
  { value: "annual", label: "Annual leave" },
  { value: "sick", label: "Sick leave" },
  { value: "unpaid", label: "Unpaid leave" },
  { value: "other", label: "Other" },
];

function calculateDays(startDate, endDate) {
  if (!startDate || !endDate || endDate < startDate) {
    return 0;
  }

  const start = Date.parse(`${startDate}T00:00:00Z`);
  const end = Date.parse(`${endDate}T00:00:00Z`);

  return Math.round((end - start) / 86400000) + 1;
}

const inputClass =
  "w-full rounded-lg bg-white px-4 py-3 text-gray-900 focus:outline-2 focus:outline-offset-2 focus:outline-white";

export default function RequestLeave() {
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const totalDays = calculateDays(startDate, endDate);
  const reasonRequired = leaveType !== "sick";

  function clearFeedback() {
    setError("");
    setMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    clearFeedback();

    if (!leaveType) {
      setError("Please select a leave type.");
      return;
    }

    if (!startDate || !endDate || endDate < startDate) {
      setError("Please select a valid date range.");
      return;
    }

    if (reasonRequired && !reason.trim()) {
      setError("Please enter a reason for your leave.");
      return;
    }

    // API integration goes here.
    // Available values: leaveType, startDate, endDate, reason, totalDays.
    setMessage(
      "Your form is complete. The request has not been submitted yet."
    );
  }

  return (
    <main className="min-h-[calc(100svh-80px)] bg-[#f7f5ff] px-5 py-10 font-sans text-[#1f2937]">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-semibold text-[#6335d1]">
          Request leave
        </h1>

        <p className="mt-3 text-gray-600">
          Choose your leave type, select the dates and provide a reason
          if required.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-xl bg-[#6335d1] p-6 text-white sm:p-10"
        >
          <label className="block">
            <span className="mb-2 block font-medium">
              Leave type *
            </span>

            <select
              value={leaveType}
              onChange={(event) => {
                setLeaveType(event.target.value);
                clearFeedback();
              }}
              required
              className={inputClass}
            >
              <option value="">Select a leave type</option>

              {leaveTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <label>
              <span className="mb-2 block font-medium">
                Start date *
              </span>

              <input
                type="date"
                value={startDate}
                onChange={(event) => {
                  setStartDate(event.target.value);
                  clearFeedback();
                }}
                required
                className={inputClass}
              />
            </label>

            <label>
              <span className="mb-2 block font-medium">
                End date *
              </span>

              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(event) => {
                  setEndDate(event.target.value);
                  clearFeedback();
                }}
                required
                className={inputClass}
              />
            </label>
          </div>

          <div
            role="status"
            className="mt-6 rounded-lg border border-white/30 bg-white/10 p-4"
          >
            <p className="font-semibold">
              Total: {totalDays} {totalDays === 1 ? "day" : "days"}
            </p>

            <p className="mt-1 text-sm text-white/80">
              Calendar days, including the start and end dates.
            </p>
          </div>

          <label className="mt-6 block">
            <span className="mb-2 block font-medium">
              Reason {reasonRequired ? "*" : "(optional)"}
            </span>

            <textarea
              value={reason}
              onChange={(event) => {
                setReason(event.target.value);
                clearFeedback();
              }}
              placeholder="Enter the reason for your leave..."
              required={reasonRequired}
              maxLength={1000}
              rows={6}
              aria-describedby="reason-count"
              className={`${inputClass} resize-y placeholder:text-gray-500`}
            />
          </label>

          <p
            id="reason-count"
            className="mt-2 text-right text-sm text-white/80"
          >
            {reason.length}/1000 characters
          </p>

          {error && (
            <p
              role="alert"
              className="mt-5 rounded-lg bg-white p-4 text-red-700"
            >
              {error}
            </p>
          )}

          {message && (
            <p
              role="status"
              className="mt-5 rounded-lg bg-white p-4 text-[#5330a8]"
            >
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