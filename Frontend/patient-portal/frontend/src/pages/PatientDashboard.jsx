import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    QrCode, Copy, Check, Calendar, Moon, Sun,
    FileText, Pill, UserCircle, ChevronRight,
    Activity, ClipboardList, Stethoscope, ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/common/Sidebar';
import api from '../services/api';

const PatientDashboard = ({ darkMode, setDarkMode }) => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, visitsRes] = await Promise.all([
                    api.get('/patient/stats'),
                    api.get('/patient/visits')
                ]);
                setStats(statsRes.data);
                setVisits(visitsRes.data);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
                // Fallback empty state on error
                setStats({ medical_records: 0, prescriptions: 0, upcoming_visits: 0, health_score: 0 });
                setVisits([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const copyUhid = () => {
        navigator.clipboard.writeText(user?.health_id || '');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    const statCards = !stats ? [] : [
        {
            label: 'Lab Reports', value: stats.medical_records,
            Icon: FileText, badge: '+2 new', badgeColor: 'var(--success)',
            bg: 'rgba(26, 115, 232, 0.08)', iconColor: 'var(--primary)',
        },
        {
            label: 'Active Prescriptions', value: stats.prescriptions,
            Icon: Pill, bg: 'rgba(124, 58, 237, 0.08)', iconColor: '#7c3aed',
        },
        {
            label: 'Upcoming Visits', value: stats.upcoming_visits,
            Icon: Calendar, badge: 'Next: Oct 20', badgeColor: 'var(--warning)',
            bg: 'rgba(249, 171, 0, 0.08)', iconColor: 'var(--warning)',
        },
        {
            label: 'Health Score', value: `${stats.health_score}%`,
            Icon: Activity, badge: 'Excellent', badgeColor: 'var(--success)',
            bg: 'rgba(13, 144, 79, 0.08)', iconColor: 'var(--success)',
        },
    ];

    const dotColors = ['var(--primary)', '#8b5cf6', 'var(--success)'];

    return (
        <div className="app-layout">
            <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />
            <main className="main-content" style={{ background: 'var(--bg)' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '18px',
                            background: 'var(--primary)', color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '24px', fontWeight: '900', boxShadow: '0 8px 16px rgba(26, 115, 232, 0.2)'
                        }}>
                            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'P'}
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <h1 style={{ fontSize: '32px', fontWeight: '900', fontFamily: 'Outfit, sans-serif', color: 'var(--text)' }}>
                                    {user?.name || 'Aakash Modi'}
                                </h1>
                                <div style={{
                                    fontSize: '11px', fontWeight: '800', color: 'var(--primary)',
                                    background: 'var(--primary-light)', padding: '4px 10px',
                                    borderRadius: '8px', letterSpacing: '0.5px'
                                }}>VERIFIED PATIENT</div>
                            </div>
                            <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '4px', fontWeight: '500' }}>
                                Welcome back! Your clinical profile is up to date.
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            fontSize: '13px', color: 'var(--text-muted)',
                            padding: '12px 20px', background: 'var(--surface)',
                            border: '1px solid var(--border)', borderRadius: '14px',
                            fontWeight: '700', boxShadow: 'var(--shadow-sm)'
                        }}>
                            <Calendar size={18} strokeWidth={2.5} color="var(--primary)" />
                            {today}
                        </div>
                    </div>
                </div>

                {/* UHID Card - Refined for Google Light */}
                <div className="health-id-card" style={{
                    background: 'linear-gradient(135deg, #1a73e8, #1557b0)',
                    padding: '32px 40px', borderRadius: '24px',
                    boxShadow: '0 12px 24px rgba(26, 115, 232, 0.25)',
                    marginBottom: '36px', position: 'relative'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                        <div style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.15)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <QrCode size={16} color="white" />
                        </div>
                        <span className="health-id-label" style={{ fontSize: '10px', letterSpacing: '2.5px', opacity: 0.8, fontWeight: '700' }}>UNIVERSAL HEALTH ID</span>
                    </div>
                    <div className="health-id-value" style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '3px' }}>{user?.health_id || 'HID-A7B3-K9M2'}</div>
                    <div className="health-id-actions" style={{ marginTop: '24px' }}>
                        <button className="health-id-btn" onClick={copyUhid} style={{ background: 'white', color: 'var(--primary)', fontWeight: '800', padding: '10px 20px', borderRadius: '10px', border: 'none' }}>
                            {copied
                                ? <><Check size={16} strokeWidth={3} /> Copied!</>
                                : <><Copy size={16} strokeWidth={2.5} /> COPY IDENTIFIER</>}
                        </button>
                        <button 
                            className="health-id-btn" 
                            onClick={() => alert(`Downloading Health ID Card for ${user?.health_id}.pdf`)}
                            style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1.5px solid rgba(255,255,255,0.25)', padding: '10px 20px', borderRadius: '10px', fontWeight: '700' }}
                        >
                            <QrCode size={16} /> DOWNLOAD CARD
                        </button>
                    </div>
                </div>

                {/* Stats */}
                {loading ? (
                    <div className="stats-grid">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="stat-card" style={{ height: '140px' }}>
                                <div className="spinner" style={{ margin: '40px auto' }}></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="stats-grid" style={{ marginBottom: '32px', gap: '20px' }}>
                        {statCards.map((s) => {
                            const Icon = s.Icon;
                            return (
                                <div key={s.label} className="stat-card" style={{
                                    padding: '24px', borderRadius: '20px',
                                    border: '1px solid var(--border)',
                                    background: 'var(--card-bg)',
                                    boxShadow: 'var(--shadow-sm)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                        <div className="stat-icon" style={{ background: s.bg, width: '48px', height: '48px', borderRadius: '12px' }}>
                                            <Icon size={22} color={s.iconColor} strokeWidth={2} />
                                        </div>
                                        {s.badge && (
                                            <div className="stat-badge" style={{
                                                background: s.badgeColor === 'var(--success)' ? 'var(--success-light)' : 'rgba(249, 171, 0, 0.1)',
                                                color: s.badgeColor, fontWeight: '700', fontSize: '11px', borderRadius: '6px'
                                            }}>
                                                {s.badge}
                                            </div>
                                        )}
                                    </div>
                                    <div className="stat-value" style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>{s.value}</div>
                                    <div className="stat-label" style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600' }}>{s.label}</div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Main Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
                    {/* Recent Visits */}
                    <div style={{ background: 'var(--card-bg)', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                        <div style={{ padding: '24px 30px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'Outfit, sans-serif', color: 'var(--text)' }}>Clinical History</h2>
                            <Link to="/records" style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                VIEW FULL EMR <ArrowUpRight size={14} />
                            </Link>
                        </div>
                        <div style={{ padding: '0' }}>
                            {visits.map((v, i) => (
                                <div key={v.id} style={{
                                    display: 'flex', alignItems: 'center', gap: '20px',
                                    padding: '20px 30px',
                                    borderBottom: i < visits.length - 1 ? '1px solid var(--border)' : 'none',
                                    transition: 'background 0.2s',
                                    cursor: 'pointer'
                                }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--surface)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                    <div style={{
                                        width: '44px', height: '44px', borderRadius: '12px',
                                        background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '11px', fontWeight: '800', color: 'var(--primary)', textAlign: 'center', lineHeight: '1.1'
                                    }}>
                                        {v.doctor.split(' ')[1].slice(0, 3).toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '700', fontSize: '16px', color: 'var(--text)', fontFamily: 'Outfit, sans-serif' }}>{v.doctor}</div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>{v.facility} — {v.diagnosis}</div>
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textAlign: 'right' }}>
                                        {v.date}<br />{v.time}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ background: 'var(--card-bg)', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', padding: '24px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'Outfit, sans-serif', color: 'var(--text)', marginBottom: '20px' }}>Clinical Services</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {[
                                    { Icon: ClipboardList, title: 'Medical Records', desc: 'Secure history & lab reports', path: '/records', bg: 'rgba(26, 115, 232, 0.08)', iconColor: 'var(--primary)' },
                                    { Icon: Pill, title: 'Pharmacy Wallet', desc: 'Digital RX codes & meds', path: '/prescriptions', bg: 'rgba(124, 58, 237, 0.08)', iconColor: '#7c3aed' },
                                    { Icon: UserCircle, title: 'Health Identity', desc: 'Manage your UHID & clinical data', path: '/profile', bg: 'rgba(13, 144, 79, 0.08)', iconColor: 'var(--success)' },
                                ].map((a) => {
                                    const Icon = a.Icon;
                                    return (
                                        <Link key={a.title} to={a.path} style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            padding: '16px', borderRadius: '16px', background: 'var(--surface)',
                                            border: '1px solid var(--border)', transition: 'all 0.2s', textDecoration: 'none'
                                        }} onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--primary)', e.currentTarget.style.transform = 'translateY(-2px)')} onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--border)', e.currentTarget.style.transform = 'translateY(0)')}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                                <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                                    <Icon size={18} color={a.iconColor} />
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text)', fontFamily: 'Outfit, sans-serif' }}>{a.title}</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{a.desc}</div>
                                                </div>
                                            </div>
                                            <ChevronRight size={16} color="var(--text-muted)" />
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Premium Card */}
                        <div style={{
                            padding: '30px', borderRadius: '24px',
                            background: 'linear-gradient(135deg, #7c3aed, #1a73e8)',
                            color: 'white', boxShadow: '0 10px 20px rgba(124, 58, 237, 0.2)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                <Stethoscope size={20} color="white" />
                                <h4 style={{ margin: 0, fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>VIRTUAL CARE</h4>
                            </div>
                            <p style={{ fontSize: '14px', opacity: 0.9, lineHeight: '1.5', marginBottom: '24px' }}>Book a 24/7 consultation with specialists starting from ₹99.</p>
                            <button 
                                onClick={() => alert("Launching 24/7 Virtual Care portal... (Feature arriving soon!)")}
                                style={{
                                    background: 'white', color: 'var(--primary)',
                                    width: '100%', padding: '12px', borderRadius: '12px',
                                    border: 'none', fontWeight: '800', fontSize: '14px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                Book Now <ArrowUpRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PatientDashboard;
