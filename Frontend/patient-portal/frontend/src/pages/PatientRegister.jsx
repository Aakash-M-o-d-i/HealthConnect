import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    User, Mail, Phone, Calendar,
    UserCircle, ShieldCheck, Lock,
    Droplets, Fingerprint, Sparkles,
    ArrowRight, UserPlus, Shield, Globe
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import PublicNavbar from '../components/common/PublicNavbar';

const PatientRegister = ({ darkMode, setDarkMode }) => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        name: '', email: '', phone: '', dob: '', gender: '',
        govt_id: '', password: '', confirmPassword: '', blood_group: '',
    });

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            setError('Auth Mismatch: Passwords do not correlate.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const result = await register(form);
            localStorage.setItem('new_uhid', result.health_id);
            localStorage.setItem('new_name', result.name);
            navigate('/register/success');
        } catch (err) {
            setError(err.message || 'System fault during clinical registration.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh', transition: 'var(--transition)' }}>
            <PublicNavbar darkMode={darkMode} setDarkMode={setDarkMode} />

            <div style={{ padding: '80px 20px 100px', maxWidth: '1100px', margin: '0 auto' }}>
                <div className="register-card" style={{
                    padding: '60px', borderRadius: '32px',
                    background: 'var(--card-bg)', border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-md)'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            padding: '6px 16px', background: 'var(--primary-light)',
                            color: 'var(--primary)', borderRadius: '100px',
                            fontSize: '13px', fontWeight: '800', marginBottom: '24px',
                            letterSpacing: '0.5px'
                        }}>
                            <Sparkles size={14} /> NATIONAL HEALTH REGISTRY ACCESS
                        </div>
                        <h1 style={{ fontSize: '42px', fontWeight: '900', fontFamily: 'Outfit, sans-serif', color: 'var(--text)', letterSpacing: '-1px' }}>
                            Establish Health Identity
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '17px', marginTop: '12px', fontWeight: '500' }}>
                            Register now to generate your unique Universal Health ID (UHID).
                        </p>
                    </div>

                    {error && (
                        <div style={{
                            background: '#fee2e2', border: '1px solid rgba(220, 38, 38, 0.1)',
                            borderRadius: '12px', padding: '16px 24px', fontSize: '15px',
                            color: '#d93025', marginBottom: '40px', display: 'flex',
                            gap: '12px', fontWeight: '700', alignItems: 'center'
                        }}>
                            <Shield size={18} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>Full Legal Name</label>
                                <div className="input-wrapper" style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                        <User size={18} strokeWidth={1.8} />
                                    </span>
                                    <input type="text" name="name" placeholder="Name as per Govt ID" value={form.name} onChange={handleChange} style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '15px', fontWeight: '600' }} required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>Communication Email</label>
                                <div className="input-wrapper" style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                        <Mail size={18} strokeWidth={1.8} />
                                    </span>
                                    <input type="email" name="email" placeholder="name@domain.tld" value={form.email} onChange={handleChange} style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '15px', fontWeight: '600' }} required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>Primary Contact Number</label>
                                <div className="input-wrapper" style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                        <Phone size={18} strokeWidth={1.8} />
                                    </span>
                                    <input type="tel" name="phone" placeholder="+91 00000 00000" value={form.phone} onChange={handleChange} style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '15px', fontWeight: '600' }} required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>Clinical Date of Birth</label>
                                <div className="input-wrapper" style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                        <Calendar size={18} strokeWidth={1.8} />
                                    </span>
                                    <input type="date" name="dob" value={form.dob} onChange={handleChange} style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '15px', fontWeight: '600' }} required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>Gender Identity</label>
                                <div className="input-wrapper" style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 1 }}>
                                        <UserCircle size={18} strokeWidth={1.8} />
                                    </span>
                                    <select name="gender" value={form.gender} onChange={handleChange} style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '15px', fontWeight: '600', appearance: 'none' }} required>
                                        <option value="">Select Category</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>Blood Group</label>
                                <div className="input-wrapper" style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 1 }}>
                                        <Droplets size={18} strokeWidth={1.8} />
                                    </span>
                                    <select name="blood_group" value={form.blood_group} onChange={handleChange} style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '15px', fontWeight: '600', appearance: 'none' }}>
                                        <option value="">Select Category</option>
                                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(b => (
                                            <option key={b} value={b}>{b}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>Govt ID Certification (Aadhar/PAN)</label>
                                <div className="input-wrapper" style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                        <Fingerprint size={18} strokeWidth={1.8} />
                                    </span>
                                    <input type="text" name="govt_id" placeholder="0000 0000 0000" value={form.govt_id} onChange={handleChange} style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '15px', fontWeight: '600' }} required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>Secure Access Passcode</label>
                                <div className="input-wrapper" style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                        <Lock size={18} strokeWidth={1.8} />
                                    </span>
                                    <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '15px', fontWeight: '600' }} required />
                                </div>
                            </div>

                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>Confirm Secure Passcode</label>
                                <div className="input-wrapper" style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                        <Lock size={18} strokeWidth={1.8} />
                                    </span>
                                    <input type="password" name="confirmPassword" placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '15px', fontWeight: '600' }} required />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{
                                width: '100%', marginTop: '32px', padding: '18px',
                                fontSize: '16px', fontWeight: '900', gap: '12px',
                                borderRadius: '16px', boxShadow: '0 8px 16px rgba(26, 115, 232, 0.2)'
                            }}
                            disabled={loading}
                        >
                            {loading ? 'GENERATING IDENTITY...' : <><UserPlus size={22} /> ACTIVATE HEALTH ACCOUNT</>}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '40px', fontSize: '15px', fontWeight: '600', color: 'var(--text-muted)' }}>
                        Already have an identity? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '800' }}>Sign in to Portal</Link>
                    </div>

                    <div style={{
                        marginTop: '60px', paddingTop: '40px', borderTop: '1px solid var(--border)',
                        display: 'flex', justifyContent: 'center', gap: '32px',
                        color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800',
                        letterSpacing: '0.5px'
                    }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={14} color="var(--success)" /> ISO 27001 SECURE</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Lock size={14} /> E2E ENCRYPTED</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Globe size={14} /> GLOBAL STANDARDS</span>
                    </div>
                </div>

                <p style={{ textAlign: 'center', marginTop: '40px', fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600' }}>
                    © 2024 Team ATOM Digital Solutions Pvt Ltd. Verified Clinical Stack V2.4
                </p>
            </div>
        </div>
    );
};

export default PatientRegister;
