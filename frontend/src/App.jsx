import { useEffect, useState } from "react";
import Login from "./Login";
import PersonalData from "./PersonalData";
import AuditTrail from "./AuditTrail";
import RequestLeave from "./RequestLeave";
import UserManagement from "./UserManagement";
import { api } from "./api/client";

// Map backend role names to frontend permissions
const rolePermissions = {
    Werknemer: ["requestLeave", "viewPersonalData"],
    Manager: ["requestLeave", "viewPersonalData", "checkLeaveRequests"],
    "Office Manager": ["requestLeave", "viewPersonalData", "checkLeaveRequests", "manageUsers"],
    Administrator: ["requestLeave", "viewPersonalData", "checkLeaveRequests", "manageUsers", "viewAuditTrail"],
};

function hasPermission(user, permission) {
    if (!user) return false;
    return (rolePermissions[user.role] ?? []).includes(permission);
}

const navigation = [
    { label: "Personal data", href: "#personal-data", permission: "viewPersonalData" },
    { label: "Request leave", href: "#request-leave", permission: "requestLeave" },
    { label: "Audit trail", href: "#audit-trail", permission: "viewAuditTrail" },
    { label: "User management", href: "#users", permission: "manageUsers" },
];

export default function App() {
    const [page, setPage] = useState(window.location.hash);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        api.getMe()
            .then(setCurrentUser)
            .catch(() => {
                localStorage.removeItem("token");
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        function updatePage() {
            setPage(window.location.hash);
            window.scrollTo(0, 0);
        }
        window.addEventListener("hashchange", updatePage);
        return () => window.removeEventListener("hashchange", updatePage);
    }, []);

    if (loading) return null;

    if (!currentUser) return <Login onLogin={setCurrentUser} />;

    const visibleNavigation = navigation.filter(
        (item) => !item.permission || hasPermission(currentUser, item.permission)
    );

    const activePage = visibleNavigation.some((item) => item.href === page)
        ? page
        : visibleNavigation[0]?.href ?? "#";

    function handleLogout() {
        api.logout().finally(() => {
            localStorage.removeItem("token");
            setCurrentUser(null);
            window.location.hash = "";
        });
    }

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
                        {currentUser.first_name} · {currentUser.role}
                    </span>

                    <div className="flex flex-wrap gap-2">
                        {visibleNavigation.map((item) => {
                            const isActive = activePage === item.href;
                            return (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    aria-current={isActive ? "page" : undefined}
                                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
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
                            onClick={handleLogout}
                            className="rounded-lg px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                        >
                            Logout
                        </button>
                    </div>
                </nav>
            </header>

            {activePage === "#personal-data" ? (
                <PersonalData />
            ) : activePage === "#request-leave" ? (
                <RequestLeave />
            ) : activePage === "#audit-trail" ? (
                <AuditTrail />
            ) : activePage === "#users" ? (
                <UserManagement />
            ) : (
                <RequestLeave />
            )}
        </div>
    );
}
