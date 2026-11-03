import { useEffect, useState } from "react";
import { api } from "./api/client";

const typeLabels = {
  Ziekmelding: "Sick leave",
  Verlofaanvraag: "Annual leave",
  "Persoonlijke dag": "Personal day",
};

function calculateDays(startDate, endDate) {
  if (!startDate || !endDate || endDate < startDate) {
    return 0;
  }

  const start = Date.parse(`${startDate}T00:00:00Z`);
  const end = Date.parse(`${endDate}T00:00:00Z`);

  return Math.round((end - start) / 86400000) + 1;
}

const inputClass =
  "w-full rounded-lg bg-white px-4 py-3 text-gray-900 disabled:opacity-60 focus:outline-2 focus:outline-offset-2 focus:outline-white";

export default function RequestLeave() {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadCount, setReloadCount] = useState(0);

  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadLeaveTypes() {
      setIsLoading(true);
      setLoadError("");

      try {
        const data = await api.getLeaveTypes();

        if (!Array.isArray(data)) {
          throw new Error("Unable to read the available leave types.");
        }

        if (!cancelled) {
          setLeaveTypes(data);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(error.message || "Unable to load leave types.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadLeaveTypes();

    return () => {
      cancelled = true;
    };
  }, [reloadCount]);

  const selectedType = leaveTypes.find(
    (type) => String(type.id) === leaveType
  );

  const reasonRequired = selectedType?.name !== "Ziekmelding";
  const totalDays = calculateDays(startDate, endDate);

  function clearFeedback() {
    setError("");
    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) return;

    clearFeedback();

    if (!selectedType) {
      setError("Please select a leave type.");
      return;
    }

    if (!startDate || !endDate || totalDays < 1) {
      setError("Please select a valid date range.");
      return;
    }

    if (reasonRequired && !reason.trim()) {
      setError("Please enter a reason for your leave.");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.createLeaveRequest({
        leave_type_id: selectedType.id,
        start_date: startDate,
        end_date: endDate,
        number_of_days: totalDays,
        reason: reason.trim(),
        personal_leave: selectedType.name === "Persoonlijke dag",
      });

      setMessage("Your leave request has been submitted successfully.");
      setLeaveType("");
      setStartDate("");
      setEndDate("");
      setReason("");
    } catch (error) {
      setError(
        error.message || "Unable to submit your request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
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

        {isLoading ? (
          <p role="status" className="mt-8 text-gray-600">
            Loading leave types...
          </p>
        ) : loadError ? (
          <div className="mt-8 rounded-lg bg-white p-6">
            <p role="alert" className="text-red-700">
              {loadError}
            </p>
            <button
              type="button"
              onClick={() => setReloadCount((count) => count + 1)}
              className="mt-4 rounded-lg bg-[#6335d1] px-5 py-2 text-white"
            >
              Try again
            </button>
          </div>
        ) : leaveTypes.length === 0 ? (
          <p role="status" className="mt-8 text-gray-600">
            No leave types are currently available.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            aria-busy={isSubmitting}
            className="mt-8 rounded-xl bg-[#6335d1] p-6 text-white sm:p-10"
          >
            <fieldset disabled={isSubmitting} className="min-w-0">
              <legend className="sr-only">Leave request details</legend>

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
                    <option key={type.id} value={String(type.id)}>
                      {typeLabels[type.name] || type.name}
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
                  className={`${inputClass} resize-y`}
                />
              </label>

              <p
                id="reason-count"
                className="mt-2 text-right text-sm text-white/80"
              >
                {reason.length}/1000 characters
              </p>

              <button
                type="submit"
                className="mt-6 cursor-pointer rounded-lg bg-white px-6 py-3 font-semibold text-[#6335d1] hover:bg-[#eee8ff] disabled:cursor-wait disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Submit request"}
              </button>
            </fieldset>

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
          </form>
        )}
      </div>
    </main>
  );
}