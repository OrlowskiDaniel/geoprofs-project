import { useState } from "react";

// Demo data. Replace this with records returned by the backend.
const demoRecords = [
  {
    id: 1,
    user: "Alex Morgan",
    action: "Profile updated",
    date: "2026-10-05T09:30:00",
    details: "Personal contact information updated.",
  },
  {
    id: 2,
    user: "Emma Wilson",
    action: "Leave requested",
    date: "2026-10-05T08:45:00",
    details: "A new leave request was submitted.",
  },
  {
    id: 3,
    user: "James Taylor",
    action: "Password changed",
    date: "2026-10-04T15:20:00",
    details: "Account password changed.",
  },
  {
    id: 4,
    user: "Alex Morgan",
    action: "Login",
    date: "2026-10-04T08:00:00",
    details: "User signed in.",
  },
];

export default function AuditTrail() {
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("");
  const [date, setDate] = useState("");

  const actions = [...new Set(demoRecords.map((record) => record.action))];

  const filteredRecords = demoRecords
    .filter((record) => {
      const matchesSearch = [
        record.user,
        record.action,
        record.details,
      ].some((value) =>
        value.toLowerCase().includes(search.trim().toLowerCase())
      );

      const matchesAction = !action || record.action === action;
      const matchesDate = !date || record.date.startsWith(date);

      return matchesSearch && matchesAction && matchesDate;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  function resetFilters() {
    setSearch("");
    setAction("");
    setDate("");
  }

  return (
    <main className="min-h-svh bg-[#f7f5ff] px-5 py-10 font-sans text-[#1f2937]">
      <div className="mx-auto max-w-6xl">
        <a
          href="#"
          className="text-sm text-[#6335d1] hover:underline"
        >
          ← Back to login
        </a>

        <h1 className="mt-6 text-4xl font-semibold text-[#6335d1]">
          Audit trail
        </h1>

        <p className="mt-3 text-gray-600">
          View user activity and important system actions.
        </p>

        <div className="mt-6 rounded-lg border border-[#ded3ff] bg-[#eee8ff] p-4 text-sm text-[#5330a8]">
          Demo records — live audit data will be provided by the backend.
        </div>

        <section
          aria-label="Audit filters"
          className="mt-6 grid gap-4 rounded-xl bg-[#6335d1] p-6 text-white md:grid-cols-3"
        >
          <label>
            <span className="mb-2 block">Search</span>
            <input
              type="search"
              placeholder="Search users or actions"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-lg bg-white px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#6335d1]"
            />
          </label>

          <label>
            <span className="mb-2 block">Action</span>
            <select
              value={action}
              onChange={(event) => setAction(event.target.value)}
              className="w-full rounded-lg bg-white px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-white"
            >
              <option value="">All actions</option>
              {actions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-2 block">Date</span>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="w-full rounded-lg bg-white px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-white"
            />
          </label>
        </section>

        <div className="my-5 flex items-center justify-between gap-4">
          <p role="status" className="text-sm text-gray-600">
            {filteredRecords.length} records found
          </p>

          <button
            type="button"
            onClick={resetFilters}
            className="cursor-pointer text-sm font-semibold text-[#6335d1] hover:underline"
          >
            Reset filters
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <caption className="sr-only">
              Audit records, ordered from newest to oldest
            </caption>

            <thead className="bg-[#eee8ff] text-[#5330a8]">
              <tr>
                <th scope="col" className="px-6 py-4">User</th>
                <th scope="col" className="px-6 py-4">Action</th>
                <th scope="col" className="px-6 py-4">Date and time</th>
                <th scope="col" className="px-6 py-4">Details</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.map((record) => (
                <tr
                  key={record.id}
                  className="border-t border-gray-100 hover:bg-[#faf8ff]"
                >
                  <td className="px-6 py-4 font-medium">
                    {record.user}
                  </td>
                  <td className="px-6 py-4">
                    {record.action}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <time dateTime={record.date}>
                      {new Date(record.date).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {record.details}
                  </td>
                </tr>
              ))}

              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No audit records match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}