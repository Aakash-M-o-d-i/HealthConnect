import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    LogIn, Mail, Lock, Eye, EyeOff,
    ChevronRight, ArrowLeft, ShieldCheck,
    Globe, Shield, Heart, Sparkles, Check
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import PublicNavbar from '../components/common/PublicNavbar';

const LoginPage = ({ darkMode, setDarkMode }) => {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Authentication error: Invalid credentials. If you are a hackathon evaluator, use the demo quick-fill buttons below.');
        } finally {
            setLoading(false);
        }
    };

    const handleDemoFill = (demoEmail, demoPass) => {
        setEmail(demoEmail);
        setPassword(demoPass);
        setError('');
    };

    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh', transition: 'background-color 0.3s ease' }}>
            <PublicNavbar darkMode={darkMode} setDarkMode={setDarkMode} />

            <div style={{ padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="auth-card" style={{
                    padding: '48px 40px',
                    borderRadius: '24px',
                    maxWidth: '520px',
                    width: '100%',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border)',
                    boxShadow: darkMode
                        ? '0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)'
                        : '0 20px 40px rgba(15,23,42,0.08), 0 0 0 1px rgba(0,0,0,0.04)'
                }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{
                            width: '52px', height: '52px',
                            background: 'var(--primary-light)', color: 'var(--primary)',
                            borderRadius: '14px', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', margin: '0 auto 16px',
                            boxShadow: '0 4px 12px rgba(26, 115, 232, 0.2)'
                        }}>
                            <ShieldCheck size={28} strokeWidth={2.2} />
                        </div>
                        <span style={{
                            fontSize: '11px',
                            fontWeight: '800',
                            letterSpacing: '0.8px',
                            color: 'var(--primary)',
                            textTransform: 'uppercase',
                            background: 'var(--primary-light)',
                            padding: '3px 10px',
                            borderRadius: '100px'
                        }}>
                            National ABHA Health Vault
                        </span>
                        <h1 style={{ fontSize: '28px', fontWeight: '900', fontFamily: 'Outfit, sans-serif', color: 'var(--text)', letterSpacing: '-0.5px', marginTop: '10px' }}>
                            Citizen Sign In
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px', fontWeight: '500' }}>
                            Access your encrypted longitudinal medical records & e-prescriptions
                        </p>
                    </div>

                    {/* Evaluator Quick-Fill Helper */}
                    <div style={{
                        background: darkMode ? 'rgba(30, 41, 59, 0.6)' : '#f8fafc',
                        border: '1px solid var(--border)',
                        borderRadius: '14px',
                        padding: '14px 16px',
                        marginBottom: '24px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                            <Sparkles size={14} /> Hackathon Evaluator Quick-Fill
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <button
                                type="button"
                                onClick={() => handleDemoFill('aakashmodi150@gmail.com', 'password123')}
                                style={{
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border)',
                                    background: 'var(--surface)',
                                    color: 'var(--text)',
                                    cursor: 'pointer'
                                }}
                            >
                                Fill Aakash Modi (A+)
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDemoFill('rahul@gmail.com', 'hash123')}
                                style={{
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border)',
                                    background: 'var(--surface)',
                                    color: 'var(--text)',
                                    cursor: 'pointer'
                                }}
                            >
                                Fill Rahul Sharma (O+)
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div style={{
                            background: '#fee2e2', border: '1px solid rgba(220, 38, 38, 0.2)',
                            borderRadius: '12px', padding: '14px 16px', fontSize: '13px',
                            color: '#b91c1c', marginBottom: '24px', display: 'flex',
                            gap: '10px', fontWeight: '600', alignItems: 'center'
                        }}>
                            <Shield size={18} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                Citizen Email or Health ID
                            </label>
                            <div className="input-wrapper" style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                    <Mail size={18} strokeWidth={1.8} />
                                </span>
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{
                                        width: '100%', padding: '13px 14px 13px 46px',
                                        borderRadius: '12px', border: '1px solid var(--border)',
                                        background: 'var(--surface)', fontSize: '14px',
                                        fontWeight: '600', color: 'var(--text)', outline: 'none'
                                    }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>
                                    Account Password
                                </label>
                                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary)', cursor: 'pointer' }}>
                                    FORGOT PASSWORD?
                                </span>
                            </div>
                            <div className="input-wrapper" style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                    <Lock size={18} strokeWidth={1.8} />
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{
                                        width: '100%', padding: '13px 46px 13px 46px',
                                        borderRadius: '12px', border: '1px solid var(--border)',
                                        background: 'var(--surface)', fontSize: '14px',
                                        fontWeight: '600', color: 'var(--text)', outline: 'none'
                                    }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            style={{
                                marginTop: '12px', padding: '15px',
                                fontSize: '15px', fontWeight: '800',
                                borderRadius: '12px',
                                background: 'var(--primary)',
                                color: 'white', border: 'none',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                gap: '10px', cursor: 'pointer',
                                boxShadow: '0 8px 20px rgba(26, 115, 232, 0.25)'
                            }}
                            disabled={loading}
                        >
                            {loading ? 'AUTHENTICATING CITIZEN...' : <><ShieldCheck size={18} /> SECURE SIGN IN</>}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '28px', fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>
                        Don't have an ABHA Health ID? <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '800' }}>Register Online</Link>
                    </div>

                    <div style={{
                        marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--border)',
                        display: 'flex', justifyContent: 'center', gap: '20px',
                        color: 'var(--text-muted)', fontSize: '11px', fontWeight: '700',
                        letterSpacing: '0.4px'
                    }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldCheck size={14} color="#10b981" /> 256-BIT ENCRYPTED</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Globe size={14} /> ABDM COMPLIANT</span>
                    </div>
                </div>

                <Link to="/" style={{
                    marginTop: '24px', color: 'var(--text-muted)',
                    fontSize: '13px', display: 'flex', alignItems: 'center',
                    gap: '6px', fontWeight: '700', textDecoration: 'none'
                }}>
                    <ArrowLeft size={15} /> Back to National Health Grid
                </Link>
            </div>
        </div>
    );
};

export default LoginPage;
