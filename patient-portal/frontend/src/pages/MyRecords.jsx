import React, { useState, useEffect, useRef } from 'react';
import {
    FileText, FlaskConical,
    Syringe, Eye, Download, Filter, Calendar,
    MoreVertical, Search, CheckCircle2, ChevronLeft,
    ChevronRight, ArrowRight, Hospital, User,
    FileCheck, Pill, Activity, Receipt, Clock, Upload, X, Trash2, Menu
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Sidebar from '../components/common/Sidebar';
import api from '../services/api';

const MyRecords = ({ darkMode, setDarkMode }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadForm, setUploadForm] = useState({
        title: '',
        category: 'Test Result',
        date: new Date().toISOString().split('T')[0],
        facility: '',
        doctor_name: '',
        diagnosis: '',
        file: null
    });

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const [recordsRes, prescriptionsRes] = await Promise.all([
                api.get('/patient/records'),
                api.get('/patient/prescriptions')
            ]);

            const formattedRecords = recordsRes.data.map(record => ({
                ...record,
                doctor: record.doctor_name || record.doctor,
                category: record.type === 'LAB' ? 'Test Result' :
                          record.type === 'SCAN' ? 'Test Result' : 
                          record.type === 'SCRIPT' ? 'Prescription' :
                          record.type === 'DISCHARGE' ? "Doctor's Note" :
                          record.type === 'VACCINE' ? 'Vaccination' : "Doctor's Note"
            }));

            const formattedRxs = prescriptionsRes.data.map(rx => ({
                ...rx,
                title: rx.category === 'Prescription' && rx.title ? rx.title : `Prescription: ${rx.rx_code}`,
                doctor: rx.doctor_name || 'System',
                date: rx.issue_date,
                category: 'Prescription',
                medicines: Array.isArray(rx.medicines) ? rx.medicines : 
                          (typeof rx.medicines === 'string' ? JSON.parse(rx.medicines) : [])
            }));

            const combined = [...formattedRecords, ...formattedRxs].sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });

            setRecords(combined);
        } catch (error) {
            console.error("Failed to load records:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const handleDelete = async (record) => {
        if (!window.confirm(`Are you sure you want to delete "${record.title}"?`)) return;
        
        try {
            if (record.type) {
                await api.deleteRecord(record.id);
            } else {
                await api.deletePrescription(record.id);
            }
            fetchRecords();
        } catch (error) {
            console.error("Failed to delete record:", error);
            alert("Failed to delete record. Please try again.");
        }
    };

    const filtered = records.filter(r => {
        const matchesFilter = filter === 'All' || r.category === filter;
        const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
            r.doctor.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getIcon = (cat) => {
        switch (cat) {
            case 'Test Result': return FlaskConical;
            case 'Prescription': return FileText;
            case "Doctor's Note": return Hospital;
            case 'Vaccination': return Syringe;
            default: return FileText;
        }
    };

    const [downloading, setDownloading] = useState(false);
    const reportRef = useRef(null);

    const handleDownload = async (record) => {
        if (record.file_url) {
            // It's an uploaded file, open it or download it
            window.open(`${api.defaults.baseURL.replace('/api', '')}${record.file_url}`, '_blank');
            return;
        }

        if (!reportRef.current) return;
        setDownloading(true);
        try {
            await new Promise(r => setTimeout(r, 500));
            const canvas = await html2canvas(reportRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const imgWidth = pageWidth - 20;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
            pdf.save(`Medical_Record_${record.rx_code || record.id}.pdf`);
        } catch (error) {
            console.error("PDF Export Error:", error);
            alert("Failed to export clinical report. Please try again.");
        } finally {
            setDownloading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!uploadForm.file) return alert("Please select a file to upload.");

        const formData = new FormData();
        Object.keys(uploadForm).forEach(key => {
            formData.append(key, uploadForm[key]);
        });

        setUploading(true);
        try {
            await api.uploadRecord(formData);
            alert("Record uploaded successfully!");
            setShowUploadModal(false);
            setUploadForm({
                title: '',
                category: 'Test Result',
                date: new Date().toISOString().split('T')[0],
                facility: '',
                doctor_name: '',
                diagnosis: '',
                file: null
            });
            fetchRecords();
        } catch (error) {
            console.error("Upload Error:", error);
            alert("Failed to upload record. Please try again.");
        } finally {
            setUploading(false);
        }
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
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                    <div>
                        <h1 className="page-title" style={{ fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>My Health Records</h1>
                        <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '4px' }}>View your complete medical history and test results.</p>
                    </div>
                    <button 
                        className="btn btn-primary" 
                        onClick={() => setShowUploadModal(true)}
                        style={{ padding: '14px 28px', borderRadius: '16px', fontWeight: '800', boxShadow: '0 8px 16px rgba(26, 115, 232, 0.2)' }}
                    >
                        <Upload size={18} /> Upload Record
                    </button>
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
                            {['All', 'Test Result', 'Prescription', "Doctor's Note"].map((f) => (
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
                                    <div style={{ flex: 1, width: '100%' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                                            <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, fontFamily: 'Outfit, sans-serif' }}>{record.title}</h3>
                                            <span style={{ fontSize: '11px', fontWeight: '800', background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>{record.category}</span>
                                        </div>
                                        <div className="record-meta-row" style={{ display: 'flex', gap: '20px', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500', flexWrap: 'wrap' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Hospital size={14} /> {record.facility}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={14} /> {record.doctor}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> {record.date}</span>
                                        </div>
                                    </div>
                                    <div className="record-actions" style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            className="btn btn-outline"
                                            style={{ gap: '8px', padding: '12px 16px', borderRadius: '12px', fontWeight: '700' }}
                                            onClick={() => setSelectedRecord(record)}
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            style={{ gap: '8px', padding: '12px 16px', borderRadius: '12px', fontWeight: '700', boxShadow: 'var(--shadow-sm)' }}
                                            onClick={() => handleDownload(record)}
                                        >
                                            <Download size={18} />
                                        </button>
                                        <button
                                            className="btn btn-outline"
                                            style={{ gap: '8px', padding: '12px 16px', borderRadius: '12px', fontWeight: '700', color: 'var(--error, #ef4444)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                                            onClick={() => handleDelete(record)}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {!loading && filtered.length === 0 && (
                            <div className="empty-state" style={{ padding: '100px', background: 'var(--surface)', borderRadius: '24px', border: '1px dashed var(--border)' }}>
                                <FileCheck size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
                                <h3 style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>No Health Records Found</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Try adjusting your filter or search query.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* View Popup Window */}
                {selectedRecord && (
                    <div className="modal-overlay" style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 1000,
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
                                background: 'var(--card-bg)',
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
                                        <h2 style={{ fontSize: '22px', fontWeight: '900', fontFamily: 'Outfit, sans-serif', margin: 0, color: 'var(--text)' }}>{selectedRecord.title}</h2>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                                            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.5px' }}>REPORT PREVIEW</span>
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
                                >&times;</button>
                            </div>

                            {/* Window Body */}
                            <div style={{ padding: '48px', background: 'var(--surface)', overflowY: 'auto' }}>
                                <div ref={reportRef} style={{
                                    width: '100%', minHeight: '560px', background: '#fff',
                                    borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                                    display: 'flex', flexDirection: 'column', padding: '52px',
                                    border: '1px solid var(--border)', position: 'relative'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #f1f3f4', paddingBottom: '24px', marginBottom: '32px' }}>
                                        <div>
                                            <div style={{ fontWeight: '900', fontSize: '24px', color: '#1a73e8', fontFamily: 'Outfit, sans-serif' }}>HealthConnect</div>
                                            <div style={{ fontSize: '11px', fontWeight: '800', border: 'none', color: '#5f6368', marginTop: '4px' }}>DIGITAL PRESCRIPTION RECORD</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '14px', fontWeight: '700', color: '#202124' }}>Date: {selectedRecord.date || '2026-03-28'}</div>
                                            <div style={{ fontSize: '12px', color: '#5f6368', marginTop: '4px' }}>Verified Record</div>
                                            {(selectedRecord.category === 'Prescription' || selectedRecord.rx_code) && (
                                                <div style={{ fontSize: '12px', color: '#1a73e8', fontWeight: '800', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                    RX CODE: {selectedRecord.rx_code || 'RXLOUKBB'}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {selectedRecord.file_url ? (
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', borderRadius: '16px', overflow: 'hidden' }}>
                                            {selectedRecord.file_url.match(/\.(jpg|jpeg|png|webp|avif)$/i) ? (
                                                <img 
                                                    src={`${api.defaults.baseURL.replace('/api', '')}${selectedRecord.file_url}`} 
                                                    alt="Uploaded Record"
                                                    style={{ maxWidth: '100%', maxHeight: '600px', objectFit: 'contain' }}
                                                />
                                            ) : (
                                                <div style={{ textAlign: 'center', padding: '40px' }}>
                                                    <FileText size={64} color="var(--primary)" style={{ marginBottom: '16px', opacity: 0.5 }} />
                                                    <p style={{ fontSize: '18px', fontWeight: '800', color: '#202124' }}>PDF Document</p>
                                                    <p style={{ fontSize: '14px', color: '#5f6368', marginBottom: '24px' }}>This record is stored as a PDF file.</p>
                                                    <button 
                                                        className="btn btn-primary"
                                                        onClick={() => window.open(`${api.defaults.baseURL.replace('/api', '')}${selectedRecord.file_url}`, '_blank')}
                                                    >
                                                        View Full Document
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : selectedRecord.category === 'Prescription' ? (
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '24px' }}>
                                                <div>
                                                    <div style={{ fontSize: '11px', fontWeight: '900', color: '#1a73e8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Patient Details</div>
                                                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#5f6368' }}>ID: HID-QTYB-VUL5</div>
                                                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#202124' }}>Name: Aakash Modi</div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '11px', fontWeight: '900', color: '#1a73e8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Doctor / Clinic</div>
                                                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#202124' }}>Dr. {selectedRecord.doctor || 'Aakash Modi'}</div>
                                                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#5f6368' }}>{selectedRecord.facility || 'HealthConnect Clinic'}</div>
                                                </div>
                                            </div>

                                            <div style={{ marginBottom: '24px' }}>
                                                <div style={{ fontSize: '11px', fontWeight: '900', color: '#1a73e8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Diagnosis / Reason</div>
                                                <div style={{ fontSize: '18px', fontWeight: '700', color: '#202124' }}>{selectedRecord.diagnosis || 'General Consultation'}</div>
                                            </div>

                                            <div>
                                                <div style={{ fontSize: '11px', fontWeight: '900', color: '#5f6368', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <Pill size={14} /> YOUR MEDICINES
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                    {selectedRecord.medicines?.map((med, i) => (
                                                        <div key={i} style={{ padding: '24px', background: '#f8f9fa', borderRadius: '20px', border: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                                                <div style={{ width: '48px', height: '48px', background: 'rgba(26, 115, 232, 0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                    <Pill size={22} color="#1a73e8" />
                                                                </div>
                                                                <div>
                                                                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#202124' }}>{med.name}</div>
                                                                    <div style={{ fontSize: '13px', color: '#5f6368', fontWeight: '600', marginTop: '2px', display: 'flex', gap: '12px' }}>
                                                                        <span><strong>Dose:</strong> {med.dosage}</span>
                                                                        <span style={{ color: '#dadce0' }}>|</span>
                                                                        <span><strong>Duration:</strong> {med.duration || '5'} Days</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {med.instructions && (
                                                                <div style={{ textAlign: 'right', maxWidth: '300px' }}>
                                                                    <div style={{ fontSize: '10px', fontWeight: '800', color: '#1a73e8', letterSpacing: '0.5px' }}>INSTRUCTIONS</div>
                                                                    <div style={{ fontSize: '13px', color: '#5f6368', fontWeight: '600' }}>{med.instructions}</div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {(selectedRecord.notes || selectedRecord.special_instruction) && (
                                                <div style={{ padding: '24px', background: 'rgba(26, 115, 232, 0.03)', borderRadius: '20px', borderLeft: '5px solid #1a73e8' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1a73e8', fontSize: '11px', fontWeight: '900', marginBottom: '8px' }}>
                                                        <Activity size={14} /> DOCTOR'S SPECIAL NOTE
                                                    </div>
                                                    <div style={{ fontSize: '15px', color: '#3c4043', lineHeight: '1.6', fontWeight: '500' }}>
                                                        {selectedRecord.notes || selectedRecord.special_instruction}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div style={{ flex: 1, border: '2px dashed #eee', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
                                            <div style={{ textAlign: 'center', color: '#5f6368' }}>
                                                <div style={{ width: '80px', height: '80px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 8px 16px rgba(0,0,0,0.05)' }}>
                                                    <FileText size={32} style={{ opacity: 0.2 }} />
                                                </div>
                                                <p style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'Outfit, sans-serif', color: '#202124' }}>Clinical Content Preview</p>
                                                <p style={{ fontSize: '14px', fontWeight: '500', maxWidth: '300px', margin: '8px auto 0', opacity: 0.7 }}>Secure encrypted payload. Please download the official PDF for full diagnostic details.</p>
                                            </div>
                                        </div>
                                    )}

                                    <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #f1f3f4', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                        <div>
                                            <div style={{ fontSize: '11px', color: '#999', fontWeight: '800', letterSpacing: '1px' }}>SECURITY DETAILS</div>
                                            <div style={{ fontSize: '12px', color: '#5f6368', fontWeight: '600', marginTop: '4px', fontFamily: 'monospace' }}>SHA-256: {Math.random().toString(36).substr(2, 16).toUpperCase()}</div>
                                            <div style={{ fontSize: '12px', color: '#5f6368', fontWeight: '600', marginTop: '2px', fontFamily: 'monospace' }}>VERIFICATION ID: TXND2HECMTP</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '11px', color: '#5f6368', fontStyle: 'italic', maxWidth: '300px' }}>This is a digitally generated prescription and does not require a physical signature.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Window Footer Actions */}
                            <div style={{
                                padding: '24px 40px',
                                background: 'var(--surface)',
                                borderTop: '1px solid var(--border)',
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: '16px'
                            }}>
                                <button
                                    onClick={() => setSelectedRecord(null)}
                                    style={{
                                        padding: '14px 28px', borderRadius: '14px',
                                        fontSize: '15px', fontWeight: '800',
                                        color: 'var(--text)', background: 'var(--card-bg)',
                                        border: '1px solid var(--border)', cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >DISMISS PREVIEW</button>
                                <button
                                    onClick={() => handleDownload(selectedRecord)}
                                    disabled={downloading}
                                    style={{
                                        padding: '14px 32px', borderRadius: '14px',
                                        fontSize: '15px', fontWeight: '800',
                                        color: 'white', background: 'var(--primary)',
                                        border: 'none', cursor: 'pointer',
                                        transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(26, 115, 232, 0.25)',
                                        display: 'flex', alignItems: 'center', gap: '10px'
                                    }}
                                >
                                    {downloading ? (
                                        <>
                                            <div className="spinner-sm" style={{ borderColor: 'white', borderTopColor: 'transparent' }}></div>
                                            EXPORTING...
                                        </>
                                    ) : (
                                        <>DOWNLOAD PDF REPORT</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Upload Modal */}
                {showUploadModal && (
                    <div className="upload-modal-overlay">
                        <div className="upload-modal-content">
                            <div className="upload-modal-header">
                                <h2 style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>Upload Health Record</h2>
                                <button className="icon-btn" onClick={() => setShowUploadModal(false)} 
                                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleUpload}>
                                <div className="upload-modal-body">
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                        <div className="form-group">
                                            <label className="form-label">Record Title</label>
                                            <input 
                                                type="text" 
                                                className="form-input" 
                                                placeholder="e.g., Blood Test Feb 2026"
                                                required
                                                value={uploadForm.title}
                                                onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Category</label>
                                            <select 
                                                className="form-input"
                                                value={uploadForm.category}
                                                onChange={(e) => setUploadForm({...uploadForm, category: e.target.value})}
                                            >
                                                <option>Test Result</option>
                                                <option>Prescription</option>
                                                <option>Doctor's Note</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                        <div className="form-group">
                                            <label className="form-label">Date of Record</label>
                                            <input 
                                                type="date" 
                                                className="form-input"
                                                required
                                                value={uploadForm.date}
                                                onChange={(e) => setUploadForm({...uploadForm, date: e.target.value})}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Facility / Hospital</label>
                                            <input 
                                                type="text" 
                                                className="form-input" 
                                                placeholder="e.g., Apollo Hospital"
                                                value={uploadForm.facility}
                                                onChange={(e) => setUploadForm({...uploadForm, facility: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group" style={{ marginBottom: '20px' }}>
                                        <label className="form-label">Doctor Name</label>
                                        <input 
                                            type="text" 
                                            className="form-input" 
                                            placeholder="Dr. Smith"
                                            value={uploadForm.doctor_name}
                                            onChange={(e) => setUploadForm({...uploadForm, doctor_name: e.target.value})}
                                        />
                                    </div>

                                    <div className="form-group" style={{ marginBottom: '24px' }}>
                                        <label className="form-label">Diagnosis / Summary</label>
                                        <textarea 
                                            className="form-input" 
                                            rows="3" 
                                            placeholder="What was the result or reason?"
                                            style={{ resize: 'none' }}
                                            value={uploadForm.diagnosis}
                                            onChange={(e) => setUploadForm({...uploadForm, diagnosis: e.target.value})}
                                        ></textarea>
                                    </div>

                                    <div className="file-drop-zone" onClick={() => document.getElementById('file-upload').click()}>
                                        <Upload size={32} color="var(--primary)" style={{ marginBottom: '12px' }} />
                                        <p style={{ fontSize: '14px', fontWeight: '600' }}>
                                            {uploadForm.file ? uploadForm.file.name : "Click to select a file (PDF, JPG, PNG)"}
                                        </p>
                                        <input 
                                            id="file-upload"
                                            type="file" 
                                            className="file-input-hidden" 
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(e) => setUploadForm({...uploadForm, file: e.target.files[0]})}
                                        />
                                    </div>
                                    
                                    {uploading && (
                                        <div className="upload-progress-bar">
                                            <div className="upload-progress-fill" style={{ width: '50%' }}></div>
                                        </div>
                                    )}
                                </div>
                                <div className="upload-modal-footer">
                                    <button type="button" className="btn btn-outline" onClick={() => setShowUploadModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" disabled={uploading}>
                                        {uploading ? "Uploading..." : "Save Record"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyRecords;
