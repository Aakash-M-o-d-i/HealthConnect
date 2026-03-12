import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CheckCircle2,
    Download,
    ArrowRight,
    ShieldCheck,
    Copy,
    Check,
    FileBadge
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import PublicNavbar from '../components/common/PublicNavbar';

const RegistrationSuccess = ({ darkMode, setDarkMode }) => {
    const navigate = useNavigate();
    const [uhid, setUhid] = useState('');
    const [name, setName] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const storedUhid = localStorage.getItem('new_uhid');
        const storedName = localStorage.getItem('new_name');
        if (!storedUhid) {
            navigate('/register');
            return;
        }
        setUhid(storedUhid);
        setName(storedName || 'Patient');
    }, [navigate]);

    const copyUhid = () => {
        navigator.clipboard.writeText(uhid).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const goToDashboard = () => {
        // Keep it during this transition to login if needed, or clear after login
        // For demo purposes, we can navigate directly to login
        navigate('/login');
    };

    if (!uhid) return null;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
            <PublicNavbar darkMode={darkMode} setDarkMode={setDarkMode} />

            {/* Blurred background preview */}
            <div style={{ filter: 'blur(8px)', opacity: 0.2, padding: '60px', userSelect: 'none', pointerEvents: 'none', overflow: 'hidden' }}>
                <div style={{ background: 'var(--card-bg)', height: '400px', borderRadius: '24px', border: '1px solid var(--border)' }}></div>
            </div>

            {/* Modal Overlay */}
            <div className="success-overlay" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
                <div className="success-card" style={{ padding: '48px', borderRadius: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.2)', maxWidth: '500px' }}>
                    <div style={{
                        width: '80px', height: '80px', background: 'var(--success-light)',
                        color: 'var(--success)', borderRadius: '50%', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
                        boxShadow: '0 0 0 10px rgba(22, 163, 74, 0.05)'
                    }}>
                        <CheckCircle2 size={42} strokeWidth={2.5} />
                    </div>

                    <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '10px', fontFamily: 'Outfit, sans-serif' }}>
                        Registration Complete!
                    </h2>
                    <p style={{ fontSize: '16px', color: 'var(--text-muted)', marginBottom: '32px', lineHeight: '1.5' }}>
                        Welcome, <strong>{name}</strong>. Your HealthConnect account has been secured.
                    </p>

                    <div className="uhid-display" style={{
                        background: 'var(--bg)', border: '2px solid var(--primary)',
                        borderRadius: '16px', padding: '24px', marginBottom: '32px',
                        position: 'relative'
                    }}>
                        <label style={{
                            fontSize: '11px', fontWeight: '800', letterSpacing: '2px',
                            color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '12px', display: 'block'
                        }}>
                            UNIVERSAL HEALTH ID
                        </label>
                        <div className="uhid-value" style={{
                            fontSize: '28px', fontWeight: '900', fontFamily: 'monospace',
                            color: 'var(--text)', letterSpacing: '2px'
                        }}>
                            {uhid}
                        </div>

                        <button
                            onClick={copyUhid}
                            style={{
                                position: 'absolute', top: '24px', right: '20px',
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                color: copied ? 'var(--success)' : 'var(--text-muted)',
                                transition: 'all 0.2s'
                            }}
                            title="Copy ID"
                        >
                            {copied ? <Check size={20} /> : <Copy size={20} />}
                        </button>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--border)' }}></div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '32px', background: 'rgba(25, 120, 229, 0.05)', padding: '12px 20px', borderRadius: '10px' }}>
                        <ShieldCheck size={18} color="var(--primary)" />
                        <span>Always keep this ID private for your security.</span>
                    </div>

                    <button
                        className="btn btn-primary btn-full btn-lg"
                        onClick={goToDashboard}
                        style={{ padding: '16px', fontSize: '16px', fontWeight: '800', gap: '10px', borderRadius: '12px' }}
                    >
                        Access Your Dashboard <ArrowRight size={20} />
                    </button>

                    <button
                        className="btn btn-ghost btn-full"
                        style={{ marginTop: '16px', gap: '8px', fontSize: '14px', fontWeight: '600' }}
                    >
                        <FileBadge size={18} /> Download Identity Badge (PDF)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegistrationSuccess;
