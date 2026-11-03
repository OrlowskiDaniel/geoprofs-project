import { useEffect, useState } from "react";
import Login from "./Login";
import PersonalData from "./PersonalData";
import RequestLeave from "./RequestLeave";
import { api, clearToken } from "./api/client";

const navigation = [
  { label: "Change password", href: "#personal-data" },
  { label: "Request leave", href: "#request-leave" },
];

export default function App() {
  const [page, setPage] = useState(window.location.hash);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

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

  function handleSignedIn() {
    setIsAuthenticated(true);
    setLogoutError("");
    window.location.hash = "personal-data";
  }

  async function handleLogout() {
    setIsLoggingOut(true);
    setLogoutError("");

    try {
      await api.logout();
    } catch (error) {
      if (error.status !== 401) {
        setLogoutError("Unable to log out. Please try again.");
        return;
      }
    } finally {
      setIsLoggingOut(false);
    }

    clearToken();
    setIsAuthenticated(false);
    window.location.hash = "";
  }

  // Do not render navigation or private pages before login.
  if (!isAuthenticated) {
    return <Login onSignedIn={handleSignedIn} />;
  }

  const activePage = navigation.some((item) => item.href === page)
    ? page
    : "#personal-data";

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

          <div className="flex flex-wrap items-center gap-2">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={
                  activePage === item.href ? "page" : undefined
                }
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                  activePage === item.href
                    ? "bg-[#6335d1] text-white"
                    : "text-[#6335d1] hover:bg-[#eee8ff]"
                }`}
              >
                {item.label}
              </a>
            ))}

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="cursor-pointer rounded-lg border border-purple-200 px-4 py-2 text-sm font-semibold text-[#6335d1] hover:bg-[#eee8ff] disabled:opacity-50"
            >
              {isLoggingOut ? "Logging out..." : "Log out"}
            </button>
          </div>
        </nav>
      </header>

      {logoutError && (
        <p role="alert" className="px-5 py-3 text-center text-red-700">
          {logoutError}
        </p>
      )}

      {activePage === "#request-leave" ? (
        <RequestLeave />
      ) : (
        <PersonalData />
      )}
    </div>
  );
}