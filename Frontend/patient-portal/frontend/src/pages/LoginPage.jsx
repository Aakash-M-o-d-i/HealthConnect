import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    LogIn, Mail, Lock, Eye, EyeOff,
    ChevronRight, ArrowLeft, ShieldCheck,
    Globe, Shield, Heart
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import PublicNavbar from '../components/common/PublicNavbar';

const LoginPage = ({ darkMode, setDarkMode }) => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('System mismatch: Verified credentials required.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh', transition: 'var(--transition)' }}>
            <PublicNavbar darkMode={darkMode} setDarkMode={setDarkMode} />

            <div style={{ padding: '80px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="auth-card" style={{
                    padding: '60px', borderRadius: '32px',
                    maxWidth: '500px', width: '100%',
                    background: 'var(--card-bg)', border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-md)'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <div style={{
                            width: '56px', height: '56px', background: 'var(--primary-light)',
                            color: 'var(--primary)', borderRadius: '16px',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center', margin: '0 auto 20px'
                        }}>
                            <LogIn size={28} strokeWidth={2.5} />
                        </div>
                        <h1 style={{ fontSize: '32px', fontWeight: '900', fontFamily: 'Outfit, sans-serif', color: 'var(--text)', letterSpacing: '-0.5px' }}>
                            Secure Access
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '8px', fontWeight: '500' }}>
                            Patient Portal Identity Verification
                        </p>
                    </div>

                    {error && (
                        <div style={{
                            background: '#fee2e2', border: '1px solid rgba(220, 38, 38, 0.1)',
                            borderRadius: '12px', padding: '16px 20px', fontSize: '14px',
                            color: '#d93025', marginBottom: '32px', display: 'flex',
                            gap: '12px', fontWeight: '700', alignItems: 'center'
                        }}>
                            <Shield size={18} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>Primary Communication Email</label>
                            <div className="input-wrapper" style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                    <Mail size={18} strokeWidth={1.8} />
                                </span>
                                <input
                                    type="email"
                                    placeholder="name@clinical.tld"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{
                                        width: '100%', padding: '14px 14px 14px 48px',
                                        borderRadius: '12px', border: '1px solid var(--border)',
                                        background: 'var(--surface)', fontSize: '15px',
                                        fontWeight: '600'
                                    }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <label style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Secure Passcode</label>
                                <a href="#" style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary)', textDecoration: 'none' }}>FORGOT KEY?</a>
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
                                        width: '100%', padding: '14px 50px 14px 48px',
                                        borderRadius: '12px', border: '1px solid var(--border)',
                                        background: 'var(--surface)', fontSize: '15px',
                                        fontWeight: '600'
                                    }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{
                                marginTop: '16px', padding: '18px',
                                fontSize: '15px', fontWeight: '900',
                                gap: '12px', borderRadius: '16px',
                                boxShadow: '0 8px 16px rgba(26, 115, 232, 0.2)'
                            }}
                            disabled={loading}
                        >
                            {loading ? 'INITIALIZING...' : <><ShieldCheck size={20} /> VERIFY & SIGN IN</>}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '40px', fontSize: '15px', fontWeight: '600', color: 'var(--text-muted)' }}>
                        New patient? <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '800' }}>Establish Account</Link>
                    </div>

                    <div style={{
                        marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--border)',
                        display: 'flex', justifyContent: 'center', gap: '24px',
                        color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800',
                        letterSpacing: '0.5px'
                    }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={14} color="var(--success)" /> AES-256 ENCRYPTED</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Globe size={14} /> HIPAA COMPLIANT</span>
                    </div>
                </div>

                <Link to="/" style={{
                    marginTop: '32px', color: 'var(--text-muted)',
                    fontSize: '14px', display: 'flex', alignItems: 'center',
                    gap: '8px', fontWeight: '700', textDecoration: 'none'
                }}>
                    <ArrowLeft size={16} /> RETURN TO ECOSYSTEM
                </Link>
            </div>
        </div>
    );
};

export default LoginPage;
