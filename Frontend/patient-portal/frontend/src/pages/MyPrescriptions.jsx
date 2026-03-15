import React, { useState, useEffect } from 'react';
import {
    Pill, Calendar, Hospital, User,
    Download, Clock, CheckCircle2, AlertCircle,
    ChevronRight, ArrowRight, HelpCircle, FileText,
    Activity, Receipt
} from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import api from '../services/api';

const STATUS_CONFIG = {
    pending: { label: 'PENDING DISPENSAL', Icon: Clock, bg: 'rgba(249, 171, 0, 0.08)', color: '#d97706' },
    dispensed: { label: 'DISPENSED', Icon: CheckCircle2, bg: 'var(--success-light)', color: 'var(--success)' },
    expired: { label: 'EXPIRED', Icon: AlertCircle, bg: '#fee2e2', color: '#d93025' },
};

const TABS = ['All', 'Pending', 'Dispensed', 'Expired'];

const MyPrescriptions = ({ darkMode, setDarkMode }) => {
    const [allRx, setAllRx] = useState([]);
    const [activeTab, setActiveTab] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const response = await api.get('/patient/prescriptions');
                const formattedRx = response.data.map(rx => ({
                    ...rx,
                    doctor: rx.doctor_name || rx.doctor
                }));
                setAllRx(formattedRx);
            } catch (error) {
                console.error("Failed to load prescriptions", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filtered = activeTab === 'All' ? allRx : allRx.filter(r => r.status === activeTab.toLowerCase());

    const handleDownload = (rx) => {
        alert(`Downloading Prescription: ${rx.rx_code}.pdf`);
    };

    return (
        <div className="app-layout">
            <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />
            <main className="main-content" style={{ background: 'var(--bg)' }}>
                <div className="page-header" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="page-title" style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>Pharmacy Wallet</h1>
                        <p className="page-subtitle" style={{ fontSize: '15px', color: 'var(--text-muted)' }}>Securely manage and track your digital medical prescriptions.</p>
                    </div>
                </div>

                {/* Tabs - Google Light Style */}
                <div className="tabs" style={{
                    marginBottom: '32px', padding: '6px', background: 'var(--surface)',
                    border: '1px solid var(--border)', borderRadius: '16px',
                    display: 'flex', gap: '4px'
                }}>
                    {TABS.map((t) => {
                        const count = t === 'All' ? allRx.length : allRx.filter(r => r.status === t.toLowerCase()).length;
                        const cfg = t === 'All' ? null : STATUS_CONFIG[t.toLowerCase()];
                        return (
                            <button
                                key={t}
                                className={`tab ${activeTab === t ? 'active' : ''}`}
                                onClick={() => setActiveTab(t)}
                                style={{
                                    flex: 1, padding: '12px 16px', borderRadius: '12px',
                                    fontSize: '13px', fontWeight: '700', border: 'none',
                                    background: activeTab === t ? 'var(--card-bg)' : 'transparent',
                                    color: activeTab === t ? 'var(--primary)' : 'var(--text-muted)',
                                    boxShadow: activeTab === t ? 'var(--shadow-sm)' : 'none',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    cursor: 'pointer', transition: 'all 0.2s'
                                }}
                            >
                                {cfg && <span className="tab-dot" style={{ background: cfg.color, width: '6px', height: '6px' }}></span>}
                                {t} {count > 0 && <span style={{ opacity: 0.5, fontSize: '11px' }}>{count}</span>}
                            </button>
                        );
                    })}
                </div>

                {/* Prescriptions List */}
                {loading ? (
                    <div style={{ padding: '100px', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }}></div></div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state" style={{ padding: '80px', background: 'var(--surface)', borderRadius: '24px', border: '1px dashed var(--border)' }}>
                        <div className="empty-icon" style={{ fontSize: '48px', marginBottom: '16px' }}>💊</div>
                        <h3 style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>No {activeTab.toLowerCase()} prescriptions</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Verified digital prescriptions from your doctors will appear here.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {filtered.map((rx) => {
                            const cfg = STATUS_CONFIG[rx.status];
                            const StatusIcon = cfg.Icon;
                            return (
                                <div key={rx.id} className="rx-card" style={{
                                    padding: '0', borderRadius: '24px', border: '1px solid var(--border)',
                                    background: 'var(--card-bg)', boxShadow: 'var(--shadow-sm)',
                                    overflow: 'hidden'
                                }}>
                                    <div className="rx-header" style={{ padding: '24px 32px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ background: 'var(--primary)', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '900', fontFamily: 'monospace', letterSpacing: '1px' }}>
                                                {rx.rx_code}
                                            </div>
                                            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>VERIFIED DIGITAL RX</div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{ background: cfg.bg, color: cfg.color, fontWeight: '800', fontSize: '11px', padding: '6px 12px', borderRadius: '6px', gap: '6px', display: 'flex', alignItems: 'center', textTransform: 'uppercase' }}>
                                                <StatusIcon size={14} /> {cfg.label}
                                            </span>
                                            <button className="icon-btn" onClick={() => handleDownload(rx)} title="Export PDF" style={{ border: '1px solid var(--border)', background: 'white' }}>
                                                <Download size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="rx-meta" style={{ padding: '24px 32px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px' }}>
                                        <div className="rx-meta-item">
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}><Hospital size={12} /> Provider</label>
                                            <div style={{ fontWeight: '700', fontSize: '15px' }}>{rx.doctor}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>{rx.facility}</div>
                                        </div>
                                        <div className="rx-meta-item">
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}><Activity size={12} /> Diagnosis</label>
                                            <div style={{ fontWeight: '700', fontSize: '15px' }}>{rx.diagnosis}</div>
                                        </div>
                                        <div className="rx-meta-item">
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}><Calendar size={12} /> Date Issued</label>
                                            <div style={{ fontWeight: '700', fontSize: '15px' }}>{rx.issue_date}</div>
                                        </div>
                                        <div className="rx-meta-item">
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}><Clock size={12} /> Valid Until</label>
                                            <div style={{ fontWeight: '700', fontSize: '15px' }}>{rx.expiry_date}</div>
                                        </div>
                                    </div>

                                    <div style={{ padding: '0 32px 32px' }}>
                                        <div style={{ padding: '16px 0', borderTop: '1px solid var(--border)', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '16px' }}>
                                            Prescribed Medication
                                        </div>
                                        <div className="rx-medicines" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                            {rx.medicines.map((med, i) => (
                                                <div key={i} className="medicine-chip" style={{ padding: '16px 20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px', minWidth: '220px' }}>
                                                    <div style={{ width: '44px', height: '44px', background: 'var(--primary-light)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                        <Pill size={20} color="var(--primary)" />
                                                    </div>
                                                    <div>
                                                        <div className="medicine-name" style={{ fontSize: '16px', fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>{med.name}</div>
                                                        <div className="medicine-dose" style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>{med.dosage}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="rx-footer" style={{ padding: '20px 32px', borderTop: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Receipt size={16} color="var(--primary)" />
                                            <span className="rx-status-text" style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)' }}>
                                                {rx.pharmacy_note}
                                            </span>
                                        </div>
                                        {rx.status === 'dispensed' && rx.transaction_id && (
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace', fontWeight: '700' }}>VERIFICATION_ID: {rx.transaction_id}</div>
                                        )}
                                        {rx.status === 'expired' && (
                                            <button className="btn btn-primary btn-sm" style={{ gap: '8px', padding: '10px 20px', borderRadius: '10px' }}>Renew via Consultant <ChevronRight size={14} /></button>
                                        )}
                                        {rx.status === 'pending' && (
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', animation: 'pulse 2s infinite' }}></div>
                                                Awaiting collection at partner pharmacy
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Support Banner - Google Style */}
                <div style={{
                    marginTop: '40px', padding: '40px', background: 'linear-gradient(135deg, #1a73e8, #0891b2)',
                    color: 'white', borderRadius: '28px', boxShadow: '0 12px 24px rgba(26, 115, 232, 0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div style={{ width: '64px', height: '64px', background: 'rgba(255,255,255,0.2)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <HelpCircle size={32} color="white" strokeWidth={2} />
                        </div>
                        <div>
                            <div style={{ fontWeight: '900', fontSize: '22px', fontFamily: 'Outfit, sans-serif' }}>Pharmacy Assistance</div>
                            <div style={{ fontSize: '15px', opacity: 0.9, marginTop: '4px', fontWeight: '500' }}>Connect with our certified pharmacologists for help with your prescriptions.</div>
                        </div>
                    </div>
                    <button 
                        className="btn" 
                        onClick={() => alert("Connecting to a verified pharmacologist... (Feature arriving soon!)")}
                        style={{ background: 'white', color: 'var(--primary)', padding: '14px 32px', borderRadius: '14px', fontWeight: '800', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', cursor: 'pointer' }}
                    >
                        Chat with Pharmacy
                    </button>
                </div>
            </main>
        </div>
    );
};

export default MyPrescriptions;
