"use client";

import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { getTasks } from "@/services/apiService";

export default function DeveloperDashboard() {
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDevTasks = async () => {
            try {
                const res = await getTasks();
                const myTasks = res.data.filter(t => t.assigned_to === parseInt(user?.sub));
                setTasks(myTasks);
            } catch (err) {
                console.error("Failed to fetch tasks for dash", err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchDevTasks();
        }
    }, [user]);

    if (loading) return <div className="loader"></div>;

    const stats = {
        total: tasks.length,
        todo: tasks.filter(t => t.status === 'todo').length,
        in_progress: tasks.filter(t => t.status === 'in_progress').length,
        done: tasks.filter(t => t.status === 'done').length,
    };

    const completePerc = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-[10px] text-indigo-400 font-bold tracking-[0.5em] uppercase mb-2">Dashboard</h1>
                    <h2 className="text-2xl font-black text-white tracking-widest uppercase">My Stats</h2>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Active User</span>
                        <span className="text-[11px] text-white font-medium tracking-widest">{user?.name}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="card group relative overflow-hidden h-40 flex flex-col justify-center p-8 border-none shadow-2xl transition-all duration-500 hover:scale-[1.02]">
                    <div className="project-light-effect project-light-indigo opacity-40"></div>
                    <div className="absolute inset-0 bg-[#030712]/60 backdrop-blur-md z-[2]"></div>
                    <div className="relative z-10">
                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.4em] mb-4">My Tasks</p>
                        <div className="flex items-baseline gap-4">
                            <span className="text-4xl font-black text-white tracking-tighter">{stats.total}</span>
                            <span className="text-[10px] text-indigo-400/60 font-bold uppercase tracking-widest">Tasks</span>
                        </div>
                    </div>
                </div>

                <div className="card group relative overflow-hidden h-40 flex flex-col justify-center p-8 border-none shadow-2xl transition-all duration-500 hover:scale-[1.02] delay-75">
                    <div className="project-light-effect project-light-amber opacity-20"></div>
                    <div className="absolute inset-0 bg-[#030712]/60 backdrop-blur-md z-[2]"></div>
                    <div className="relative z-10">
                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.4em] mb-4">In Progress</p>
                        <div className="flex items-baseline gap-4">
                            <span className="text-4xl font-black text-white tracking-tighter">{stats.in_progress}</span>
                            <span className="text-[10px] text-amber-500/60 font-bold uppercase tracking-widest">Active</span>
                        </div>
                    </div>
                </div>

                <div className="card group relative overflow-hidden h-40 flex flex-col justify-center p-8 border-none shadow-2xl transition-all duration-500 hover:scale-[1.02] delay-150">
                    <div className="project-light-effect project-light-emerald opacity-20"></div>
                    <div className="absolute inset-0 bg-[#030712]/60 backdrop-blur-md z-[2]"></div>
                    <div className="relative z-10">
                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.4em] mb-4">Completed</p>
                        <div className="flex items-baseline gap-4">
                            <span className="text-4xl font-black text-white tracking-tighter">{stats.done}</span>
                            <span className="text-[10px] text-emerald-500/60 font-bold uppercase tracking-widest">Done</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card bg-[#030712]/40 backdrop-blur-xl border border-white/5 p-8 rounded-3xl">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.5em]">My Progress</h3>
                            <span className="text-[11px] text-white font-black tracking-widest">{completePerc}%</span>
                        </div>
                        <div className="relative h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div 
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-1000 ease-out"
                                style={{ width: `${completePerc}%` }}
                            ></div>
                        </div>
                        <div className="pt-4">
                            <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-[0.2em] leading-relaxed max-w-lg">
                                You have finished {stats.done} tasks. Keep track of your work and update status regularly.
                            </p>
                        </div>
                        <div className="pt-6">
                            <a href="/developer/tasks" className="inline-flex items-center justify-center px-10 py-3 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-full text-[9px] font-bold uppercase tracking-[0.4em] text-indigo-400 transition-all">
                                View Tasks
                            </a>
                        </div>
                    </div>
                    
                    <div className="hidden md:flex w-40 h-40 items-center justify-center p-4 rounded-full border border-white/5 bg-[#030712]/60 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]">
                        <div className="text-center">
                            <p className="text-3xl font-black text-white tracking-tighter">{completePerc}%</p>
                            <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-[0.2em] mt-1">Ready</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}