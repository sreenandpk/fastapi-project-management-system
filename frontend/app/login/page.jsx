"use client";

import { useState, useContext } from "react";
import api from "@/services/api";
import { AuthContext } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";

export default function LoginPage() {
    const { login } = useContext(AuthContext);
    const { showNotification } = useNotification();

    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post("/auth/login", {
                email: form.email,
                password: form.password,
            });

            login(res.data);
            showNotification("Access granted. Welcome back.", "success");
        } catch (err) {
            console.error(err.response?.data);
            showNotification("Authentication failed. Invalid credentials.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.background}>
                <div className="project-light-effect" style={{ opacity: 0.4 }}></div>
                <div style={styles.glowOrb}></div>
            </div>

            <div style={styles.contentWrap}>
                <div style={styles.card}>
                    <div style={styles.header}>
                        <div style={styles.logoBadge}>
                            <svg style={styles.logoIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 style={styles.title}>IDENTITY</h1>
                        <p style={styles.subtitle}>SECURE ACCESS REQUIRED</p>
                    </div>

                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.inputGroup}>

                            <input
                                type="email"
                                placeholder="you@company.com"
                                required
                                style={styles.input}
                                autoComplete="username"
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                        </div>

                        <div style={styles.inputGroup}>

                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••••••"
                                    required
                                    autoComplete="current-password"
                                    style={styles.input}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={styles.passwordToggle}
                                >
                                    {showPassword ? (
                                        <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>



                        <button
                            type="submit"
                            disabled={loading}
                            style={loading ? { ...styles.submitBtn, ...styles.btnDisabled } : styles.submitBtn}
                        >
                            {loading ? "AUTHENTICATING..." : "AUTHORIZE ACCESS"}
                        </button>
                    </form>



                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#030712',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'inherit',
    },
    background: {
        position: 'absolute',
        inset: 0,
        zIndex: 0,
    },
    glowOrb: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        pointerEvents: 'none',
    },
    contentWrap: {
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '420px',
        padding: '0 20px',
    },
    card: {
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '2rem',
        padding: '40px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(6, 182, 212, 0.05)',
    },
    header: {
        textAlign: 'center',
        marginBottom: '32px',
    },
    logoBadge: {
        width: '56px',
        height: '56px',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px auto',
    },
    logoIcon: {
        width: '24px',
        height: '24px',
        color: '#22d3ee',
    },
    title: {
        fontSize: '1.75rem',
        fontWeight: '900',
        color: '#fff',
        letterSpacing: '-0.04em',
        fontStyle: 'italic',
        marginBottom: '4px',
    },
    subtitle: {
        fontSize: '8px',
        fontWeight: '800',
        color: '#475569',
        letterSpacing: '0.4em',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    label: {
        fontSize: '9px',
        fontWeight: '700',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        paddingLeft: '2px',
    },
    input: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '0.75rem',
        padding: '14px 18px',
        color: '#fff',
        fontSize: '13px',
        transition: 'all 0.3s ease',
        outline: 'none',
        width: '100%',
    },
    passwordToggle: {
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#334155',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        padding: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 2px',
    },
    checkbox: {
        width: '12px',
        height: '12px',
        accentColor: '#22d3ee',
        cursor: 'pointer',
    },
    submitBtn: {
        marginTop: '12px',
        backgroundColor: '#fff',
        color: '#000',
        padding: '14px',
        borderRadius: '0.75rem',
        fontSize: '10px',
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: '0.3em',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    btnDisabled: {
        opacity: 0.5,
        cursor: 'not-allowed',
    },
    divider: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        margin: '24px 0',
    },
    dividerLine: {
        flex: 1,
        height: '1px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    dividerText: {
        fontSize: '7px',
        fontWeight: '800',
        color: '#2a3347',
        letterSpacing: '0.2em',
    },
    systemInfo: {
        textAlign: 'center',
    },
    statusIndicator: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        marginBottom: '4px',
    },
    statusDot: {
        width: '5px',
        height: '5px',
        backgroundColor: '#10b981',
        borderRadius: '50%',
        boxShadow: '0 0 8px rgba(16, 185, 129, 0.4)',
    },
    statusText: {
        fontSize: '9px',
        fontWeight: '700',
        color: '#334155',
        letterSpacing: '0.05em',
    },
    versionText: {
        fontSize: '8px',
        fontWeight: '600',
        color: '#1e293b',
    },
};