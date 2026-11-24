import { useEffect, useState } from "react";
import { api } from "./api/client";

export default function LeaveBalance() {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadBalance() {
      setLoading(true);
      setError("");

      try {
        const result = await api.getLeaveBalance();

        if (!cancelled) {
          if (
            result?.total_days == null ||
            result?.approved_days == null ||
            result?.remaining_days == null
          ) {
            throw new Error("Balance data is unavailable.");
          }

          setBalance(result);
        }
      } catch {
        if (!cancelled) {
          setBalance(null);
          setError("Could not load your leave balance. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadBalance();

    return () => {
      cancelled = true;
    };
  }, [reloadCount]);

  return (
    <main className="min-h-[calc(100svh-80px)] bg-[#f7f5ff] px-5 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-semibold text-[#6335d1]">
          My leave balance
        </h1>
        <p className="mt-3 text-gray-600">
          See how many leave days you have left.
        </p>

        {loading ? (
          <p role="status" className="mt-8 text-gray-600">
            Loading your balance...
          </p>
        ) : error ? (
          <div role="alert" className="mt-8 rounded-xl bg-white p-6">
            <p className="text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => setReloadCount((count) => count + 1)}
              className="mt-4 cursor-pointer rounded-lg bg-[#6335d1] px-5 py-2 font-semibold text-white hover:bg-[#5330a8]"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <p className="mt-8 text-sm text-gray-600">
              Year: {balance.year}
            </p>

            <div className="mt-4 grid gap-5 sm:grid-cols-3">
              <div className="rounded-xl border border-purple-100 bg-white p-6 shadow-sm">
                <h2 className="text-sm font-semibold text-gray-600">
                  Total days
                </h2>
                <p className="mt-3 text-3xl font-bold text-[#6335d1]">
                  {balance.total_days}
                </p>
              </div>

              <div className="rounded-xl border border-purple-100 bg-white p-6 shadow-sm">
                <h2 className="text-sm font-semibold text-gray-600">
                  Approved days used
                </h2>
                <p className="mt-3 text-3xl font-bold text-[#6335d1]">
                  {balance.approved_days}
                </p>
              </div>

              <div className="rounded-xl bg-[#6335d1] p-6 text-white shadow-sm">
                <h2 className="text-sm font-semibold">
                  Remaining days
                </h2>
                <p className="mt-3 text-3xl font-bold">
                  {balance.remaining_days}
                </p>
              </div>
            </div>

            <p className="mt-6 text-sm text-gray-600">
              Rejected requests do not reduce your balance.
            </p>
          </>
        )}
      </div>
    </main>
  );
}