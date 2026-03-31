"use client";

import React from 'react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", type = "danger" }) {
    if (!isOpen) return null;

    const accentColor = type === "danger" ? "red-500" : "cyan-500";
    const bgGlow = type === "danger" ? "rgba(239, 68, 68, 0.1)" : "rgba(6, 182, 212, 0.1)";

    return (
        <div className="modal-overlay z-[100]">
            <div 
                className={`modal-content animate-slide-up border-t-2 border-${accentColor}/30 max-w-sm`}
                style={{ boxShadow: `0 0 50px ${bgGlow}` }}
            >
                <div className="text-center mb-8">
                    <div className={`w-16 h-16 rounded-full bg-${accentColor}/10 flex items-center justify-center mx-auto mb-6 border border-${accentColor}/20 shadow-lg backdrop-blur-sm`}>
                        <svg className={`w-8 h-8 text-${accentColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
                    <p className="text-xs text-zinc-500 mt-3 leading-relaxed px-4">{message}</p>
                </div>
                
                <div className="flex flex-col gap-3 mt-4">
                    <button 
                        onClick={onConfirm}
                        className={`w-full py-3 bg-${accentColor} hover:bg-${accentColor.replace('500', '600')} text-white rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all shadow-lg hover:shadow-${accentColor}/40`}
                    >
                        {confirmText}
                    </button>
                    <button 
                        onClick={onClose}
                        className="w-full py-3 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-xl font-bold uppercase tracking-widest text-[10px] border border-white/5 transition-all"
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
}
