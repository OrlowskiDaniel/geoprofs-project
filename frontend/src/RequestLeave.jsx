import { useEffect, useState } from "react";
import { api } from "./api/client";

function calculateDays(startDate, endDate) {
    if (!startDate || !endDate || endDate < startDate) return 0;
    const start = Date.parse(`${startDate}T00:00:00Z`);
    const end = Date.parse(`${endDate}T00:00:00Z`);
    return Math.round((end - start) / 86400000) + 1;
}

const inputClass =
    "w-full rounded-lg bg-white px-4 py-3 text-gray-900 focus:outline-2 focus:outline-offset-2 focus:outline-white";

export default function RequestLeave() {
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [leaveTypeId, setLeaveTypeId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const totalDays = calculateDays(startDate, endDate);

    useEffect(() => {
        api.getLeaveTypes().then(setLeaveTypes).catch(() => {});
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setMessage("");

        if (!leaveTypeId) {
            setError("Please select a leave type.");
            return;
        }

        if (!startDate || !endDate || endDate < startDate) {
            setError("Please select a valid date range.");
            return;
        }

        if (!reason.trim()) {
            setError("Please enter a reason for your leave.");
            return;
        }

        try {
            await api.createLeaveRequest({
                leave_type_id: parseInt(leaveTypeId),
                start_date: startDate,
                end_date: endDate,
                reason: reason.trim(),
                number_of_days: totalDays,
                personal_leave: false,
            });

            setMessage("Your leave request has been submitted successfully.");
            setLeaveTypeId("");
            setStartDate("");
            setEndDate("");
            setReason("");
        } catch {
            setError("Something went wrong. Please try again.");
        }
    }

    return (
        <main className="min-h-[calc(100svh-80px)] bg-[#f7f5ff] px-5 py-10 font-sans text-[#1f2937]">
            <div className="mx-auto max-w-2xl">
                <h1 className="text-4xl font-semibold text-[#6335d1]">Request leave</h1>

                <p className="mt-3 text-gray-600">
                    Choose your leave type, select the dates and provide a reason.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 rounded-xl bg-[#6335d1] p-6 text-white sm:p-10"
                >
                    <label className="block">
                        <span className="mb-2 block font-medium">Leave type *</span>
                        <select
                            value={leaveTypeId}
                            onChange={(e) => { setLeaveTypeId(e.target.value); setError(""); }}
                            required
                            className={inputClass}
                        >
                            <option value="">Select a leave type</option>
                            {leaveTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className="mt-6 grid gap-6 sm:grid-cols-2">
                        <label>
                            <span className="mb-2 block font-medium">Start date *</span>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => { setStartDate(e.target.value); setError(""); }}
                                required
                                className={inputClass}
                            />
                        </label>

                        <label>
                            <span className="mb-2 block font-medium">End date *</span>
                            <input
                                type="date"
                                value={endDate}
                                min={startDate || undefined}
                                onChange={(e) => { setEndDate(e.target.value); setError(""); }}
                                required
                                className={inputClass}
                            />
                        </label>
                    </div>

                    <div className="mt-6 rounded-lg border border-white/30 bg-white/10 p-4">
                        <p className="font-semibold">
                            Total: {totalDays} {totalDays === 1 ? "day" : "days"}
                        </p>
                        <p className="mt-1 text-sm text-white/80">
                            Calendar days, including start and end dates.
                        </p>
                    </div>

                    <label className="mt-6 block">
                        <span className="mb-2 block font-medium">Reason *</span>
                        <textarea
                            value={reason}
                            onChange={(e) => { setReason(e.target.value); setError(""); }}
                            placeholder="Enter the reason for your leave..."
                            required
                            maxLength={1000}
                            rows={6}
                            className={`${inputClass} resize-y placeholder:text-gray-500`}
                        />
                    </label>

                    <p className="mt-2 text-right text-sm text-white/80">
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
                        className="mt-6 cursor-pointer rounded-lg bg-white px-6 py-3 font-semibold text-[#6335d1] hover:bg-[#eee8ff]"
                    >
                        Submit request
                    </button>
                </form>
            </div>
        </main>
    );
}
