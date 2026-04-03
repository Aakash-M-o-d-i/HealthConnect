import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    QrCode, Copy, Check, Calendar, Moon, Sun,
    FileText, Pill, UserCircle, ChevronRight,
    Activity, ClipboardList, Stethoscope, ArrowUpRight,
    Download, ShieldCheck, Menu
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/common/Sidebar';
import HealthIDCard from '../components/common/HealthIDCard';
import api from '../services/api';

const PatientDashboard = ({ darkMode, setDarkMode }) => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [history, setHistory] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const cardRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, visitsRes, prescriptionsRes, profileRes] = await Promise.all([
                    api.get('/patient/stats'),
                    api.get('/patient/visits'),
                    api.get('/patient/prescriptions'),
                    api.get('/patient/profile')
                ]);
                setStats(statsRes.data);
                setProfile(profileRes.data);
                
                // Combine and sort visits and prescriptions for Clinical History
                const formattedVisits = visitsRes.data.map(v => ({ ...v, itemType: 'visit' }));
                const formattedRxs = prescriptionsRes.data.map(p => ({
                    ...p, 
                    itemType: 'prescription',
                    date: p.issue_date,
                    time: 'N/A' // prescriptions don't have a time in the current model
                }));
                
                const combined = [...formattedVisits, ...formattedRxs].sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateB - dateA; // descending
                });
                
                setHistory(combined);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
                setStats({ medical_records: 0, prescriptions: 0, upcoming_visits: 0, health_score: 0 });
                setHistory([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const downloadCard = async () => {
        if (!cardRef.current) return;
        setDownloading(true);
        try {
            await new Promise(r => setTimeout(r, 1000));
            const front = cardRef.current.querySelector('#card-front');
            const back = cardRef.current.querySelector('#card-back');
            if (!front || !back) throw new Error("Card elements not found");
            const canvasOptions = { scale: 2, useCORS: true, logging: false, backgroundColor: null };
            const frontCanvas = await html2canvas(front, canvasOptions);
            const backCanvas = await html2canvas(back, canvasOptions);
            const pdf = new jsPDF('l', 'mm', 'a4');
            pdf.addImage(frontCanvas.toDataURL('image/png'), 'PNG', (pdf.internal.pageSize.getWidth() - 170) / 2, (pdf.internal.pageSize.getHeight() - 105) / 2, 170, 105);
            pdf.addPage();
            pdf.addImage(backCanvas.toDataURL('image/png'), 'PNG', (pdf.internal.pageSize.getWidth() - 170) / 2, (pdf.internal.pageSize.getHeight() - 105) / 2, 170, 105);
            pdf.save(`HealthConnect_ID_${user?.health_id}.pdf`);
        } catch (error) {
            console.error("Failed to generate card:", error);
        } finally {
            setDownloading(false);
        }
    };

    const copyUhid = () => {
        navigator.clipboard.writeText(user?.health_id || '');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    const statCards = !stats ? [] : [
        { label: 'Test Results', value: stats.medical_records, Icon: FileText, badge: '+2 new', badgeColor: 'var(--success)', bg: 'var(--primary-light)', iconColor: 'var(--primary)' },
        { label: 'Active Medicines', value: stats.prescriptions, Icon: Pill, bg: 'var(--secondary-light)', iconColor: 'var(--secondary)' },
        { label: 'Doctor Visits', value: stats.upcoming_visits, Icon: Calendar, badge: 'Next: Oct 20', badgeColor: 'var(--warning)', bg: 'var(--warning-light)', iconColor: 'var(--warning)' },
        { label: 'Health Score', value: `${stats.health_score}%`, Icon: Activity, badge: 'Excellent', badgeColor: 'var(--success)', bg: 'var(--success-light)', iconColor: 'var(--success)' },
    ];

    return (
        <div className="app-layout">
            <Sidebar 
                darkMode={darkMode} 
                setDarkMode={setDarkMode} 
                isOpen={sidebarOpen} 
                onClose={() => setSidebarOpen(false)} 
            />
            
            {/* Mobile Overlay */}
            <div 
                className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} 
                onClick={() => setSidebarOpen(false)} 
            />

            <main className="main-content">
                {/* Mobile Header */}
                <div className="mobile-header">
                    <div style={{ fontWeight: '900', fontSize: '20px', color: 'var(--primary)', fontFamily: 'Outfit, sans-serif' }}>HealthConnect</div>
                    <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
                        <Menu size={22} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Header */}
                <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px' }}>
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
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
                                Welcome back! Your health records are up to date.
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

                {/* UHID Card */}
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
                    <div className="health-id-actions" style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
                        <button className="health-id-btn" onClick={copyUhid} style={{ background: 'white', color: 'var(--primary)', fontWeight: '800', padding: '10px 20px', borderRadius: '10px', border: 'none' }}>
                            {copied ? <><Check size={16} strokeWidth={3} /> Copied!</> : <><Copy size={16} strokeWidth={2.5} /> COPY IDENTIFIER</>}
                        </button>
                        <button className="health-id-btn" onClick={downloadCard} disabled={downloading} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1.5px solid rgba(255,255,255,0.25)', padding: '10px 20px', borderRadius: '10px', fontWeight: '700' }}>
                            <QrCode size={16} /> {downloading ? 'GENERATING...' : 'DOWNLOAD CARD'}
                        </button>
                    </div>
                </div>

                <HealthIDCard ref={cardRef} user={user} profile={profile} />

                {/* Stats */}
                <div className="stats-grid" style={{ marginBottom: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                    {loading ? [1, 2, 3, 4].map(i => (
                        <div key={i} className="stat-card" style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner"></div></div>
                    )) : statCards.map((s) => (
                        <div key={s.label} className="stat-card" style={{ padding: '24px', borderRadius: '20px', border: '1px solid var(--border)', background: 'var(--card-bg)', boxShadow: 'var(--shadow-sm)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div className="stat-icon" style={{ background: s.bg, width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <s.Icon size={22} color={s.iconColor} />
                                </div>
                                {s.badge && <div className="stat-badge" style={{ background: 'var(--surface)', color: s.badgeColor, fontWeight: '700', fontSize: '11px', padding: '4px 8px', borderRadius: '6px' }}>{s.badge}</div>}
                            </div>
                            <div style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'Outfit, sans-serif', color: 'var(--text)' }}>{s.value}</div>
                            <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600' }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Main Grid */}
                <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
                    <div style={{ background: 'var(--card-bg)', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                        <div style={{ padding: '24px 30px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'Outfit, sans-serif', color: 'var(--text)' }}>My Health History</h2>
                            <Link to="/records" style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                VIEW ALL <ArrowUpRight size={14} />
                            </Link>
                        </div>
                        <div style={{ padding: '0' }}>
                            {history.length === 0 && !loading && <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No history available.</div>}
                            {history.slice(0, 10).map((item, i) => (
                                <div key={i} className="health-history-item" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px 30px', borderBottom: i < 9 ? '1px solid var(--border)' : 'none' }}>
                                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: 'var(--primary)', fontSize: '12px' }}>
                                        {item.itemType === 'prescription' ? <Pill size={20} /> : (item.doctor_name || 'DR').slice(0, 2).toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '700', color: 'var(--text)' }}>{item.itemType === 'prescription' ? `RX: ${item.rx_code}` : (item.doctor_name || 'Doctor')}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.facility || 'Facility'} — {item.diagnosis || 'Checkup'}</div>
                                    </div>
                                    <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--text-muted)' }}>{item.date}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ background: 'var(--card-bg)', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', padding: '24px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'Outfit, sans-serif', color: 'var(--text)', marginBottom: '20px' }}>Services</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {[
                                    { Icon: ClipboardList, title: 'Health Records', path: '/records', color: 'var(--primary)' },
                                    { Icon: Pill, title: 'My Prescriptions', path: '/prescriptions', color: '#7c3aed' },
                                    { Icon: UserCircle, title: 'My Profile', path: '/profile', color: 'var(--success)' },
                                ].map((a) => (
                                    <Link key={a.title} to={a.path} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '16px', background: 'var(--surface)', textDecoration: 'none', border: '1px solid transparent' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                            <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><a.Icon size={18} color={a.color} /></div>
                                            <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text)' }}>{a.title}</span>
                                        </div>
                                        <ChevronRight size={16} />
                                    </Link>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </main>

        </div>
    );
};

export default PatientDashboard;
