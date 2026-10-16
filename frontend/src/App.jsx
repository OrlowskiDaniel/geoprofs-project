import { useEffect, useState } from "react";
import Login from "./Login";
import PersonalData from "./PersonalData";
import AuditTrail from "./AuditTrail";
import RequestLeave from "./RequestLeave";
import { demoUser } from "./auth/demoUser";
import {
  ROLE_LABELS,
  PERMISSIONS,
  hasPermission,
} from "./auth/roles";
import UserManagement from "./UserManagement";

const navigation = [
  { label: "Login", href: "#" },
  {
    label: "Personal data",
    href: "#personal-data",
    permission: PERMISSIONS.VIEW_PERSONAL_DATA,
  },
  {
    label: "Request leave",
    href: "#request-leave",
    permission: PERMISSIONS.REQUEST_LEAVE,
  },
  {
    label: "Audit trail",
    href: "#audit-trail",
    permission: PERMISSIONS.VIEW_AUDIT_TRAIL,
  },
{
  label: "User management",
  href: "#users",
  permission: PERMISSIONS.MANAGE_USERS,
},
];

export default function App() {
  const [page, setPage] = useState(window.location.hash);
  const [currentUser] = useState(demoUser);

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

  const visibleNavigation = navigation.filter(
    (item) =>
      !item.permission || hasPermission(currentUser, item.permission)
  );

  const activePage = navigation.some((item) => item.href === page)
    ? page
    : "#";

  const currentPage = navigation.find(
    (item) => item.href === activePage
  );

  const canAccessPage =
    !currentPage?.permission ||
    hasPermission(currentUser, currentPage.permission);

  return (
    <div className="min-h-svh bg-[#f7f5ff]">
      <header className="sticky top-0 z-30 border-b border-purple-100 bg-white shadow-sm">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4"
        >
          <a href="#" className="text-xl font-bold text-[#6335d1]">
            GeoProfs
          </a>

          <span className="text-sm text-gray-600">
            {currentUser.firstName} ·{" "}
            {currentUser.roles
              .map((role) => ROLE_LABELS[role])
              .join(", ")}
          </span>

          <div className="flex flex-wrap gap-2">
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
          </div>
        </nav>
      </header>

      {!canAccessPage ? (
        <main className="grid min-h-[calc(100svh-80px)] place-items-center px-5">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-[#6335d1]">
              Access denied
            </h1>
            <p className="mt-3 text-gray-600">
              Your role does not have permission to view this page.
            </p>
            <a
              href="#"
              className="mt-6 inline-block rounded-lg bg-[#6335d1] px-5 py-3 text-white"
            >
              Back to login
            </a>
          </div>
        </main>
      ) : activePage === "#personal-data" ? (
        <PersonalData />
      ) : activePage === "#request-leave" ? (
        <RequestLeave />
     ) : activePage === "#audit-trail" ? (
       <AuditTrail />
     ) : activePage === "#users" ? (
       <UserManagement />
     ) : (
       <Login />
     )}
    </div>
  );
}