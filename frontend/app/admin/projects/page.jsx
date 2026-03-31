"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProjects, createProject, deleteProject } from "@/services/apiService";
import { useNotification } from "@/context/NotificationContext";
import ConfirmModal from "@/app/components/ConfirmModal";

export default function AdminProjects() {
    const { showNotification } = useNotification();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState({ name: "", description: "" });
    const [creating, setCreating] = useState(false);

    const [confirmDeleteShow, setConfirmDeleteShow] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const res = await getProjects();
            setProjects(res.data);
        } catch (error) {
            console.error("Failed to fetch projects", error);
            showNotification("Failed to load projects", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            setCreating(true);
            await createProject(form);
            setIsModalOpen(false);
            setForm({ name: "", description: "" });
            showNotification("Project created successfully", "success");
            fetchProjects();
        } catch (error) {
            console.error(error);
            showNotification("Failed to create project.", "error");
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteProject = (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        setProjectToDelete(id);
        setConfirmDeleteShow(true);
    };

    const confirmDelete = async () => {
        if (!projectToDelete) return;
        try {
            await deleteProject(projectToDelete);
            showNotification("Project deleted successfully.", "success");
            fetchProjects();
        } catch (error) {
            showNotification("Failed to delete project.", "error");
        } finally {
            setConfirmDeleteShow(false);
            setProjectToDelete(null);
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                
                <div className="card group px-8 py-3 rounded-xl flex items-center justify-center w-full sm:w-auto hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.2),inset_0_0_20px_rgba(6,182,212,0.1)] transition-all duration-500">
                    <h1 className="text-2xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all">
                        Projects
                    </h1>
                </div>
            </div>

            <div className="w-full h-10 sm:h-12 shrink-0 block"></div>

            {loading ? (
                <div className="loader"></div>
            ) : (
                <div className="animate-fade-in block w-full mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        
                        <div 
                            onClick={() => setIsModalOpen(true)}
                            className="card group relative h-[300px] cursor-pointer overflow-hidden rounded-2xl border-none shadow-2xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(6,182,212,0.3)]"
                        >
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 space-y-3">
                                <div className="w-16 h-16 rounded-full border-2 border-dashed border-cyan-500/50 flex items-center justify-center transition-all duration-500 group-hover:border-cyan-400 group-hover:scale-110">
                                    <span className="text-4xl text-cyan-500/70 group-hover:text-cyan-400">+</span>
                                </div>
                                <span className="text-cyan-500/70 font-bold tracking-wider group-hover:text-cyan-400 uppercase">ADD NEW PROJECT</span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-slate-950 to-purple-500/10 z-10 transition-opacity duration-500 group-hover:opacity-80"></div>
                            <div className="project-light-effect opacity-30 group-hover:opacity-50 transition-opacity"></div>
                            <div className="absolute inset-0 border-2 border-cyan-400/0 group-hover:border-cyan-400/50 rounded-2xl transition-all duration-500 pointer-events-none"></div>
                        </div>

                        {projects.map(p => (
                            <Link 
                                key={p.id} 
                                href={`/admin/projects/${p.id}`}
                                className="card group relative h-[300px] overflow-hidden rounded-2xl border-none shadow-2xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(6,182,212,0.2)] block"
                            >
                                <div className="project-light-effect"></div>
                                <div className="absolute inset-0 bg-[#030712]/40 backdrop-blur-[2px] z-[2]"></div>
                                
                                <div className="relative z-10 flex flex-col items-center justify-center text-center h-full p-8">
                                    <span className="absolute top-6 left-6 text-[10px] font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2 py-1 rounded tracking-tighter backdrop-blur-sm">ID: #P{p.id}</span>
                                    
                                    <button 
                                        onClick={(e) => handleDeleteProject(e, p.id)} 
                                        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 group/del shadow-lg backdrop-blur-sm z-30"
                                        title="Delete Project"
                                    >
                                        <svg className="w-5 h-5 text-red-500 group-hover/del:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>

                                    <div className="mb-0">
                                        <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-all drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-tight">{p.name}</h3>
                                        <p className="text-white/60 text-xs mt-3 line-clamp-3 group-hover:text-white transition-colors drop-shadow-md max-w-[220px]">
                                            {p.description || "Project details."}
                                        </p>
                                    </div>
                                </div>
                                <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 rounded-2xl transition-all duration-500 pointer-events-none"></div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content animate-slide-up border-t-2 border-cyan-500/30">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-white tracking-tight">Create Project</h2>
                        </div>
                        <form onSubmit={handleCreateProject}>
                            <div className="form-group">
                                <label className="form-label text-[10px]">Project Name</label>
                                <input 
                                    type="text" 
                                    className="form-input bg-black/40 border-white/5 focus:border-cyan-500/50" 
                                    required 
                                    value={form.name}
                                    onChange={(e) => setForm({...form, name: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label text-[10px]">Description</label>
                                <textarea 
                                    className="form-input bg-black/40 border-white/5 focus:border-cyan-500/50 min-h-[100px]" 
                                    value={form.description}
                                    onChange={(e) => setForm({...form, description: e.target.value})}
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-3 mt-10">
                                <button type="button" className="btn btn-outline border-white/5 text-xs" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={creating}>
                                    {creating ? "Creating..." : "Create Project"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal 
                isOpen={confirmDeleteShow}
                onClose={() => setConfirmDeleteShow(false)}
                onConfirm={confirmDelete}
                title="Sytem Node Deletion"
                message="Are you sure you want to permanently erase this project and all associated configurations? This action is irreversible."
                confirmText="Erase Node"
            />
        </div>
    );
}
