"use client";

import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function DeveloperLayout({ children }) {
    const { user, logout } = useContext(AuthContext);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            router.push("/");
            return;
        }

        if (user && user.role !== "DEVELOPER") {
            router.push("/admin/dashboard");
        }
    }, [user, router]);

    if (!user || user.role !== "DEVELOPER") {
        return <div className="app-container justify-center items-center"><div className="loader"></div></div>;
    }

    const navItems = [
        { name: "Dashboard", path: "/developer/dashboard" },
        { name: "Projects", path: "/developer/projects" },
        { name: "Tasks", path: "/developer/tasks" },
        { name: "Profile", path: "/developer/profile" },
    ];

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="sidebar-header">Project Management</div>
                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <Link 
                            key={item.path} 
                            href={item.path}
                            className={`nav-link ${pathname === item.path ? "active" : ""}`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <div className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.05)]">
                        <img 
                            src="/default-avatar.jpg" 
                            alt="Profile" 
                            className="w-10 h-10 rounded-full object-cover" 
                        />
                        <div className="text-sm">
                            <strong className="text-white text-xs truncate block max-w-[120px]">Project Management</strong>
                        </div>
                    </div>
                    <button onClick={logout} className="btn btn-outline w-full justify-center">
                        Logout
                    </button>
                </div>
            </aside>
            <main className="main-content">
                <div className="animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
}
