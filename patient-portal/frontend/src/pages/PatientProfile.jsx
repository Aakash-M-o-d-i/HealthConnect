import React, { useState, useEffect } from 'react';
import {
    User, Mail, Phone, Calendar, UserCircle,
    MapPin, Droplets, AlertTriangle, Activity,
    PhoneCall, ShieldCheck, Edit3, Save, X,
    Map, Globe, Navigation, ChevronRight, CheckCircle2, Menu
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/common/Sidebar';
import api from '../services/api';

const PatientProfile = ({ darkMode, setDarkMode }) => {
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({});
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const response = await api.get('/patient/profile');
                const profile = response.data;
                // If the user hasn't set fields yet, the db could be null, we inject empty strings
                setForm({
                    name: profile?.name || '',
                    phone: profile?.phone || '',
                    dob: profile?.dob || '',
                    gender: profile?.gender || '',
                    address: profile?.address || '',
                    city: profile?.city || '',
                    state: profile?.state || '',
                    pincode: profile?.pincode || '',
                    blood_group: profile?.blood_group || '',
                    allergies: (profile?.allergies || []).join(', '),
                    chronic_conditions: (profile?.chronic_conditions || []).join(', '),
                    emergency_contact: profile?.emergency_contact || '',
                });
            } catch (error) {
                console.error("Failed to load profile", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [user]);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        try {
            // Need to convert comma separated strings back to arrays for backend
            const payload = {
                ...form,
                allergies: form.allergies.split(',').map(s => s.trim()).filter(Boolean),
                chronic_conditions: form.chronic_conditions.split(',').map(s => s.trim()).filter(Boolean)
            };
            await api.patch('/patient/profile', payload);
            setSaved(true);
            setEditing(false);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Could not save profile changes.");
        }
    };

    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'AM';

    if (loading) return (
        <div className="app-layout">
            {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
            <Sidebar 
                darkMode={darkMode} 
                setDarkMode={setDarkMode} 
                isOpen={sidebarOpen} 
                onClose={() => setSidebarOpen(false)} 
            />
            <main className="main-content flex-center" style={{ background: 'var(--bg)' }}><div className="spinner"></div></main>
        </div>
    );

    return (
        <div className="app-layout">
            {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
            <Sidebar 
                darkMode={darkMode} 
                setDarkMode={setDarkMode} 
                isOpen={sidebarOpen} 
                onClose={() => setSidebarOpen(false)} 
            />
            <main className="main-content" style={{ background: 'var(--bg)' }}>
                {/* Mobile Header */}
                <div className="mobile-header">
                    <div style={{ fontWeight: '900', fontSize: '20px', color: 'var(--primary)', fontFamily: 'Outfit, sans-serif' }}>HealthConnect</div>
                    <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
                        <Menu size={22} strokeWidth={2.5} />
                    </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h1 className="page-title" style={{ fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>My Profile</h1>
                        <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '4px' }}>Manage your personal details and health information.</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            fontSize: '13px', color: 'var(--success)', fontWeight: '700',
                            padding: '10px 16px', background: 'var(--success-light)',
                            borderRadius: '12px', border: '1px solid rgba(13, 144, 79, 0.2)'
                        }}>
                            <ShieldCheck size={16} /> YOUR DATA IS SAFE
                        </div>
                    </div>
                </div>

                {/* Profile Banner */}
                <div className="profile-header" style={{
                    padding: '40px', borderRadius: '24px',
                    background: 'var(--card-bg)', border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-sm)', display: 'flex',
                    justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                        <div className="profile-avatar" style={{
                            width: '100px', height: '100px', fontSize: '36px',
                            fontWeight: '900', background: 'var(--primary)',
                            color: 'white', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', borderRadius: '32px',
                            boxShadow: '0 8px 16px rgba(26, 115, 232, 0.2)'
                        }}>{initials}</div>
                        <div>
                            <h2 style={{ fontSize: '28px', fontWeight: '900', fontFamily: 'Outfit, sans-serif', color: 'var(--text)' }}>{user?.name}</h2>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px', alignItems: 'center' }}>
                                <div style={{ fontSize: '13px', background: 'var(--primary-light)', color: 'var(--primary)', padding: '6px 14px', borderRadius: '8px', fontWeight: '800', fontFamily: 'monospace', letterSpacing: '1px' }}>
                                    HEALTH ID: {user?.health_id}
                                </div>
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>Used since 2024</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button
                            className={editing ? 'btn btn-primary' : 'btn btn-outline'}
                            onClick={editing ? handleSave : () => setEditing(true)}
                            style={{ gap: '12px', padding: '14px 32px', fontWeight: '800', borderRadius: '14px', boxShadow: editing ? 'var(--shadow-sm)' : 'none' }}
                        >
                            {editing ? <><Save size={20} /> Save Changes</> : <><Edit3 size={20} /> Edit Profile</>}
                        </button>
                    </div>
                </div>

                {saved && (
                    <div style={{
                        background: 'var(--success-light)', border: '1px solid rgba(13, 144, 79, 0.1)',
                        borderRadius: '16px', padding: '16px 24px', fontSize: '14px',
                        color: 'var(--success)', marginBottom: '24px', marginTop: '24px',
                        display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '700'
                    }}>
                        <CheckCircle2 size={20} /> Your profile has been safely updated.
                    </div>
                )}

                <div className="profile-cols-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', marginTop: '32px' }}>
                    {/* Personal Info */}
                    <div className="profile-section" style={{ borderRadius: '24px', border: '1px solid var(--border)', background: 'var(--card-bg)', boxShadow: 'var(--shadow-sm)', padding: '32px' }}>
                        <div className="profile-section-title" style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'Outfit, sans-serif', paddingBottom: '24px', borderBottom: '1px solid var(--border)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <UserCircle size={22} color="var(--primary)" /> Personal Information
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            {[
                                { label: 'Full Name', name: 'name', icon: User, editable: true },
                                { label: 'Email Address', name: 'email', icon: Mail, value: user?.email, editable: false },
                                { label: 'Phone Number', name: 'phone', icon: Phone, editable: true },
                                { label: 'Birthday', name: 'dob', icon: Calendar, editable: true, type: 'date' },
                                { label: 'Gender', name: 'gender', icon: User, editable: false },
                                { label: 'ID Number', name: 'govt_id', icon: ShieldCheck, value: user?.govt_id, editable: false },
                            ].map((f) => (
                                <div key={f.name} className="profile-field" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                                        {f.label}
                                    </label>
                                    {editing && f.editable ? (
                                        <input
                                            type={f.type || 'text'}
                                            name={f.name}
                                            style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '14px', fontWeight: '600' }}
                                            value={f.value || form[f.name] || ''}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <span style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text)' }}>
                                            {f.value || form[f.name] || '—'}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Address Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <div className="profile-section" style={{ borderRadius: '24px', border: '1px solid var(--border)', background: 'var(--card-bg)', boxShadow: 'var(--shadow-sm)', padding: '32px' }}>
                            <div className="profile-section-title" style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'Outfit, sans-serif', paddingBottom: '24px', borderBottom: '1px solid var(--border)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <MapPin size={22} color="var(--primary)" /> Address Information
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {[
                                    { label: 'Full Address', name: 'address', editable: true },
                                    { label: 'City', name: 'city', editable: true },
                                    { label: 'State', name: 'state', editable: true },
                                    { label: 'Pin Code', name: 'pincode', editable: true },
                                ].map((f) => (
                                    <div key={f.name} className="profile-field" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{f.label}</label>
                                        {editing && f.editable ? (
                                            <input
                                                type="text"
                                                name={f.name}
                                                style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '14px', fontWeight: '600' }}
                                                value={form[f.name] || ''}
                                                onChange={handleChange}
                                            />
                                        ) : (
                                            <span style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text)' }}>{form[f.name] || '—'}</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div style={{
                                marginTop: '24px', padding: '20px',
                                background: 'var(--primary-light)', borderRadius: '16px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--primary)', fontSize: '14px', fontWeight: '800',
                                border: '1px dashed var(--primary)', gap: '10px', cursor: 'pointer'
                            }}>
                                <Map size={20} /> FIND ON MAP <ChevronRight size={16} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Medical Info */}
                <div className="profile-section" style={{ marginTop: '32px', borderRadius: '24px', border: '1px solid var(--border)', background: 'var(--card-bg)', boxShadow: 'var(--shadow-sm)', padding: '32px' }}>
                    <div className="profile-section-title" style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'Outfit, sans-serif', paddingBottom: '24px', borderBottom: '1px solid var(--border)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Activity size={22} color="var(--primary)" /> Health Details
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }}>
                        <div className="profile-field">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}><Droplets size={14} color="var(--danger)" /> Blood Group</label>
                            {editing ? (
                                <select name="blood_group" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface)', fontWeight: '700', color: 'var(--text)' }} value={form.blood_group} onChange={handleChange}>
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(b => <option key={b}>{b}</option>)}
                                </select>
                            ) : (
                                <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', fontSize: '15px', fontWeight: '900', padding: '8px 16px', borderRadius: '10px', width: 'fit-content' }}>{form.blood_group}</div>
                            )}
                        </div>
                        <div className="profile-field">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}><AlertTriangle size={14} color="var(--warning)" /> Known Allergies</label>
                            {editing ? (
                                <input type="text" name="allergies" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '14px', color: 'var(--text)' }} value={form.allergies} onChange={handleChange} />
                            ) : (
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {form.allergies?.split(',').map(a => (
                                        <span key={a} style={{ background: 'var(--warning-light)', color: 'var(--warning)', fontSize: '12px', fontWeight: '800', padding: '6px 12px', borderRadius: '8px' }}>{a.trim().toUpperCase()}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="profile-field">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}><Activity size={14} color="var(--primary)" /> Long-term Conditions</label>
                            {editing ? (
                                <input type="text" name="chronic_conditions" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '14px', color: 'var(--text)' }} value={form.chronic_conditions} onChange={handleChange} />
                            ) : (
                                <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text)' }}>{form.chronic_conditions || 'None Reported'}</span>
                            )}
                        </div>
                        <div className="profile-field">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}><PhoneCall size={14} color="var(--success)" /> Emergency Contact</label>
                            {editing ? (
                                <input type="text" name="emergency_contact" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '14px' }} value={form.emergency_contact} onChange={handleChange} />
                            ) : (
                                <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)', lineHeight: '1.4' }}>{form.emergency_contact}</span>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '48px', paddingBottom: '40px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
                    © 2024 Team ATOM Digital Solutions Pvt Ltd. &nbsp;·&nbsp;
                    <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Data Disclosure Policy</a> &nbsp;·&nbsp;
                    <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Security Protocols</a>
                </div>
            </main>
        </div>
    );
};

export default PatientProfile;
