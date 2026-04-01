"use client";

import { useEffect, useState } from "react";
import { createUser, getUsers } from "@/services/apiService";
import { useNotification } from "@/context/NotificationContext";

export default function AdminUsers() {
    const { showNotification } = useNotification();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "DEVELOPER" });
    const [errors, setErrors] = useState({});
    const [creating, setCreating] = useState(false);

    const validateField = (name, value) => {
        let error = "";
        if (name === "name") {
            if (value.trim().length < 3) error = "NAME MUST BE AT LEAST 3 CHARACTERS";
        } else if (name === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) error = "ENTER A VALID CORPORATE EMAIL";
        } else if (name === "password") {
            if (value.length < 8) error = "PASSWORD SECURITY: MIN 8 CHARS REQUIRED";
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await getUsers();
            setUsers(res.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e) => {
        e.preventDefault();

        const newErrors = {
            name: validateField("name", form.name),
            email: validateField("email", form.email),
            password: validateField("password", form.password),
        };

        if (newErrors.name || newErrors.email || newErrors.password) {
            setErrors(newErrors);
            showNotification("Validation failed. Please check the requirements.", "error");
            return;
        }

        try {
            setCreating(true);
            await createUser(form);
            setIsCreateOpen(false);
            setForm({ name: "", email: "", password: "", role: "DEVELOPER" });
            setErrors({});
            showNotification("Identity created and authorized successfully", "success");
            fetchUsers();
        } catch (error) {
            console.error(error);
            showNotification("Database conflict: Email might already be registered.", "error");
        } finally {
            setCreating(false);
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Users</h1>
                <button className="btn btn-primary" onClick={() => setIsCreateOpen(true)}>
                    + Create User
                </button>
            </div>

            {loading ? (
                <div className="loader"></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    <div 
                        onClick={() => setIsCreateOpen(true)}
                        className="card group relative h-[220px] cursor-pointer overflow-hidden rounded-2xl border-none shadow-2xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] bg-slate-900/40"
                    >
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 space-y-3">
                            <div className="w-14 h-14 rounded-full border-2 border-dashed border-cyan-500/50 flex items-center justify-center transition-all duration-500 group-hover:border-cyan-400 group-hover:scale-110">
                                <span className="text-3xl text-cyan-500/70 group-hover:text-cyan-400">+</span>
                            </div>
                            <span className="text-cyan-500/70 font-bold tracking-wider group-hover:text-cyan-400 text-xs uppercase">ADD NEW USER</span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 z-10"></div>
                    </div>

                    {users.length === 0 ? (
                        <div className="col-span-full text-center py-20 text-[var(--text-muted)] glass-panel">No platform users found.</div>
                    ) : (
                        users.map(u => (
                            <div key={u.id} className="card group relative h-[220px] overflow-hidden rounded-2xl border-none shadow-2xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(139,92,246,0.2)]">
                                <div className="project-light-effect"></div>
                                <div className="absolute inset-0 bg-[#030712]/50 backdrop-blur-[1px] z-[2]"></div>
                                
                                <div className="relative z-10 flex flex-col h-full p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-[10px] font-bold tracking-widest text-cyan-400/80 bg-cyan-400/10 px-2 py-1 rounded">#{u.id}</span>
                                        <span className={`badge text-[10px] ${u.role === 'ADMIN' ? 'badge-primary' : 'badge-warning'}`}>
                                            {u.role}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-lg text-zinc-400 group-hover:text-cyan-300 transition-colors">
                                            {u.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="overflow-hidden">
                                            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">{u.name}</h3>
                                            <p className="text-[10px] text-[var(--text-muted)] font-bold tracking-tight uppercase truncate">{u.email}</p>
                                        </div>
                                    </div>

                                    <div className="mt-auto flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                        <span>Status</span>
                                        <span className="text-cyan-400/80">Active</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {isCreateOpen && (
                <div className="modal-overlay">
                    <div className="modal-content animate-slide-up border-t-2 border-purple-500/30">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-white tracking-tight">Add User</h2>
                        </div>
                        <form onSubmit={handleCreateUser}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="form-group">
                                    <label className="form-label text-[10px]">Full Name</label>
                                    <input 
                                        type="text" 
                                        name="name"
                                        className={`form-input bg-black/40 border-white/5 focus:border-purple-500/50 ${errors.name ? 'border-red-500/50' : ''}`} 
                                        required 
                                        placeholder="e.g. John Doe"
                                        value={form.name}
                                        onChange={handleChange}
                                    />
                                    {errors.name && <p className="text-[8px] text-red-400 mt-1 font-bold animate-pulse">{errors.name}</p>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label text-[10px]">Email</label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        className={`form-input bg-black/40 border-white/5 focus:border-purple-500/50 ${errors.email ? 'border-red-500/50' : ''}`} 
                                        required 
                                        placeholder="user@example.com"
                                        value={form.email}
                                        onChange={handleChange}
                                    />
                                    {errors.email && <p className="text-[8px] text-red-400 mt-1 font-bold animate-pulse">{errors.email}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="form-group">
                                    <label className="form-label text-[10px]">Password</label>
                                    <input 
                                        type="password" 
                                        name="password"
                                        className={`form-input bg-black/40 border-white/5 focus:border-purple-500/50 ${errors.password ? 'border-red-500/50' : ''}`} 
                                        required 
                                        placeholder="••••••••"
                                        value={form.password}
                                        onChange={handleChange}
                                    />
                                    {errors.password && <p className="text-[8px] text-red-400 mt-1 font-bold animate-pulse">{errors.password}</p>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label text-[10px]">Role</label>
                                    <select 
                                        className="form-select bg-black/40 border-white/5 cursor-not-allowed opacity-70"
                                        disabled
                                        value={form.role}
                                    >
                                        <option value="DEVELOPER">DEVELOPER (RESTRICTED)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-10">
                                <button type="button" className="btn btn-outline border-white/5 text-xs" onClick={() => setIsCreateOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary bg-purple-600 hover:bg-purple-700 px-8" disabled={creating}>
                                    {creating ? "Creating..." : "Add User"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
