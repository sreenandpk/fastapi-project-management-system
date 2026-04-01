"use client";

import { useEffect, useState, useContext } from "react";
import { getTasks, updateTaskStatus, getProjects } from "@/services/apiService";
import { AuthContext } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";

export default function DeveloperTasks() {
    const { showNotification } = useNotification();
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");

    useEffect(() => {
        const fetchProjectsOption = async () => {
            try {
                const res = await getProjects();
                setProjects(res.data);
            } catch (err) { console.error("P-load error", err) }
        };
        fetchProjectsOption();
    }, []);

    const fetchTasksTrigger = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const res = await getTasks({
                project_id: selectedProject,
                status: selectedStatus
            });
            const myTasks = res.data.filter(t => t.assigned_to === parseInt(user.sub)); 
            setTasks(myTasks);
        } catch (error) {
            console.error("Failed to fetch polled tasks", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasksTrigger();
    }, [user, selectedProject, selectedStatus]);

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await updateTaskStatus(taskId, { status: newStatus });
            showNotification("Status updated successfully", "success");
            fetchTasksTrigger(); 
        } catch (error) {
            showNotification("Failed to update status", "error");
        }
    };
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

    return (
        <div>
            <div className="page-header flex-col lg:flex-row items-start lg:items-center gap-4">
                <h1 className="page-title w-full lg:w-auto">Tasks</h1>
                <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 w-full lg:w-auto mt-2 lg:mt-0">
                    <select 
                        className="form-select text-xs py-1.5 min-w-[120px]"
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                    >
                        <option value="all">All Projects</option>
                        {projects.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                    <select 
                        className="form-select text-xs py-1.5 min-w-[120px]"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="todo">TODO</option>
                        <option value="in_progress">IN PROGRESS</option>
                        <option value="done">DONE</option>
                    </select>
                </div>
            </div>


            {loading ? (
                <div className="loader"></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    {tasks.length === 0 ? (
                        <div className="col-span-full text-center py-20 text-[var(--text-muted)] glass-panel">No tasks assigned to you.</div>
                    ) : (
                        tasks.map(t => {
                            const proj = projects.find(p => p.id === t.project_id);
                            const deadline = getDeadlineStatus(t.due_date);
                            
                            return (
                                <div key={t.id} className={`card group relative min-h-[280px] overflow-hidden rounded-2xl border-none shadow-2xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(99,102,241,0.2)] ${deadline.cardClass}`}>
                                    <div className={`project-light-effect project-light-indigo ${deadline.label === 'OVERDUE' ? 'opacity-40' : ''}`}></div>
                                    <div className="absolute inset-0 bg-[#030712]/50 backdrop-blur-[1px] z-[2]"></div>
                                    
                                    <div className="relative z-10 flex flex-col h-full p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-bold tracking-widest text-indigo-400/80 bg-indigo-400/10 px-2 py-1 rounded w-fit">#{t.id}</span>
                                                <span className={`text-[10px] uppercase tracking-tighter font-black ${deadline.className}`}>
                                                    {deadline.label}
                                                </span>
                                            </div>
                                            <span className={`badge text-[10px] ${
                                                t.status === 'done' ? 'badge-success' : 
                                                t.status === 'in_progress' ? 'badge-primary' : 'badge-warning'
                                            }`}>
                                                {t.status.toUpperCase().replace("_", " ")}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors line-clamp-1">{t.title}</h3>
                                        <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-auto">{t.description || "Task details."}</p>

                                        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                                            <div>
                                                <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Project</span>
                                                <span className="text-xs font-semibold text-zinc-300">{proj?.name || "Unknown"}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-tighter mb-1">Update Status</span>
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
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}
