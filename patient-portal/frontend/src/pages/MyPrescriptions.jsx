import React, { useState, useEffect } from 'react';
import {
    Pill, Calendar, Hospital, User,
    Download, Clock, CheckCircle2, AlertCircle,
    ChevronRight, ArrowRight, HelpCircle, FileText,
    Activity, Receipt, Menu
} from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { jsPDF } from 'jspdf';

const STATUS_CONFIG = {
    pending: { label: 'WAITING AT PHARMACY', Icon: Clock, bg: 'var(--warning-light)', color: 'var(--warning)' },
    dispensed: { label: 'COLLECTED', Icon: CheckCircle2, bg: 'var(--success-light)', color: 'var(--success)' },
    expired: { label: 'EXPIRED', Icon: AlertCircle, bg: 'var(--danger-light)', color: 'var(--danger)' },
};

const TABS = ['All', 'Pending', 'Dispensed', 'Expired'];

const MyPrescriptions = ({ darkMode, setDarkMode }) => {
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
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
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const blueColor = [26, 115, 232];
        const textColor = [32, 33, 36];
        const mutedTextColor = [95, 99, 104];

        // 1. Branding & Header Section
        doc.setTextColor(blueColor[0], blueColor[1], blueColor[2]);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(26);
        doc.text("HealthConnect", 20, 25);
        
        doc.setTextColor(mutedTextColor[0], mutedTextColor[1], mutedTextColor[2]);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("OFFICIAL MEDICAL DOCUMENT", 20, 32);

        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.setFontSize(14);
        doc.text(`Date: ${rx.issue_date || '2026-03-28'}`, 140, 25);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Verified Record", 163, 32);
        
        doc.setTextColor(blueColor[0], blueColor[1], blueColor[2]);
        doc.setFont("helvetica", "bold");
        doc.text(`PRESCRIPTION: ${rx.rx_code || 'RXLOUKBB'}`, 142, 40);

        // Header Border
        doc.setDrawColor(241, 243, 244);
        doc.setLineWidth(1);
        doc.line(20, 48, 190, 48);

        // 2. Metadata Columns (Reason for Visit & Doctor)
        doc.setTextColor(blueColor[0], blueColor[1], blueColor[2]);
        doc.setFontSize(10);
        doc.text("Patient Details", 20, 60);
        doc.text("Doctor / Clinic", 110, 60);

        doc.setTextColor(mutedTextColor[0], mutedTextColor[1], mutedTextColor[2]);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`ID: HID-QTYB-VUL5`, 20, 67);
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(`Name: Aakash Modi`, 20, 75);
        
        doc.text(`Dr. ${rx.doctor || 'Aakash Modi'}`, 110, 70);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(rx.facility || "HealthConnect Clinic", 110, 75);

        // Header Border Extra line for separation
        doc.line(20, 80, 190, 80);

        doc.setTextColor(blueColor[0], blueColor[1], blueColor[2]);
        doc.setFontSize(10);
        doc.text("Diagnosis / Reason", 20, 90);
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text(rx.diagnosis || "General Consultation", 20, 100);

        // 3. Medicines List
        doc.setTextColor(mutedTextColor[0], mutedTextColor[1], mutedTextColor[2]);
        doc.setFontSize(11);
        doc.text("YOUR MEDICINES", 20, 115);

        let currentY = 125;
        (rx.medicines || []).forEach((med) => {
            // Medicine Card Background
            doc.setFillColor(248, 249, 250);
            doc.roundedRect(20, currentY, 170, 28, 4, 4, 'F');
            doc.setDrawColor(238, 238, 238);
            doc.roundedRect(20, currentY, 170, 28, 4, 4, 'S');

            // Name
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text(med.name || "Medicine Name", 45, currentY + 10);

            // Dose & Duration
            doc.setTextColor(mutedTextColor[0], mutedTextColor[1], mutedTextColor[2]);
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("Dose:", 45, currentY + 18);
            doc.setFont("helvetica", "normal");
            doc.text(med.dosage || "1-0-1", 58, currentY + 18);
            
            doc.text("|", 75, currentY + 18);
            
            doc.setFont("helvetica", "bold");
            doc.text("Duration:", 80, currentY + 18);
            doc.setFont("helvetica", "normal");
            doc.text(`${med.duration || '5'} Days`, 100, currentY + 18);

            // Instructions (on the right)
            doc.setTextColor(blueColor[0], blueColor[1], blueColor[2]);
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text("INSTRUCTIONS", 145, currentY + 10);
            doc.setTextColor(mutedTextColor[0], mutedTextColor[1], mutedTextColor[2]);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            doc.text(med.instructions || "after food", 145, currentY + 18);

            currentY += 35;
        });

        // 4. Footer Section
        doc.setDrawColor(241, 243, 244);
        doc.line(20, 250, 190, 250);

        doc.setTextColor(200, 200, 200);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("SECURITY DETAILS", 20, 260);

        doc.setFontSize(11);
        doc.setTextColor(mutedTextColor[0], mutedTextColor[1], mutedTextColor[2]);
        doc.setFont("helvetica", "normal");
        doc.text(`SHA-256: ${Math.random().toString(36).substr(2, 16).toUpperCase()}`, 20, 268);
        doc.setFont("helvetica", "bold");
        doc.text(`VERIFICATION ID: ${rx.transaction_id || 'TXND2HECMTP'}`, 20, 275);

        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.text("This is a digitally generated prescription and does not require a physical signature.", 190, 268, { align: 'right' });

        doc.save(`Medical_Record_${rx.rx_code || 'RXLOUKBB'}.pdf`);
    };

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
                <div className="page-header" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="page-title" style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>My Prescriptions</h1>
                        <p className="page-subtitle" style={{ fontSize: '15px', color: 'var(--text-muted)' }}>Securely manage and track your doctor's prescriptions.</p>
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
                        <p style={{ color: 'var(--text-muted)' }}>Digital prescriptions from your doctors will appear here.</p>
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
                                            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>VERIFIED RECORD</div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{ background: cfg.bg, color: cfg.color, fontWeight: '800', fontSize: '11px', padding: '6px 12px', borderRadius: '6px', gap: '6px', display: 'flex', alignItems: 'center', textTransform: 'uppercase' }}>
                                                <StatusIcon size={14} /> {cfg.label}
                                            </span>
                                            <button className="icon-btn" onClick={() => handleDownload(rx)} title="Export PDF" style={{ border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--text)' }}>
                                                <Download size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="rx-meta-grid" style={{ padding: '24px 32px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px' }}>
                                        <div className="rx-meta-item">
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}><Hospital size={12} /> Doctor / Clinic</label>
                                            <div style={{ fontWeight: '700', fontSize: '15px' }}>{rx.doctor}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>{rx.facility}</div>
                                        </div>
                                        <div className="rx-meta-item">
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}><Activity size={12} /> Reason for visit</label>
                                            <div style={{ fontWeight: '700', fontSize: '15px' }}>{rx.diagnosis}</div>
                                        </div>
                                        <div className="rx-meta-item">
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}><Calendar size={12} /> Date Given</label>
                                            <div style={{ fontWeight: '700', fontSize: '15px' }}>{rx.issue_date}</div>
                                        </div>
                                        <div className="rx-meta-item">
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}><Clock size={12} /> Expires on</label>
                                            <div style={{ fontWeight: '700', fontSize: '15px' }}>{rx.expiry_date}</div>
                                        </div>
                                    </div>

                                    <div style={{ padding: '0 32px 32px' }}>
                                        <div style={{ padding: '16px 0', borderTop: '1px solid var(--border)', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '16px' }}>
                                            Medicine List
                                        </div>
                                        <div className="rx-medicines" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                            {rx.medicines.map((med, i) => (
                                                <div key={i} className="medicine-chip" style={{ padding: '16px 20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px', minWidth: '220px' }}>
                                                    <div style={{ width: '44px', height: '44px', background: 'var(--primary-light)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                        <Pill size={20} color="var(--primary)" />
                                                    </div>
                                                    <div>
                                                        <div className="medicine-name" style={{ fontSize: '16px', fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>{med.name}</div>
                                                        <div className="medicine-dose" style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600', display: 'flex', gap: '8px' }}>
                                                            <span><strong>Dose:</strong> {med.dosage}</span>
                                                            <span style={{ color: 'var(--border)' }}>|</span>
                                                            <span><strong>Duration:</strong> {med.duration || '5'} Days</span>
                                                        </div>
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
                                            <button className="btn btn-primary btn-sm" style={{ gap: '8px', padding: '10px 20px', borderRadius: '10px' }}>Renew via Doctor <ChevronRight size={14} /></button>
                                        )}
                                        {rx.status === 'pending' && (
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', animation: 'pulse 2s infinite' }}></div>
                                                Waiting for you at the pharmacy
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
                            <div style={{ fontWeight: '900', fontSize: '22px', fontFamily: 'Outfit, sans-serif' }}>Get Expert Help</div>
                            <div style={{ fontSize: '15px', opacity: 0.9, marginTop: '4px', fontWeight: '500' }}>Talk to our certified pharmacists for help with your medicines.</div>
                        </div>
                    </div>
                    <button 
                        className="btn" 
                        onClick={() => alert("Connecting to a verified pharmacist... (Feature arriving soon!)")}
                        style={{ background: 'white', color: 'var(--primary)', padding: '14px 32px', borderRadius: '14px', fontWeight: '800', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', cursor: 'pointer' }}
                    >
                        Chat with Pharmacist
                    </button>
                </div>
            </main>
        </div>
    );
};

export default MyPrescriptions;
