"use client";

import { useEffect, useState, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProject, getTasks, updateTaskStatus } from "@/services/apiService";
import { AuthContext } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import Link from "next/link";

export default function DeveloperProjectDetails() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useContext(AuthContext);
    const { showNotification } = useNotification();
    
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const getDeadlineStatus = (dueDate) => {
        if (!dueDate) return { label: "No Deadline", className: "text-zinc-500", cardClass: "" };
        const now = new Date();
        const deadline = new Date(dueDate);
        const diff = deadline - now;
        const hours = diff / (1000 * 60 * 60);

        if (diff < 0) return { label: "OVERDUE", className: "text-red-500 font-black animate-pulse", cardClass: "animate-pulse-red border-red-500/50" };
        if (hours < 24) return { label: "DUE SOON", className: "text-amber-500 font-bold", cardClass: "animate-amber-glow border-amber-500/30" };
        return { label: `Due: ${deadline.toLocaleDateString()}`, className: "text-indigo-300", cardClass: "" };
    };

    useEffect(() => {
        const fetchProjectData = async () => {
            if (!user) return;
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
                router.push("/developer/projects");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProjectData();
    }, [id, user]);

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await updateTaskStatus(taskId, { status: newStatus });
            showNotification("Status updated successfully", "success");
            const tasksRes = await getTasks({ project_id: id });
            setTasks(tasksRes.data);
        } catch (error) {
            showNotification("Failed to update status", "error");
        }
    };

    if (loading) return <div className="loader"></div>;
    if (!project) return null;

    const myTasks = tasks.filter(t => t.assigned_to === parseInt(user?.sub));
    const otherTasks = tasks.filter(t => t.assigned_to !== parseInt(user?.sub));

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-8">
                <div className="flex items-center gap-6">
                    <Link href="/developer/projects" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all">
                        <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <div>
                        <h1 className="text-[10px] text-indigo-500 font-bold tracking-[0.5em] uppercase mb-2">Project Terminal</h1>
                        <h2 className="text-2xl font-black text-white tracking-widest uppercase">{project.name}</h2>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3 card bg-[#030712]/40 backdrop-blur-xl border border-white/5 p-8 rounded-3xl flex flex-col justify-center">
                    <h3 className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.5em] mb-4">Description</h3>
                    <p className="text-sm text-zinc-400 font-light leading-relaxed tracking-wide">
                        {project.description || "No detailed description provided for this node."}
                    </p>
                </div>
            </div>

            <div className="space-y-12">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.5em]">My Subroutines</h3>
                        <div className="h-px flex-1 mx-8 bg-gradient-to-r from-white/5 to-transparent"></div>
                        <span className="text-[10px] text-indigo-500 font-black tracking-widest">{myTasks.length} Assigned</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myTasks.length === 0 ? (
                            <div className="col-span-full py-16 text-center glass-panel text-zinc-600 text-[10px] uppercase tracking-widest">
                                No direct subroutines assigned in this node.
                            </div>
                        ) : (
                            myTasks.map(t => {
                                const deadline = getDeadlineStatus(t.due_date);
                                return (
                                    <div key={t.id} className={`card group relative min-h-[220px] overflow-hidden rounded-2xl border-none shadow-2xl transition-all duration-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] ${deadline.cardClass}`}>
                                        <div className="project-light-effect project-light-indigo opacity-30"></div>
                                        <div className="absolute inset-0 bg-[#030712]/50 backdrop-blur-[1px] z-[2]"></div>
                                        
                                        <div className="relative z-10 flex flex-col h-full p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] font-bold tracking-widest text-indigo-400/60 bg-indigo-400/10 px-2 py-1 rounded w-fit">#{t.id}</span>
                                                    <span className={`text-[10px] uppercase tracking-tighter font-black ${deadline.className}`}>
                                                        {deadline.label}
                                                    </span>
                                                </div>
                                                <span className={`badge text-[9px] ${
                                                    t.status === 'done' ? 'badge-success' : 
                                                    t.status === 'in_progress' ? 'badge-primary' : 'badge-warning'
                                                }`}>
                                                    {t.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <h4 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{t.title}</h4>
                                            
                                            <div className="mt-auto pt-4 flex justify-between items-center">
                                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Status</span>
                                                <select 
                                                    className="form-select text-[10px] py-1 px-2 border-white/5 bg-black/40 text-white min-w-[100px]"
                                                    value={t.status}
                                                    onChange={(e) => handleStatusChange(t.id, e.target.value)}
                                                >
                                                    <option value="todo">TODO</option>
                                                    <option value="in_progress">IN PROGRESS</option>
                                                    <option value="done">DONE</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.5em]">Adjacent Nodes (Other Tasks)</h3>
                        <div className="h-px flex-1 mx-8 bg-gradient-to-r from-white/5 to-transparent"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {otherTasks.length === 0 ? (
                            <div className="col-span-full py-10 text-center text-zinc-700 text-[10px] uppercase tracking-widest font-bold">
                                No adjacent nodes detected.
                            </div>
                        ) : (
                            otherTasks.map(t => (
                                <div key={t.id} className="card group relative h-[180px] overflow-hidden rounded-2xl border border-white/5 bg-white/5 transition-all duration-500 hover:border-white/10 opacity-60">
                                    <div className="relative z-10 flex flex-col h-full p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-[10px] font-bold tracking-widest text-zinc-500/60 bg-white/5 px-2 py-1 rounded">#{t.id}</span>
                                            <span className="text-[10px] text-zinc-500 font-black uppercase text-right w-full block">{t.status}</span>
                                        </div>
                                        <h4 className="text-md font-bold text-zinc-300 mb-1 line-clamp-1 truncate uppercase tracking-tight">{t.title}</h4>
                                        <p className="text-[11px] text-zinc-600 line-clamp-2">Task assigned to another terminal.</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
