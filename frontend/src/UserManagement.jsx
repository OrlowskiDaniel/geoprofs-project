import { useState } from "react";
import { ROLE_LABELS, ROLES, hasValidRoles } from "./auth/roles";

const demoUsers = [
  {
    id: "user-1",
    name: "Alex Morgan",
    email: "alex@example.com",
    roles: [ROLES.EMPLOYEE],
  },
  {
    id: "user-2",
    name: "Emma Wilson",
    email: "emma@example.com",
    roles: [ROLES.MANAGER],
  },
  {
    id: "user-3",
    name: "James Taylor",
    email: "james@example.com",
    roles: [ROLES.ADMINISTRATOR],
  },
];

export default function UserManagement() {
  const [users, setUsers] = useState(demoUsers);
  const [editingId, setEditingId] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [error, setError] = useState("");

  function startEditing(user) {
    setEditingId(user.id);
    setSelectedRoles([...user.roles]);
    setError("");
  }

  function toggleRole(role) {
    setSelectedRoles((current) =>
      current.includes(role)
        ? current.filter((item) => item !== role)
        : [...current, role]
    );
    setError("");
  }

  function cancelEditing() {
    setEditingId(null);
    setSelectedRoles([]);
    setError("");
  }

  function saveRoles(event) {
    event.preventDefault();

    if (!hasValidRoles(selectedRoles)) {
      setError("Select at least one role.");
      return;
    }

    // Demo update only. Connect the role assignment API here.
    setUsers((current) =>
      current.map((user) =>
        user.id === editingId
          ? { ...user, roles: [...selectedRoles] }
          : user
      )
    );

    cancelEditing();
  }

  return (
    <main className="min-h-[calc(100svh-80px)] bg-[#f7f5ff] px-5 py-10 font-sans">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-semibold text-[#6335d1]">
          User management
        </h1>

        <p className="mt-3 text-gray-600">
          View users and manage their assigned roles.
        </p>

        <p className="mt-6 rounded-lg bg-[#eee8ff] p-4 text-sm text-[#5330a8]">
          Demo users — changes apply only to this page and reset when
          you reload or navigate away.
        </p>

        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full min-w-[700px] text-left text-sm">
            <caption className="sr-only">
              Users and their assigned roles
            </caption>

            <thead className="bg-[#eee8ff] text-[#5330a8]">
              <tr>
                <th scope="col" className="px-6 py-4">Name</th>
                <th scope="col" className="px-6 py-4">Email</th>
                <th scope="col" className="px-6 py-4">Roles</th>
                <th scope="col" className="px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-gray-100">
                  <td className="px-6 py-4 font-medium">{user.name}</td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {user.roles.map((role) => (
                        <span
                          key={role}
                          className="rounded-full bg-[#eee8ff] px-3 py-1 text-[#5330a8]"
                        >
                          {ROLE_LABELS[role]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => startEditing(user)}
                      className="cursor-pointer rounded-lg bg-[#6335d1] px-4 py-2 text-white hover:bg-[#5330a8]"
                    >
                      Edit roles
                      <span className="sr-only"> for {user.name}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editingId !== null && (
          <form
            onSubmit={saveRoles}
            className="mt-6 rounded-xl border border-purple-100 bg-white p-6"
          >
            <fieldset>
              <legend className="text-xl font-semibold text-[#6335d1]">
                Edit roles for{" "}
                {users.find((user) => user.id === editingId)?.name}
              </legend>

              <p className="mt-2 text-sm text-gray-600">
                Select at least one role.
              </p>

              <div className="mt-5 flex flex-wrap gap-6">
                {Object.values(ROLES).map((role) => (
                  <label key={role} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role)}
                      onChange={() => toggleRole(role)}
                      className="h-4 w-4 accent-[#6335d1]"
                    />
                    {ROLE_LABELS[role]}
                  </label>
                ))}
              </div>
            </fieldset>

            {error && (
              <p role="alert" className="mt-4 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                className="cursor-pointer rounded-lg bg-[#6335d1] px-5 py-2 text-white hover:bg-[#5330a8]"
              >
                Apply roles
              </button>

              <button
                type="button"
                onClick={cancelEditing}
                className="cursor-pointer rounded-lg border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}