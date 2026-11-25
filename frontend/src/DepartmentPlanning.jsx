import { useState } from "react";

const demoAbsences = [
  {
    id: 1,
    name: "Alex Morgan",
    startDate: "2026-11-27",
    endDate: "2026-11-28",
    type: "Vacation",
    status: "Approved",
  },
  {
    id: 2,
    name: "Emma Wilson",
    startDate: "2026-11-30",
    endDate: "2026-12-02",
    type: "Personal leave",
    status: "Approved",
  },
  {
    id: 3,
    name: "James Taylor",
    startDate: "2026-11-29",
    endDate: "2026-11-29",
    type: "Vacation",
    status: "Rejected",
  },
];

function formatDate(date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export default function DepartmentPlanning() {
  const [month, setMonth] = useState("2026-11");

  const firstDay = `${month}-01`;
  const lastDay = new Date(
    Number(month.slice(0, 4)),
    Number(month.slice(5, 7)),
    0
  )
    .toISOString()
    .slice(0, 10);

  const visibleAbsences = demoAbsences.filter(
    (absence) =>
      absence.status === "Approved" &&
      absence.startDate <= lastDay &&
      absence.endDate >= firstDay
  );

  return (
    <main className="min-h-[calc(100svh-80px)] bg-[#f7f5ff] px-5 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-semibold text-[#6335d1]">
          Department planning
        </h1>

        <p className="mt-3 text-gray-600">
          View approved absences in your department.
        </p>

        <p className="mt-6 rounded-lg bg-[#eee8ff] p-4 text-sm text-[#5330a8]">
          Demo data — the department and absences are not loaded from the server yet.
        </p>

        <label className="mt-8 block max-w-xs">
          <span className="mb-2 block font-semibold text-gray-700">
            Select month
          </span>
          <input
            type="month"
            value={month}
            onChange={(event) => setMonth(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:outline-2 focus:outline-offset-2 focus:outline-[#6335d1]"
          />
        </label>

        <div className="mt-8 space-y-4">
          {visibleAbsences.length === 0 ? (
            <p className="rounded-xl bg-white p-6 text-gray-600">
              No approved absences for this month.
            </p>
          ) : (
            visibleAbsences.map((absence) => (
              <article
                key={absence.id}
                className="rounded-xl border border-purple-100 bg-white p-5 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-6"
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {absence.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    {absence.type}
                  </p>
                </div>

                <p className="mt-4 font-medium text-[#6335d1] sm:mt-0">
                  {formatDate(absence.startDate)} –{" "}
                  {formatDate(absence.endDate)}
                </p>
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  );
}