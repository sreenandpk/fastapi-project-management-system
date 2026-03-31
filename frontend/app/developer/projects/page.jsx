"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProjects } from "@/services/apiService";

export default function DeveloperProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await getProjects();
                setProjects(res.data);
            } catch (error) {
                console.error("Failed to fetch projects", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                
                <div className="card group px-8 py-3 rounded-xl flex items-center justify-center w-full sm:w-auto hover:border-indigo-400 hover:shadow-[0_0_30px_rgba(99,102,241,0.2),inset_0_0_20px_rgba(99,102,241,0.1)] transition-all duration-500">
                    <h1 className="text-2xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 group-hover:drop-shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all">
                        Projects
                    </h1>
                </div>
            </div>

            <div className="w-full h-20 sm:h-24 shrink-0 block"></div>

            {loading ? (
                <div className="loader"></div>
            ) : (
                <div className="animate-fade-in block w-full mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {projects.length === 0 ? (
                            <p className="text-[var(--text-muted)] col-span-full py-10">No active projects found.</p>
                        ) : (
                            projects.map(p => (
                                <Link 
                                    key={p.id} 
                                    href={`/developer/projects/${p.id}`}
                                    className="card group relative h-[300px] overflow-hidden rounded-2xl border-none shadow-2xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(99,102,241,0.2)] block"
                                >
                                    <div className="project-light-effect project-light-indigo"></div>
                                    <div className="absolute inset-0 bg-[#030712]/40 backdrop-blur-[2px] z-[2]"></div>
                                    
                                    <div className="relative z-10 flex flex-col items-center justify-center text-center h-full p-8">
                                        <span className="absolute top-6 left-6 text-[10px] font-bold text-indigo-400 bg-indigo-400/10 border border-indigo-400/20 px-2 py-1 rounded tracking-tighter backdrop-blur-sm">ID: #P{p.id}</span>
                                        
                                        <div className="mb-0">
                                            <h3 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-all drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-tight">{p.name}</h3>
                                            <p className="text-white/60 text-xs mt-3 line-clamp-3 group-hover:text-white transition-colors drop-shadow-md max-w-[220px]">
                                                {p.description || "Project details."}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 rounded-2xl transition-all duration-500 pointer-events-none"></div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
