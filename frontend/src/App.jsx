import { useEffect, useState } from "react";
import Login from "./Login";
import PersonalData from "./PersonalData";
import AuditTrail from "./AuditTrail";

export default function App() {
  const [page, setPage] = useState(window.location.hash);

  useEffect(() => {
    function updatePage() {
      setPage(window.location.hash);
    }

    window.addEventListener("hashchange", updatePage);

    return () => {
      window.removeEventListener("hashchange", updatePage);
    };
  }, []);

  if (page === "#audit-trail") {
    return <AuditTrail />;
  }

  if (page === "#personal-data") {
    return (
      <>
        <a
          href="#"
          className="fixed top-4 left-4 z-10 rounded-md bg-white px-4 py-2 text-[#6335d1] shadow"
        >
          ← Back to login
        </a>
        <PersonalData />
      </>
    );
  }

  return <Login />;
}