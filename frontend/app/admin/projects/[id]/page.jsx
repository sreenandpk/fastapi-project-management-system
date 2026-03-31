"use client";

import { useEffect, useState, React } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProject, getTasks } from "@/services/apiService";
import { useNotification } from "@/context/NotificationContext";
import Link from "next/link";

export default function AdminProjectDetails() {
    const { id } = useParams();
    const router = useRouter();
    const { showNotification } = useNotification();
    
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                setLoading(true);
                const [projRes, tasksRes] = await Promise.all([
                    getProject(id),
                    getTasks({ project_id: id })
                ]);
                setProject(projRes.data);
                setTasks(tasksRes.data);
            } catch (err) {
                console.error("Failed to load project details", err);
                showNotification("Could not load project details", "error");
                router.push("/admin/projects");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProjectData();
    }, [id]);

    if (loading) return <div className="loader"></div>;
    if (!project) return null;

    const stats = {
        total: tasks.length,
        todo: tasks.filter(t => t.status === 'todo').length,
        in_progress: tasks.filter(t => t.status === 'in_progress').length,
        done: tasks.filter(t => t.status === 'done').length,
    };

    const completePerc = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-8">
                <div className="flex items-center gap-6">
                    <Link href="/admin/projects" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all">
                        <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <div>
                        <h1 className="text-[10px] text-cyan-500 font-bold tracking-[0.5em] uppercase mb-2">Project Terminal</h1>
                        <h2 className="text-2xl font-black text-white tracking-widest uppercase">{project.name}</h2>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="card group relative overflow-hidden h-40 flex flex-col justify-center p-8 border-none shadow-2xl">
                    <div className="project-light-effect opacity-40"></div>
                    <div className="absolute inset-0 bg-[#030712]/60 backdrop-blur-md z-[2]"></div>
                    <div className="relative z-10">
                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.4em] mb-4">Project Completion</p>
                        <div className="flex items-baseline gap-4">
                            <span className="text-4xl font-black text-white tracking-tighter">{completePerc}%</span>
                            <span className="text-[10px] text-cyan-500/60 font-bold uppercase tracking-widest">Efficiency</span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 card bg-[#030712]/40 backdrop-blur-xl border border-white/5 p-8 rounded-3xl flex flex-col justify-center">
                    <h3 className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.5em] mb-4">Description</h3>
                    <p className="text-sm text-zinc-400 font-light leading-relaxed tracking-wide">
                        {project.description || "No detailed description provided for this node. System is operating under default parameters."}
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.5em]">Project Tasks</h3>
                    <div className="h-px flex-1 mx-8 bg-gradient-to-r from-white/5 to-transparent"></div>
                    <span className="text-[10px] text-cyan-500 font-black tracking-widest">{stats.total} Total</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.length === 0 ? (
                        <div className="col-span-full py-20 text-center glass-panel text-zinc-600 text-xs uppercase tracking-widest">
                            No tasks assigned to this project.
                        </div>
                    ) : (
                        tasks.map(t => (
                            <div key={t.id} className="card group relative h-[200px] overflow-hidden rounded-2xl border-none shadow-2xl transition-all duration-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                                <div className="project-light-effect"></div>
                                <div className="absolute inset-0 bg-[#030712]/50 backdrop-blur-[1px] z-[2]"></div>
                                
                                <div className="relative z-10 flex flex-col h-full p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-[10px] font-bold tracking-widest text-cyan-400/60 bg-cyan-400/10 px-2 py-1 rounded">#{t.id}</span>
                                        <span className={`badge text-[9px] ${
                                            t.status === 'done' ? 'badge-success' : 
                                            t.status === 'in_progress' ? 'badge-primary' : 'badge-warning'
                                        }`}>
                                            {t.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <h4 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{t.title}</h4>
                                    <p className="text-xs text-zinc-500 line-clamp-2 mb-auto">{t.description}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
