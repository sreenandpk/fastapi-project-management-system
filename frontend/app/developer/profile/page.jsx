"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function DeveloperProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("access_token");
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(res.data);
            } catch (err) {
                console.error("Failed to load profile", err);
                setError("Unable to load profile data.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <div className="loader"></div>;
    if (error) return <div className="text-center text-[var(--color-danger)] mt-10">{error}</div>;

    return (
        <div className="animate-fade-in flex flex-col items-center justify-center min-h-[75vh] w-full px-4">
            <div className="card group relative w-full max-w-md overflow-hidden rounded-3xl border-none shadow-2xl transition-all duration-500">
                <div className="project-light-effect project-light-indigo"></div>
                <div className="absolute inset-0 bg-[#030712]/60 backdrop-blur-xl z-[2]"></div>
                
                <div className="relative z-10 flex flex-col items-center p-14 text-center h-full justify-center">
                    <div className="w-full space-y-20">
                        <h1 className="text-xl md:text-2xl font-black text-white tracking-[0.6em] uppercase">{profile?.name || "Developer"}</h1>

                        <p className="text-sm text-white/40 font-light tracking-[0.3em]">{profile?.email}</p>

                    </div>
                </div>

                <div className="absolute top-4 right-4 z-[5] opacity-5 pointer-events-none">
                    <svg className="w-12 h-12 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                    </svg>
                </div>
            </div>
        </div>
    );
}
