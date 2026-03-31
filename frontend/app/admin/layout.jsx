"use client";

import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }) {
    const { user, logout } = useContext(AuthContext);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            router.push("/login");
            return;
        }
        
        if (user && user.role !== "ADMIN") {
            router.push("/developer/dashboard");
        }
    }, [user, router]);

    if (!user || user.role !== "ADMIN") {
        return <div className="app-container justify-center items-center"><div className="loader"></div></div>;
    }

    const navItems = [
        { name: "Dashboard", path: "/admin/dashboard" },
        { name: "Projects", path: "/admin/projects" },
        { name: "Tasks", path: "/admin/tasks" },
        { name: "Users", path: "/admin/users" },
        { name: "Profile", path: "/admin/profile" },
    ];

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="sidebar-header">Admin</div>
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
                            <strong className="text-white text-xs truncate block max-w-[120px]">Management</strong>
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
