"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "@/services/apiService";

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getDashboardStats();
                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="loader"></div>;

    const completePerc = stats?.total_tasks ? Math.round((stats.done / stats.total_tasks) * 100) : 0;

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-[10px] text-cyan-500 font-bold tracking-[0.5em] uppercase mb-2">Dashboard</h1>
                    <h2 className="text-2xl font-black text-white tracking-widest uppercase">Overview</h2>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse"></div>
                    <span className="text-[9px] text-emerald-500/80 font-bold uppercase tracking-[0.3em]">Online</span>
                </div>
            </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="card group relative overflow-hidden h-40 flex flex-col justify-center p-8 border-none shadow-2xl transition-all duration-500 hover:scale-[1.02]">
                    <div className="project-light-effect opacity-40"></div>
                    <div className="absolute inset-0 bg-[#030712]/60 backdrop-blur-md z-[2]"></div>
                    <div className="relative z-10">
                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.4em] mb-4">Projects</p>
                        <div className="flex items-baseline gap-4">
                            <span className="text-4xl font-black text-white tracking-tighter">{stats?.projects || 0}</span>
                            <span className="text-[10px] text-cyan-500/60 font-bold uppercase tracking-widest">Total</span>
                        </div>
                    </div>
                </div>

                <div className="card group relative overflow-hidden h-40 flex flex-col justify-center p-8 border-none shadow-2xl transition-all duration-500 hover:scale-[1.02] delay-75">
                    <div className="project-light-effect project-light-emerald opacity-30"></div>
                    <div className="absolute inset-0 bg-[#030712]/60 backdrop-blur-md z-[2]"></div>
                    <div className="relative z-10">
                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.4em] mb-4">Total Tasks</p>
                        <div className="flex items-baseline gap-4">
                            <span className="text-4xl font-black text-white tracking-tighter">{stats?.total_tasks || 0}</span>
                            <span className="text-[10px] text-emerald-500/60 font-bold uppercase tracking-widest">Tasks</span>
                        </div>
                    </div>
                </div>

                <div className="card group relative overflow-hidden h-40 flex flex-col justify-center p-8 border-none shadow-2xl transition-all duration-500 hover:scale-[1.02] delay-150">
                    <div className="project-light-effect project-light-indigo opacity-30"></div>
                    <div className="absolute inset-0 bg-[#030712]/60 backdrop-blur-md z-[2]"></div>
                    <div className="relative z-10">
                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.4em] mb-4">Completed</p>
                        <div className="flex items-baseline gap-4">
                            <span className="text-4xl font-black text-indigo-400 tracking-tighter">{completePerc}%</span>
                            <span className="text-[10px] text-indigo-500/40 font-bold uppercase tracking-widest">Success</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card bg-[#030712]/40 backdrop-blur-xl border border-white/5 p-8 rounded-3xl">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.5em]">System Status</h3>
                        <div className="h-px flex-1 mx-8 bg-gradient-to-r from-white/5 to-transparent"></div>
                    </div>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest py-3 border-b border-white/5">
                            <span className="text-zinc-600">Pending</span>
                            <span className="text-white">{stats?.todo || 0}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest py-3 border-b border-white/5">
                            <span className="text-zinc-600">Progress</span>
                            <span className="text-cyan-500">{stats?.in_progress || 0}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest py-3">
                            <span className="text-zinc-600">Done</span>
                            <span className="text-emerald-500">{stats?.done || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="card bg-[#030712]/40 backdrop-blur-xl border border-white/5 p-8 rounded-3xl flex flex-col justify-between overflow-hidden relative">
                    <div className="relative z-10">
                        <h3 className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.5em] mb-6">Quick Actions</h3>
                        <p className="text-[11px] text-zinc-500 font-light leading-relaxed tracking-wider mb-8">
                            Use these shortcuts to manage your projects and tasks quickly.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <a href="/admin/projects" className="flex items-center justify-center py-4 bg-white/5 rounded-2xl text-[9px] font-bold uppercase tracking-[0.4em] text-white/60 hover:text-white hover:bg-white/10 transition-all">
                                Projects
                            </a>
                            <a href="/admin/tasks" className="flex items-center justify-center py-4 bg-cyan-500/5 rounded-2xl text-[9px] font-bold uppercase tracking-[0.4em] text-cyan-500/60 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all">
                                Tasks
                            </a>
                        </div>
                    </div>
                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-cyan-500 opacity-5 blur-3xl rounded-full"></div>
                </div>
            </div>
        </div>
    );
}