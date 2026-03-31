"use client";

import { useEffect, useState } from "react";
import { getTasks, createTask, assignTask, getProjects, getUsers } from "@/services/apiService";
import { useNotification } from "@/context/NotificationContext";

export default function AdminTasks() {
    const { showNotification } = useNotification();
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedUser, setSelectedUser] = useState("all");
    
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [form, setForm] = useState({ title: "", description: "", project_id: "" });
    const [creating, setCreating] = useState(false);

    const [isAssignOpen, setIsAssignOpen] = useState(false);
    const [assignForm, setAssignForm] = useState({ task_id: null, developer_id: "" });
    const [assigning, setAssigning] = useState(false);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [projectsRes, usersRes] = await Promise.all([getProjects(), getUsers()]);
                setProjects(projectsRes.data);
                setUsers(usersRes.data);
            } catch (err) { console.error("Failed dropdowns", err) }
        };
        fetchOptions();
    }, []);

    const fetchTasksTrigger = async () => {
        try {
            setLoading(true);
            const res = await getTasks({
                project_id: selectedProject,
                status: selectedStatus,
                assigned_to: selectedUser
            });
            setTasks(res.data);
        } catch (error) {
            console.error("Failed to fetch queried tasks", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasksTrigger();
    }, [selectedProject, selectedStatus, selectedUser]);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            setCreating(true);
            await createTask(form);
            setIsCreateOpen(false);
            setForm({ title: "", description: "", project_id: "" });
            showNotification("Task created successfully", "success");
            fetchTasksTrigger();
        } catch (error) {
            console.error(error);
            showNotification("Task creation failed", "error");
        } finally {
            setCreating(false);
        }
    };

    const handleAssignTask = async (e) => {
        e.preventDefault();
        try {
            setAssigning(true);
            await assignTask(assignForm.task_id, { user_id: parseInt(assignForm.developer_id, 10) });
            setIsAssignOpen(false);
            setAssignForm({ task_id: null, developer_id: "" });
            showNotification("Developer assigned to task", "success");
            fetchTasksTrigger();
        } catch (error) {
            console.error(error);
            showNotification("Assignment failed", "error");
        } finally {
            setAssigning(false);
        }
    };

    const openAssignModal = (taskId) => {
        setAssignForm({ ...assignForm, task_id: taskId });
        setIsAssignOpen(true);
    };

    const developers = users.filter(u => u.role === 'DEVELOPER');

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
                    <select 
                        className="form-select text-xs py-1.5 min-w-[120px]"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                    >
                        <option value="all">All Developers</option>
                        {developers.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>
                    <button className="btn btn-primary text-xs py-1.5 whitespace-nowrap ml-auto lg:ml-0" onClick={() => setIsCreateOpen(true)}>
                        + Create
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="loader"></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    <div 
                        onClick={() => setIsCreateOpen(true)}
                        className="card group relative h-[250px] cursor-pointer overflow-hidden rounded-2xl border-none shadow-2xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] bg-slate-900/40"
                    >
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 space-y-3">
                            <div className="w-16 h-16 rounded-full border-2 border-dashed border-cyan-500/50 flex items-center justify-center transition-all duration-500 group-hover:border-cyan-400 group-hover:scale-110">
                                <span className="text-4xl text-cyan-500/70 group-hover:text-cyan-400">+</span>
                            </div>
                            <span className="text-cyan-500/70 font-bold tracking-wider group-hover:text-cyan-400">ADD NEW TASK</span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 z-10"></div>
                    </div>

                    {tasks.length === 0 ? (
                        <div className="col-span-full text-center py-20 text-[var(--text-muted)] glass-panel">No tasks found for your selection.</div>
                    ) : (
                        tasks.map(t => {
                            const proj = projects.find(p => p.id === t.project_id);
                            let assignedUser;
                            
                            if (t.assigned_to) {
                                const foundUser = users.find(u => u.id === t.assigned_to);
                                assignedUser = foundUser ? foundUser.name : `Dev ID: ${t.assigned_to}`;
                            }

                            return (
                                <div key={t.id} className="card group relative h-[250px] overflow-hidden rounded-2xl border-none shadow-2xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(139,92,246,0.2)]">
                                    <div className="project-light-effect"></div>
                                    <div className="absolute inset-0 bg-[#030712]/50 backdrop-blur-[1px] z-[2]"></div>
                                    
                                    <div className="relative z-10 flex flex-col h-full p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-[10px] font-bold tracking-widest text-cyan-400/80 bg-cyan-400/10 px-2 py-1 rounded">#{t.id}</span>
                                            <span className={`badge text-[10px] ${
                                                t.status === 'done' ? 'badge-success' : 
                                                t.status === 'in_progress' ? 'badge-primary' : 'badge-warning'
                                            }`}>
                                                {t.status.toUpperCase().replace("_", " ")}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors line-clamp-1">{t.title}</h3>
                                        <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-auto">{t.description}</p>

                                        <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Project</span>
                                                <span className="text-xs font-semibold text-zinc-300">{proj?.name || "Unknown"}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Assigned To</span>
                                                <span className="text-xs font-semibold text-zinc-300">{assignedUser || "Unassigned"}</span>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => openAssignModal(t.id)} 
                                            className="mt-4 w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white transition-all"
                                        >
                                            Assign Developer
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {isCreateOpen && (
                <div className="modal-overlay">
                    <div className="modal-content animate-slide-up border-t-2 border-cyan-500/30">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-white tracking-tight">Add Task</h2>
                        </div>
                        <form onSubmit={handleCreateTask}>
                            <div className="form-group">
                                <label className="form-label text-[10px]">Task Title</label>
                                <input 
                                    type="text" 
                                    className="form-input bg-black/40 border-white/5 focus:border-cyan-500/50" 
                                    required 
                                    placeholder="e.g. Database Migration"
                                    value={form.title}
                                    onChange={(e) => setForm({...form, title: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label text-[10px]">Project</label>
                                <select 
                                    className="form-select bg-black/40 border-white/5 focus:border-cyan-500/50"
                                    required
                                    value={form.project_id}
                                    onChange={(e) => setForm({...form, project_id: e.target.value})}
                                >
                                    <option value="" disabled>Select a Project</option>
                                    {projects.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label text-[10px]">Description</label>
                                <textarea 
                                    className="form-input bg-black/40 border-white/5 focus:border-cyan-500/50 min-h-[100px]" 
                                    placeholder="Describe the objective..."
                                    value={form.description}
                                    onChange={(e) => setForm({...form, description: e.target.value})}
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-3 mt-10">
                                <button type="button" className="btn btn-outline border-white/5 text-xs" onClick={() => setIsCreateOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary px-8" disabled={creating}>
                                    {creating ? "Creating..." : "Add Task"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isAssignOpen && (
                <div className="modal-overlay">
                    <div className="modal-content animate-slide-up border-t-2 border-purple-500/30">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-white tracking-tight">Assign Task</h2>
                        </div>
                        <form onSubmit={handleAssignTask}>
                            <div className="form-group">
                                <label className="form-label text-[10px]">Target Developer</label>
                                <select 
                                    className="form-select bg-black/40 border-white/5 focus:border-purple-500/50"
                                    required
                                    value={assignForm.developer_id}
                                    onChange={(e) => setAssignForm({...assignForm, developer_id: e.target.value})}
                                >
                                    <option value="" disabled>-- Select developer --</option>
                                    {developers.map(d => (
                                        <option key={d.id} value={d.id}>
                                            {d.name} ({d.email})
                                        </option>
                                    ))}
                                </select>
                                {developers.length === 0 && (
                                    <p className="text-[10px] text-[var(--color-danger)] mt-2 font-bold uppercase tracking-tight">No active developers found.</p>
                                )}
                            </div>
                            <div className="flex justify-end gap-3 mt-10">
                                <button type="button" className="btn btn-outline border-white/5 text-xs" onClick={() => setIsAssignOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary bg-purple-600 hover:bg-purple-700 shadow-purple-900/40 px-8" disabled={assigning || developers.length === 0}>
                                    {assigning ? "Assigning..." : "Assign Task"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
