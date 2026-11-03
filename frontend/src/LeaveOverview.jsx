import { useRef, useState } from "react";

const demoOfficeManager = {
  id: "office-manager-demo",
  name: "Sam Taylor",
};

const demoRequests = [
  {
    id: 1,
    name: "Alex Morgan",
    role: "Employee",
    leaveType: "Annual leave",
    startDate: "2026-11-09",
    endDate: "2026-11-11",
    status: "Pending",
    assignedTo: null,
  },
  {
    id: 2,
    name: "Emma Wilson",
    role: "Manager",
    leaveType: "Annual leave",
    startDate: "2026-11-12",
    endDate: "2026-11-16",
    status: "Pending",
    assignedTo: null,
  },
  {
    id: 3,
    name: "Sam Taylor",
    role: "Office manager",
    leaveType: "Personal day",
    startDate: "2026-11-18",
    endDate: "2026-11-18",
    status: "Approved",
    assignedTo: null,
  },
  {
    id: 4,
    name: "James Brown",
    role: "Administrator",
    leaveType: "Annual leave",
    startDate: "2026-11-23",
    endDate: "2026-11-25",
    status: "Rejected",
    assignedTo: null,
  },
];

const roles = [
  "Employee",
  "Manager",
  "Office manager",
  "Administrator",
];

const statusClasses = {
  Pending: "bg-amber-100 text-amber-800",
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

function formatDate(date) {
  const [year, month, day] = date.split("-");
  return `${day}-${month}-${year}`;
}

export default function LeaveOverview() {
  const [requests, setRequests] = useState(demoRequests);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [message, setMessage] = useState("");

  const dialogRef = useRef(null);

  const selectedRequest = requests.find(
    (request) => request.id === selectedRequestId
  );

  const filteredRequests = requests.filter((request) => {
    const matchesName = request.name
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    const matchesRole =
      !selectedRole || request.role === selectedRole;

    return matchesName && matchesRole;
  });

  function resetFilters() {
    setSearch("");
    setSelectedRole("");
  }

  function openTakeover(request) {
    setMessage("");
    setSelectedRequestId(request.id);
    dialogRef.current.showModal();
  }

  function closeTakeover() {
    dialogRef.current.close();
    setSelectedRequestId(null);
  }

  function confirmTakeover() {
    if (
      !selectedRequest ||
      selectedRequest.role !== "Manager" ||
      selectedRequest.status !== "Pending"
    ) {
      closeTakeover();
      return;
    }

    // Demo only. The backend must approve and assign the request
    // together, using the authenticated office manager's identity.
    setRequests((current) =>
      current.map((request) =>
        request.id === selectedRequest.id
          ? {
              ...request,
              status: "Approved",
              assignedTo: demoOfficeManager,
            }
          : request
      )
    );

    setMessage(
      `Demo: ${selectedRequest.name}'s leave request was approved and assigned to ${demoOfficeManager.name}. No changes were saved to the server.`
    );

    closeTakeover();
  }

  return (
    <main className="min-h-[calc(100svh-80px)] bg-[#f7f5ff] px-5 py-10 font-sans text-[#1f2937]">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-semibold text-[#6335d1]">
          Leave requests overview
        </h1>

        <p className="mt-3 text-gray-600">
          View leave requests from all users.
        </p>

        <p className="mt-6 rounded-lg bg-[#eee8ff] p-4 text-sm text-[#5330a8]">
          Demo data. Takeovers use the demo office manager,
          Sam Taylor. Changes reset when you leave or reload this page.
        </p>

        <section
          aria-label="Filter leave requests"
          className="mt-6 grid gap-5 rounded-xl bg-[#6335d1] p-6 text-white sm:grid-cols-2"
        >
          <label>
            <span className="mb-2 block font-medium">
              Search user
            </span>

            <input
              type="search"
              placeholder="Enter a user's name"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-lg bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-2 focus:outline-offset-2 focus:outline-white"
            />
          </label>

          <label>
            <span className="mb-2 block font-medium">
              User role
            </span>

            <select
              value={selectedRole}
              onChange={(event) => setSelectedRole(event.target.value)}
              className="w-full rounded-lg bg-white px-4 py-3 text-gray-900 focus:outline-2 focus:outline-offset-2 focus:outline-white"
            >
              <option value="">All roles</option>

              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>
        </section>

        <div className="my-5 flex items-center justify-between gap-4">
          <p role="status" className="text-sm text-gray-600">
            {filteredRequests.length}{" "}
            {filteredRequests.length === 1 ? "request" : "requests"} found
          </p>

          <button
            type="button"
            onClick={resetFilters}
            className="cursor-pointer text-sm font-semibold text-[#6335d1] hover:underline"
          >
            Reset filters
          </button>
        </div>

        {message && (
          <p
            role="status"
            className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800"
          >
            {message}
          </p>
        )}

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <caption className="sr-only">
              Leave requests from all users
            </caption>

            <thead className="bg-[#eee8ff] text-[#5330a8]">
              <tr>
                <th scope="col" className="px-5 py-4">User</th>
                <th scope="col" className="px-5 py-4">Role</th>
                <th scope="col" className="px-5 py-4">Leave type</th>
                <th scope="col" className="px-5 py-4">Start date</th>
                <th scope="col" className="px-5 py-4">End date</th>
                <th scope="col" className="px-5 py-4">Status</th>
                <th scope="col" className="px-5 py-4">Assigned to</th>
                <th scope="col" className="px-5 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  className="border-t border-gray-100 hover:bg-[#faf8ff]"
                >
                  <td className="px-5 py-4 font-medium">
                    {request.name}
                  </td>

                  <td className="px-5 py-4">{request.role}</td>
                  <td className="px-5 py-4">{request.leaveType}</td>

                  <td className="whitespace-nowrap px-5 py-4">
                    {formatDate(request.startDate)}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    {formatDate(request.endDate)}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-block rounded-full px-3 py-1 font-medium ${
                        statusClasses[request.status]
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    {request.assignedTo?.name || "Not assigned"}
                  </td>

                  <td className="px-5 py-4">
                    {request.role === "Manager" &&
                    request.status === "Pending" ? (
                      <button
                        type="button"
                        onClick={() => openTakeover(request)}
                        className="cursor-pointer rounded-lg bg-[#6335d1] px-4 py-2 font-semibold text-white hover:bg-[#5330a8]"
                      >
                        Accept and take over
                        <span className="sr-only">
                          {" "}for {request.name}
                        </span>
                      </button>
                    ) : (
                      <span className="text-gray-500">
                        No action available
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {filteredRequests.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-center text-gray-500"
                  >
                    No leave requests match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="takeover-title"
        aria-describedby="takeover-description"
        onClose={() => setSelectedRequestId(null)}
        className="fixed inset-0 m-auto max-h-[90svh] w-[calc(100%-40px)] max-w-lg overflow-y-auto rounded-xl bg-white p-6 text-[#1f2937] shadow-xl backdrop:bg-black/50"
      >
        <h2
          id="takeover-title"
          className="text-2xl font-semibold text-[#6335d1]"
        >
          Accept and take over
        </h2>

        <p id="takeover-description" className="mt-4 text-gray-600">
          You are about to approve {selectedRequest?.name}'s leave
          request and assign it to {demoOfficeManager.name}.
        </p>

        <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm">
          <li>
            Check the manager's leave dates:{" "}
            {selectedRequest &&
              `${formatDate(selectedRequest.startDate)} to ${formatDate(
                selectedRequest.endDate
              )}.`}
          </li>
          <li>Approve the selected leave request.</li>
          <li>
            Assign the takeover to {demoOfficeManager.name}, the demo
            office manager.
          </li>
        </ol>

        <p className="mt-5 text-sm text-gray-500">
          This only updates the demo. It does not change account roles
          or permissions.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            autoFocus
            onClick={closeTakeover}
            className="cursor-pointer rounded-lg border border-gray-300 px-5 py-2 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={confirmTakeover}
            className="cursor-pointer rounded-lg bg-[#6335d1] px-5 py-2 font-semibold text-white hover:bg-[#5330a8]"
          >
            Confirm takeover
          </button>
        </div>
      </dialog>
    </main>
  );
}