"use client";

import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                setUser(payload);
            } catch (err) {
                console.error("Invalid token");
            }
        }
    }, []);

    const login = (data) => {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);

        try {
            const payload = JSON.parse(atob(data.access_token.split(".")[1]));
            setUser(payload);

            if (payload.role === "ADMIN") {
                router.push("/admin/dashboard");
            } else {
                router.push("/developer/dashboard");
            }
        } catch (err) {
            console.error(err);
            router.push("/login");
        }
    };

    const logout = async () => {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
            try {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refresh_token: refreshToken })
                });
            } catch (error) {
                console.error("Backend logout failed", error);
            }
        }

        localStorage.clear();
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};