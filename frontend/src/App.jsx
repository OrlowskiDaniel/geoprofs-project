import { useEffect, useState } from "react";
import Login from "./Login";
import PersonalData from "./PersonalData";
import RequestLeave from "./RequestLeave";
import UserManagement from "./UserManagement";
import AuditTrail from "./AuditTrail";
import LeaveOverview from "./LeaveOverview";
import { api } from "./api/client";

const rolePermissions = {
  Werknemer: [
    "requestLeave",
    "viewPersonalData",
  ],
  Manager: [
    "requestLeave",
    "viewPersonalData",
    "checkLeaveRequests",
  ],
  "Office Manager": [
    "requestLeave",
    "viewPersonalData",
    "checkLeaveRequests",
    "manageUsers",
    "viewLeaveOverview",
  ],
  Administrator: [
    "requestLeave",
    "viewPersonalData",
    "checkLeaveRequests",
    "manageUsers",
    "viewAuditTrail",
  ],
};

function hasPermission(user, permission) {
  if (!user) return false;

  return (rolePermissions[user.role] ?? []).includes(permission);
}

const navigation = [
  {
    label: "Change password",
    href: "#personal-data",
    permission: "viewPersonalData",
  },
  {
    label: "Request leave",
    href: "#request-leave",
    permission: "requestLeave",
  },
  {
    label: "Leave overview",
    href: "#leave-overview",
    permission: "viewLeaveOverview",
  },
  {
    label: "Audit trail",
    href: "#audit-trail",
    permission: "viewAuditTrail",
  },
  {
    label: "User management",
    href: "#users",
    permission: "manageUsers",
  },
];

export default function App() {
  const [page, setPage] = useState(window.location.hash);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const user = await api.getMe();

        if (!cancelled) {
          setCurrentUser(user);
        }
      } catch {
        if (!cancelled) {
          localStorage.removeItem("token");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function updatePage() {
      setPage(window.location.hash);
      window.scrollTo(0, 0);
    }

    window.addEventListener("hashchange", updatePage);

    return () => {
      window.removeEventListener("hashchange", updatePage);
    };
  }, []);

  async function handleLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await api.logout();
    } catch {
      // Clear the local session even if the server cannot be reached.
    } finally {
      localStorage.removeItem("token");
      setCurrentUser(null);
      setIsLoggingOut(false);
      window.location.hash = "";
    }
  }

  if (loading) {
    return (
      <main className="grid min-h-svh place-items-center bg-[#f7f5ff] font-sans">
        <p role="status" className="text-[#6335d1]">
          Loading...
        </p>
      </main>
    );
  }

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  const visibleNavigation = navigation.filter((item) =>
    hasPermission(currentUser, item.permission)
  );

  const requestedPage = navigation.find(
    (item) => item.href === page
  );

  const canAccessPage =
    !requestedPage ||
    hasPermission(currentUser, requestedPage.permission);

  const activePage = requestedPage
    ? requestedPage.href
    : visibleNavigation[0]?.href;

  return (
    <div className="min-h-svh bg-[#f7f5ff] font-sans">
      <header className="sticky top-0 z-30 border-b border-purple-100 bg-white shadow-sm">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4"
        >
          <a
            href="#personal-data"
            className="text-xl font-bold text-[#6335d1]"
          >
            GeoProfs
          </a>

          <span className="text-sm text-gray-600">
            {currentUser.first_name} {currentUser.last_name}
            {" · "}
            {currentUser.role}
          </span>

          <div className="flex flex-wrap items-center gap-2">
            {visibleNavigation.map((item) => {
              const isActive = activePage === item.href;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6335d1] ${
                    isActive
                      ? "bg-[#6335d1] text-white"
                      : "text-[#6335d1] hover:bg-[#eee8ff]"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </nav>
      </header>

      {!canAccessPage || !activePage ? (
        <main className="grid min-h-[calc(100svh-80px)] place-items-center px-5">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-[#6335d1]">
              Access denied
            </h1>
            <p className="mt-3 text-gray-600">
              Your role does not have permission to view this page.
            </p>
          </div>
        </main>
      ) : activePage === "#personal-data" ? (
        <PersonalData />
      ) : activePage === "#request-leave" ? (
        <RequestLeave />
      ) : activePage === "#leave-overview" ? (
        <LeaveOverview />
      ) : activePage === "#audit-trail" ? (
        <AuditTrail />
      ) : activePage === "#users" ? (
        <UserManagement />
      ) : null}
    </div>
  );
}