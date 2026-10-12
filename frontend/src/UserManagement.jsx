import { ROLE_LABELS, ROLES } from "./auth/roles";

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
  return (
    <main className="min-h-[calc(100svh-80px)] bg-[#f7f5ff] px-5 py-10 font-sans">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-semibold text-[#6335d1]">
          User management
        </h1>

        <p className="mt-3 text-gray-600">
          View users and their assigned roles.
        </p>

        <p className="mt-6 rounded-lg bg-[#eee8ff] p-4 text-sm text-[#5330a8]">
          Demo users — live user data will be provided by the backend.
        </p>

        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full min-w-[600px] text-left text-sm">
            <caption className="sr-only">
              Users and their assigned roles
            </caption>

            <thead className="bg-[#eee8ff] text-[#5330a8]">
              <tr>
                <th scope="col" className="px-6 py-4">Name</th>
                <th scope="col" className="px-6 py-4">Email</th>
                <th scope="col" className="px-6 py-4">Roles</th>
              </tr>
            </thead>

            <tbody>
              {demoUsers.map((user) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}