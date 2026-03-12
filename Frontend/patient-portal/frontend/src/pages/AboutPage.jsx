import React from 'react';
import { Link } from 'react-router-dom';
import {
    Target, Zap, Users, Code, Shield,
    MapPin, Heart, ArrowRight, UserCheck,
    Stethoscope, Store, ShieldCheck, Database,
    Github, Twitter, Mail
} from 'lucide-react';
import PublicNavbar from '../components/common/PublicNavbar';

const team = [
    { name: 'Aakash Modi', role: 'Frontend Architect', initials: 'AM', color: 'linear-gradient(135deg, #1978e5, #7c3aed)' },
    { name: 'Rajesh Kumar Mishra', role: 'Backend Lead', initials: 'RK', color: 'linear-gradient(135deg, #0891b2, #1978e5)' },
    { name: 'Vineet Kumar', role: 'Database Engineer', initials: 'VK', color: 'linear-gradient(135deg, #16a34a, #0891b2)' },
];

const AboutPage = ({ darkMode, setDarkMode }) => {
    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh', transition: 'var(--transition)' }}>
            <PublicNavbar darkMode={darkMode} setDarkMode={setDarkMode} />

            {/* Hero */}
            <section className="about-hero" style={{ padding: '120px 20px 80px', textAlign: 'center' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '6px 16px', background: 'var(--primary-light)',
                        color: 'var(--primary)', borderRadius: '100px',
                        fontSize: '13px', fontWeight: '800', marginBottom: '24px',
                        letterSpacing: '0.5px'
                    }}>
                        <ShieldCheck size={14} /> CLINICALLY INTEGRATED
                    </div>
                    <h1 style={{ fontSize: '56px', fontWeight: '900', fontFamily: 'Outfit, sans-serif', color: 'var(--text)', letterSpacing: '-1.5px', lineHeight: '1.1' }}>
                        Digitizing the <span style={{ color: 'var(--primary)' }}>Pulse</span> <br /> of Indian Healthcare
                    </h1>
                    <p style={{ fontSize: '20px', color: 'var(--text-muted)', maxWidth: '650px', margin: '24px auto 0', lineHeight: '1.6', fontWeight: '500' }}>
                        We are building a unified digital nervous system that connects 1.4 billion citizens to a secure and seamless health ecosystem.
                    </p>
                </div>
            </section>

            {/* Mission */}
            <div style={{ padding: '0 40px 100px', maxWidth: '1200px', margin: '0 auto' }}>
                <div className="mission-card" style={{
                    padding: '60px', borderRadius: '32px',
                    background: 'var(--card-bg)', border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-md)', display: 'flex', gap: '48px',
                    alignItems: 'center'
                }}>
                    <div style={{
                        width: '100px', height: '100px', background: 'var(--primary)',
                        borderRadius: '24px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', flexShrink: 0,
                        boxShadow: '0 12px 24px rgba(26, 115, 232, 0.2)'
                    }}>
                        <Target size={48} color="white" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '20px', fontFamily: 'Outfit, sans-serif', color: 'var(--text)' }}>
                            Our Objective: Precision & Accessibility
                        </h3>
                        <p style={{ fontSize: '17px', color: 'var(--text-muted)', lineHeight: '1.8', fontWeight: '500' }}>
                            HealthConnect eliminates technical barriers in clinical data flow. By integrating **Electronic Medical Records (EMR)**, **Digital Prescriptions (RX)**, and real-time **Pharmacy Logistics** into a single identifier (UHID), we empower patients with ownership of their health data and doctors with the insights needed for superior care.
                        </p>
                    </div>
                </div>
            </div>

            {/* Unified Flow - Interactive Cards */}
            <section style={{ background: 'var(--surface)', padding: '120px 40px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <h2 style={{ fontSize: '36px', fontWeight: '800', fontFamily: 'Outfit, sans-serif', color: 'var(--text)' }}>The Seamless Ecosystem</h2>
                    <p style={{ fontSize: '17px', color: 'var(--text-muted)', marginTop: '8px' }}>One platform. Three specialized portals. Total clinical synchronization.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', maxWidth: '1200px', margin: '0 auto' }}>
                    {[
                        { Icon: Heart, title: 'Patient Wallet', desc: 'Secure repository for medical history, lab reports, and digital scripts using a single UHID logon.', color: '#1a73e8', bg: 'rgba(26, 115, 232, 0.08)' },
                        { Icon: Stethoscope, title: 'Clinical Console', desc: 'Instant historical data retrieval via UHID. Secure prescribing with integrated dispensal logic.', color: '#7c3aed', bg: 'rgba(124, 58, 237, 0.08)' },
                        { Icon: Store, title: 'Pharmacy Node', desc: 'Verified dispensal of digital RX codes with zero-paperwork overhead and stock optimization.', color: '#0d904f', bg: 'rgba(13, 144, 79, 0.08)' },
                    ].map((p) => (
                        <div key={p.title} style={{
                            background: 'var(--card-bg)', padding: '48px',
                            borderRadius: '28px', border: '1px solid var(--border)',
                            boxShadow: 'var(--shadow-sm)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-8px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div style={{
                                width: '64px', height: '64px', background: p.bg,
                                color: p.color, borderRadius: '18px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '28px'
                            }}>
                                <p.Icon size={30} strokeWidth={2.5} />
                            </div>
                            <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '16px', fontFamily: 'Outfit, sans-serif', color: 'var(--text)' }}>{p.title}</h3>
                            <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.7', fontWeight: '500' }}>{p.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Team ATOM - Professional Grid */}
            <section style={{ padding: '120px 40px', background: 'var(--bg)' }}>
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <h2 style={{ fontSize: '36px', fontWeight: '800', fontFamily: 'Outfit, sans-serif', color: 'var(--text)' }}>The Engineering Team</h2>
                    <p style={{ fontSize: '17px', color: 'var(--text-muted)', marginTop: '8px' }}>Architecting the future of med-tech at Team ATOM.</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
                    {team.map((m) => (
                        <div key={m.name} style={{
                            background: 'var(--card-bg)', padding: '40px',
                            borderRadius: '28px', border: '1px solid var(--border)',
                            textAlign: 'center', width: '320px',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            <div style={{
                                background: m.color, width: '90px', height: '90px',
                                fontSize: '28px', fontWeight: '900', color: 'white',
                                margin: '0 auto 28px', borderRadius: '30px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                            }}>{m.initials}</div>
                            <div style={{ fontWeight: '800', fontSize: '22px', fontFamily: 'Outfit, sans-serif', color: 'var(--text)' }}>{m.name}</div>
                            <div style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '6px' }}>{m.role}</div>
                            <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
                                <div style={{ width: '40px', height: '40px', background: 'var(--surface)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                    <Github size={18} color="var(--text-muted)" />
                                </div>
                                <div style={{ width: '40px', height: '40px', background: 'var(--surface)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                    <Twitter size={18} color="var(--text-muted)" />
                                </div>
                                <div style={{ width: '40px', height: '40px', background: 'var(--surface)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                    <Mail size={18} color="var(--text-muted)" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer - Consistent with Landing */}
            <footer style={{ padding: '80px 40px 40px', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div className="logo-icon" style={{ borderRadius: '10px' }}>HC</div>
                            <span className="logo-text" style={{ fontSize: '22px', fontWeight: '900' }}>HealthConnect</span>
                        </div>
                        <div style={{ display: 'flex', gap: '32px' }}>
                            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}>Ecosystem Home</Link>
                            <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}>Patient Access</Link>
                        </div>
                    </div>
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600' }}>© 2024 Team ATOM Digital Solutions Pvt Ltd. System Architecture: V2.4.0-Stable</span>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <Shield size={18} color="var(--text-muted)" strokeWidth={2} />
                            <Database size={18} color="var(--text-muted)" strokeWidth={2} />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AboutPage;
