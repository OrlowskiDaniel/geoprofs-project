import { useEffect, useState } from "react";
import Login from "./Login";
import PersonalData from "./PersonalData";
import AuditTrail from "./AuditTrail";
import RequestLeave from "./RequestLeave";

const navigation = [
  { label: "Login", href: "#" },
  { label: "Personal data", href: "#personal-data" },
  { label: "Request leave", href: "#request-leave" },
  { label: "Audit trail", href: "#audit-trail" },
];

export default function App() {
  const [page, setPage] = useState(window.location.hash);

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

  const activePage = navigation.some((item) => item.href === page)
    ? page
    : "#";

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

          <div className="flex flex-wrap gap-2">
            {navigation.map((item) => {
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

     {activePage === "#personal-data" ? (
       <PersonalData />
     ) : activePage === "#request-leave" ? (
       <RequestLeave />
     ) : activePage === "#audit-trail" ? (
       <AuditTrail />
     ) : (
       <Login />
     )}
    </div>
  );
}