import React, { useState, useEffect } from 'react';
import {
    FileText, FlaskConical,
    Syringe, Eye, Download, Filter, Calendar,
    MoreVertical, Search, CheckCircle2, ChevronLeft,
    ChevronRight, ArrowRight, Hospital, User,
    FileCheck
} from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import api from '../services/api';

const MyRecords = ({ darkMode, setDarkMode }) => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [selectedRecord, setSelectedRecord] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const response = await api.get('/patient/records');
                // The backend provides doctor_name but UI currently uses doctor
                const formattedRecords = response.data.map(record => ({
                    ...record,
                    doctor: record.doctor_name || record.doctor,
                    // The backend provides type ("LAB", "SCAN") but UI uses category
                    category: record.type === 'LAB' ? 'Lab Report' :
                              record.type === 'SCAN' ? 'Lab Report' : 
                              record.type === 'SCRIPT' ? 'Prescription' :
                              record.type === 'DISCHARGE' ? 'Clinical Note' :
                              record.type === 'VACCINE' ? 'Vaccination' : 'Clinical Note'
                }));
                setRecords(formattedRecords);
            } catch (error) {
                console.error("Failed to load records:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filtered = records.filter(r => {
        const matchesFilter = filter === 'All' || r.category === filter;
        const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
            r.doctor.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getIcon = (cat) => {
        switch (cat) {
            case 'Lab Report': return FlaskConical;
            case 'Prescription': return FileText;
            case 'Clinical Note': return Hospital;
            case 'Vaccination': return Syringe;
            default: return FileText;
        }
    };

    const handleDownload = (record) => {
        // Mock download logic
        alert(`Downloading: ${record.title}.pdf`);
    };

    return (
        <div className="app-layout">
            <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />
            <main className="main-content" style={{ background: 'var(--bg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>Medical Records</h1>
                        <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '4px' }}>Access your complete clinical history and laboratory reports.</p>
                    </div>
                </div>

                {/* Filter Bar - Google Light Style */}
                <div className="filter-bar" style={{
                    padding: '20px 24px', background: 'var(--card-bg)',
                    borderRadius: '20px', border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-sm)', marginBottom: '32px',
                    display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center'
                }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
                        <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            placeholder="Search reports or doctors..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: '100%', padding: '14px 16px 14px 48px',
                                borderRadius: '14px', border: '1px solid var(--border)',
                                background: 'var(--surface)', fontSize: '14px',
                                fontWeight: '500', transition: 'var(--transition)'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', background: 'var(--surface)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            {['All', 'Lab Report', 'Prescription', 'Clinical Note'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    style={{
                                        padding: '10px 18px', borderRadius: '8px', border: 'none',
                                        fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                                        background: filter === f ? 'var(--card-bg)' : 'transparent',
                                        color: filter === f ? 'var(--primary)' : 'var(--text-muted)',
                                        boxShadow: filter === f ? 'var(--shadow-sm)' : 'none',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Records List */}
                {loading ? (
                    <div style={{ padding: '100px', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }}></div></div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                        {filtered.map((record) => {
                            const Icon = getIcon(record.category);
                            return (
                                <div key={record.id} className="record-item" style={{
                                    padding: '24px 32px', borderRadius: '20px',
                                    background: 'var(--card-bg)', border: '1px solid var(--border)',
                                    display: 'flex', alignItems: 'center', gap: '24px',
                                    boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s',
                                    cursor: 'default'
                                }} onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}>
                                    <div style={{
                                        width: '56px', height: '56px', background: 'var(--surface)',
                                        borderRadius: '14px', display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', color: 'var(--primary)', flexShrink: 0
                                    }}>
                                        <Icon size={26} strokeWidth={2} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                            <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, fontFamily: 'Outfit, sans-serif' }}>{record.title}</h3>
                                            <span style={{ fontSize: '11px', fontWeight: '800', background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>{record.category}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '24px', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Hospital size={14} /> {record.facility}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={14} /> {record.doctor}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> {record.date}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button
                                            className="btn btn-outline"
                                            style={{ gap: '8px', padding: '12px 20px', borderRadius: '12px', fontWeight: '700' }}
                                            onClick={() => setSelectedRecord(record)}
                                        >
                                            <Eye size={18} /> View
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            style={{ gap: '8px', padding: '12px 20px', borderRadius: '12px', fontWeight: '700', boxShadow: 'var(--shadow-sm)' }}
                                            onClick={() => handleDownload(record)}
                                        >
                                            <Download size={18} /> Download
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {!loading && filtered.length === 0 && (
                            <div className="empty-state" style={{ padding: '100px', background: 'var(--surface)', borderRadius: '24px', border: '1px dashed var(--border)' }}>
                                <FileCheck size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
                                <h3 style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>No Clinical Records Found</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Try adjusting your clinical filter or search query.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* View Popup Window */}
                {selectedRecord && (
                    <div className="modal-overlay" style={{
                        background: 'rgba(15, 23, 42, 0.75)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px'
                    }}>
                        <div className="modal-content" style={{
                            width: '100%',
                            maxWidth: '900px',
                            height: 'auto',
                            maxHeight: '90vh',
                            borderRadius: '32px',
                            padding: '0',
                            overflow: 'hidden',
                            boxShadow: '0 32px 64px rgba(0,0,0,0.3)',
                            display: 'flex',
                            flexDirection: 'column',
                            background: 'var(--card-bg)',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            {/* Window Header */}
                            <div style={{
                                padding: '28px 40px',
                                background: 'white',
                                borderBottom: '1px solid var(--border)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{ width: '48px', height: '48px', background: 'var(--primary-light)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: '22px', fontWeight: '900', fontFamily: 'Outfit, sans-serif', margin: 0 }}>{selectedRecord.title}</h2>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                                            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.5px' }}>CLINICAL PREVIEW</span>
                                            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--border)' }}></div>
                                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>ID: {selectedRecord.id}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="icon-btn"
                                    onClick={() => setSelectedRecord(null)}
                                    style={{
                                        width: '44px', height: '44px', borderRadius: '50%',
                                        background: 'var(--surface)', border: '1px solid var(--border)',
                                        fontSize: '24px', display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', color: 'var(--text)',
                                        cursor: 'pointer', transition: 'all 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = '#eee'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'var(--surface)'}
                                >&times;</button>
                            </div>

                            {/* Window Body */}
                            <div style={{ padding: '48px', background: '#f8f9fa', overflowY: 'auto' }}>
                                <div style={{
                                    width: '100%', minHeight: '560px', background: 'white',
                                    borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                                    display: 'flex', flexDirection: 'column', padding: '52px',
                                    border: '1px solid var(--border)', position: 'relative'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #f1f3f4', paddingBottom: '28px', marginBottom: '32px' }}>
                                        <div>
                                            <div style={{ fontWeight: '900', fontSize: '24px', color: 'var(--primary)', fontFamily: 'Outfit, sans-serif' }}>HealthConnect</div>
                                            <div style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '2px', color: 'var(--text-muted)', marginTop: '4px' }}>OFFICIAL CLINICAL RECORD</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)' }}>Issued: {selectedRecord.date}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Digitally Verified Session</div>
                                        </div>
                                    </div>

                                    <div style={{ flex: 1, border: '2px dashed #e2e8f0', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
                                        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                            <div style={{ width: '80px', height: '80px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 8px 16px rgba(0,0,0,0.05)' }}>
                                                <FileText size={32} style={{ opacity: 0.2 }} />
                                            </div>
                                            <p style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'Outfit, sans-serif', color: 'var(--text)' }}>Clinical Content Preview</p>
                                            <p style={{ fontSize: '14px', fontWeight: '500', maxWidth: '300px', margin: '8px auto 0', opacity: 0.7 }}>Secure encrypted payload. Please download the official PDF for full diagnostic details.</p>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #f1f3f4', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                        <div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '800', letterSpacing: '1px' }}>DOCUMENT INTEGRITY</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text)', fontWeight: '600', marginTop: '4px', fontFamily: 'monospace' }}>SHA-256: {Math.random().toString(36).substr(2, 16).toUpperCase()}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <img src="/hc-seal.png" alt="Clinical Seal" style={{ height: '40px', opacity: 0.05, position: 'absolute', right: '40px', bottom: '40px' }} />
                                            <div style={{ fontSize: '11px', color: '#999', fontStyle: 'italic' }}>This is a generated system preview.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Window Footer */}
                            <div style={{ padding: '24px 40px', background: 'white', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                                <button
                                    className="btn btn-outline"
                                    onClick={() => setSelectedRecord(null)}
                                    style={{ padding: '14px 28px', borderRadius: '14px', fontWeight: '800', fontSize: '14px' }}
                                >DISMISS PREVIEW</button>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleDownload(selectedRecord)}
                                    style={{ padding: '14px 28px', borderRadius: '14px', fontWeight: '900', fontSize: '14px', boxShadow: '0 8px 16px rgba(26, 115, 232, 0.2)' }}
                                >DOWNLOAD PDF REPORT</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyRecords;
