"use client";

import { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const showNotification = useCallback((message, type = "info") => {
        const id = Date.now();
        setNotifications((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 5000);
    }, []);

    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            
            <div className="fixed bottom-10 right-10 z-[9999] flex flex-col gap-4 pointer-events-none">
                {notifications.map((n) => (
                    <div 
                        key={n.id}
                        className={`pointer-events-auto min-w-[400px] max-w-[500px] glass-panel animate-slide-up p-6 rounded-2xl border-l-[6px] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-between group transition-all backdrop-blur-3xl ${
                            n.type === 'error' ? 'border-red-500 bg-red-500/20' : 
                            n.type === 'success' ? 'border-emerald-500 bg-emerald-500/20' : 
                            'border-cyan-500 bg-cyan-500/20'
                        }`}
                    >
                        <div className="flex flex-col">
                            <span className={`text-[11px] font-bold uppercase tracking-[0.25em] mb-2 ${
                                n.type === 'error' ? 'text-red-400' : 
                                n.type === 'success' ? 'text-emerald-400' : 
                                'text-cyan-400'
                            }`}>
                                {n.type === 'error' ? 'System Error' : n.type === 'success' ? 'Task Complete' : 'System Insight'}
                            </span>
                            <p className="text-base text-white font-semibold leading-relaxed">{n.message}</p>
                        </div>
                        <button 
                            onClick={() => removeNotification(n.id)}
                            className="ml-6 text-white/30 hover:text-white transition-all p-2 hover:scale-125"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
};
