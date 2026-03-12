import React from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight, Shield, Activity, Database,
    Smartphone, UserPlus, LogIn, CheckCircle,
    Search, Lock, HeartPulse, Stethoscope, Store, FileText
} from 'lucide-react';
import PublicNavbar from '../components/common/PublicNavbar';
import heroImage from '../assets/hero-dashboard.png';

const LandingPage = ({ darkMode, setDarkMode }) => {
    return (
        <div className="landing-page" style={{ background: 'var(--bg)', transition: 'var(--transition)', overflowX: 'hidden' }}>
            <PublicNavbar darkMode={darkMode} setDarkMode={setDarkMode} />

            {/* Hero Section */}
            <header className="hero" style={{
                padding: '160px 24px 100px',
                background: 'var(--bg)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
            }}>
                <div style={{ maxWidth: '1200px', width: '100%', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '60px', alignItems: 'center', textAlign: 'left' }}>
                    <div>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            padding: '10px 20px', background: 'var(--primary-light)',
                            color: 'var(--primary)', borderRadius: '100px',
                            fontSize: '13px', fontWeight: '800', marginBottom: '32px',
                            letterSpacing: '1px', border: '1px solid var(--primary-light)',
                            textTransform: 'uppercase'
                        }}>
                            <HeartPulse size={16} strokeWidth={3} /> Next-Gen Patient Portal
                        </div>
                        <h1 style={{
                            fontSize: 'clamp(56px, 8vw, 84px)', fontWeight: '900', fontFamily: 'Outfit, sans-serif',
                            letterSpacing: '-3px', lineHeight: '0.95', color: 'var(--text)',
                            marginBottom: '28px'
                        }}>
                            Your Health, <br />
                            <span style={{ color: 'var(--primary)', display: 'block' }}>Connected.</span>
                        </h1>
                        <p style={{
                            fontSize: '20px', color: 'var(--text-muted)',
                            marginBottom: '48px', maxWidth: '540px',
                            lineHeight: '1.6', fontWeight: '500'
                        }}>
                            Experience a modern SaaS healthcare platform that unifies your medical records, prescriptions, and doctor visits in one secure, intuitive portal.
                        </p>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <Link to="/register" className="btn btn-primary" style={{
                                padding: '20px 48px', fontSize: '18px',
                                borderRadius: '18px', fontWeight: '800',
                                boxShadow: '0 12px 24px rgba(124, 58, 237, 0.25)',
                                background: 'var(--primary)', border: 'none',
                                color: 'white', display: 'flex', alignItems: 'center', gap: '12px'
                            }}>
                                Get Started Now <ArrowRight size={22} strokeWidth={2.5} />
                            </Link>
                            <Link to="/about" className="btn btn-outline" style={{
                                padding: '20px 40px', fontSize: '18px',
                                borderRadius: '18px', fontWeight: '700',
                                border: '2px solid var(--border)', background: 'transparent',
                                color: 'var(--text)'
                            }}>
                                View Demo
                            </Link>
                        </div>

                        <div style={{ marginTop: '48px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ display: 'flex', marginLeft: '4px' }}>
                                {[1, 2, 3].map(i => (
                                    <div key={i} style={{
                                        width: '36px', height: '36px', borderRadius: '50%',
                                        background: '#ddd', border: '3px solid var(--bg)',
                                        marginLeft: i === 1 ? 0 : '-12px',
                                        backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 10})`,
                                        backgroundSize: 'cover'
                                    }} />
                                ))}
                            </div>
                            <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600' }}>
                                Joined by 10k+ active patients
                            </span>
                        </div>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '120%', height: '120%',
                            background: 'radial-gradient(circle, var(--primary-light) 0%, transparent 70%)',
                            zIndex: -1, opacity: 0.5
                        }} />
                        <div style={{
                            background: 'white', borderRadius: '40px', padding: '12px',
                            boxShadow: '0 40px 80px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.05)',
                            overflow: 'hidden'
                        }}>
                            {/* Heartbeat Visualization Placeholder */}
                            <div style={{
                                height: 'auto', background: '#f8fafc', borderRadius: '32px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                position: 'relative', overflow: 'hidden'
                            }}>
                                <img
                                    src={heroImage}
                                    alt="HealthConnect Dashboard"
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        display: 'block',
                                        borderRadius: '24px',
                                        objectFit: 'cover'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Banner */}
                <div style={{
                    width: '100%',
                    background: 'var(--primary)',
                    padding: '60px 0',
                    marginTop: '120px',
                    position: 'relative'
                }}>
                    <div style={{
                        maxWidth: '1200px', margin: '0 auto',
                        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '24px'
                    }}>
                        {[
                            { label: 'ACTIVE PATIENTS', value: '10K+' },
                            { label: 'SPECIALIST DOCTORS', value: '500+' },
                            { label: 'PARTNER PHARMACIES', value: '200+' },
                            { label: 'EMERGENCY HOSPITALS', value: '50+' }
                        ].map(stat => (
                            <div key={stat.label} style={{ textAlign: 'center', color: 'white' }}>
                                <div style={{ fontSize: '48px', fontWeight: '900', fontFamily: 'Outfit, sans-serif', letterSpacing: '-1px' }}>{stat.value}</div>
                                <div style={{ fontSize: '13px', fontWeight: '800', letterSpacing: '2px', opacity: 0.8, marginTop: '4px' }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section id="features" style={{ padding: '120px 24px', background: 'var(--bg)' }}>
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <h2 style={{ fontSize: '42px', fontWeight: '900', fontFamily: 'Outfit, sans-serif', color: 'var(--text)' }}>Powerful Features for Your Health</h2>
                    <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginTop: '12px', maxWidth: '600px', margin: '12px auto 0' }}>Empowering patients with modern tools to manage their medical journeys seamlessly and securely.</p>
                </div>

                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
                    {[
                        { Icon: Smartphone, title: 'Unified Health ID (UHID)', desc: 'A unique digital identification system for your entire medical life.' },
                        { Icon: FileText, title: 'Digital Prescriptions', desc: 'Instant access to your doctor\'s orders directly on your mobile device.' },
                        { Icon: Database, title: 'Medical Records', desc: 'Secure storage for all lab results, scans, and historical health data.' },
                        { Icon: Activity, title: 'Track Visits', desc: 'Maintain a chronological history of all consultations and follow-up appointments.' },
                        { Icon: Store, title: 'Pharmacy Status', desc: 'Real-time check on medication availability at your nearest partner pharmacy.' },
                        { Icon: Shield, title: 'Secure & Private', desc: 'Bank-grade encryption ensures your health data remains exclusively yours.' },
                    ].map((f, i) => (
                        <div key={i} className="feature-card" style={{
                            padding: '48px', borderRadius: '32px',
                            background: darkMode ? 'rgba(255,255,255,0.03)' : 'var(--surface)',
                            border: '1px solid var(--border)',
                            transition: 'var(--transition)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <div style={{
                                width: '56px', height: '56px', background: 'var(--primary)',
                                color: 'white', borderRadius: '16px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '28px',
                                boxShadow: '0 8px 16px rgba(124, 58, 237, 0.2)'
                            }}>
                                <f.Icon size={28} strokeWidth={2.5} />
                            </div>
                            <h3 style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'Outfit, sans-serif', marginBottom: '16px', color: 'var(--text)' }}>{f.title}</h3>
                            <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: '1.6', fontWeight: '500' }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it Works Section */}
            <section style={{ padding: '120px 24px', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
                <div style={{ textAlign: 'center', marginBottom: '100px' }}>
                    <h2 style={{ fontSize: '42px', fontWeight: '900', fontFamily: 'Outfit, sans-serif', color: 'var(--text)' }}>Your Journey to Smarter Health</h2>
                    <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginTop: '12px' }}>Setting up your profile takes less than 2 minutes.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '60px', maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
                    {/* Connecting line (Desktop only) */}
                    <div style={{
                        position: 'absolute', top: '100px', left: '15%', right: '15%',
                        height: '2px', background: 'var(--border)',
                        borderStyle: 'dashed', opacity: 0.5, zIndex: 0
                    }} />

                    {[
                        { Icon: UserPlus, title: 'Register & Get UHID', desc: 'Create your account and receive your unique digital identity in seconds.' },
                        { Icon: Stethoscope, title: 'Visit Your Doctor', desc: 'Show your UHID at any participating provider for instant history access.' },
                        { Icon: CheckCircle, title: 'Track Everything', desc: 'Monitor visits, prescriptions, and lab records from your personal dashboard.' }
                    ].map((step, i) => (
                        <div key={i} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                            <div style={{
                                width: '100px', height: '100px', background: 'var(--card-bg)',
                                borderRadius: '32px', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', margin: '0 auto 32px',
                                border: '1px solid var(--border)',
                                boxShadow: darkMode ? '0 20px 40px rgba(0,0,0,0.3)' : '0 20px 40px rgba(0,0,0,0.06)'
                            }}>
                                <step.Icon size={40} color="var(--primary)" strokeWidth={2.5} />
                                <div style={{
                                    position: 'absolute', top: '-10px', right: 'calc(50% - 65px)',
                                    width: '36px', height: '36px', background: 'var(--primary)',
                                    color: 'white', borderRadius: '50%', fontSize: '16px',
                                    fontWeight: '900', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', border: '4px solid var(--surface)'
                                }}>{i + 1}</div>
                            </div>
                            <h3 style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'Outfit, sans-serif', color: 'var(--text)' }}>{step.title}</h3>
                            <p style={{ fontSize: '16px', color: 'var(--text-muted)', marginTop: '16px', lineHeight: '1.7', fontWeight: '500' }}>{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section style={{ padding: '120px 24px', background: 'var(--bg)' }}>
                <div style={{
                    maxWidth: '1100px', margin: '0 auto',
                    borderRadius: '40px', padding: '100px 40px',
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--violet-dark) 100%)',
                    boxShadow: '0 30px 60px rgba(124, 58, 237, 0.3)',
                    textAlign: 'center', color: 'white',
                    position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', transform: 'translate(100px, -100px)' }} />

                    <h2 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: '900', fontFamily: 'Outfit, sans-serif', marginBottom: '24px', lineHeight: '1.1' }}>
                        Ready to take control of <br /> your healthcare?
                    </h2>
                    <p style={{ fontSize: '20px', opacity: 0.9, marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px', fontWeight: '500' }}>
                        Join thousands of patients who have simplified their medical journey with HealthConnect.
                    </p>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                        <Link to="/register" className="btn" style={{
                            background: 'white', color: 'var(--primary)', padding: '20px 48px',
                            borderRadius: '18px', fontWeight: '800', fontSize: '18px', border: 'none',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                        }}>Get Started for Free</Link>
                        <button className="btn" style={{
                            background: 'rgba(255,255,255,0.1)', color: 'white', padding: '20px 40px',
                            borderRadius: '18px', fontWeight: '800', fontSize: '18px', border: '1px solid rgba(255,255,255,0.2)'
                        }}>Contact Sales</button>
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <footer style={{ padding: '100px 24px 40px', background: darkMode ? '#070b14' : '#f8fafc', borderTop: '1px solid var(--border)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 0.8fr 0.8fr 1.2fr', gap: '80px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                            <div style={{ width: '44px', height: '44px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '18px' }}>HC</div>
                            <span style={{ fontSize: '24px', fontWeight: '900', fontFamily: 'Outfit, sans-serif', color: 'var(--text)' }}>HealthConnect</span>
                        </div>
                        <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.8', maxWidth: '320px', fontWeight: '500' }}>
                            Leading the transformation of healthcare data management through innovation and security.
                        </p>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text)', marginBottom: '28px', letterSpacing: '1px', textTransform: 'uppercase' }}>PLATFORM</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {['Patient Health ID', 'Provider Portal', 'Pharmacy Integration', 'Mobile App'].map(item => (
                                <li key={item}><a href="#" style={{ color: 'var(--text-muted)', fontSize: '15px', fontWeight: '500', transition: '0.2s' }}>{item}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text)', marginBottom: '28px', letterSpacing: '1px', textTransform: 'uppercase' }}>RESOURCES</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {['Privacy Policy', 'Terms of Service', 'Security Standards', 'API Documentation'].map(item => (
                                <li key={item}><a href="#" style={{ color: 'var(--text-muted)', fontSize: '15px', fontWeight: '500' }}>{item}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text)', marginBottom: '28px', letterSpacing: '1px', textTransform: 'uppercase' }}>NEWSLETTER</h4>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                            <input type="email" placeholder="Email address" style={{ flex: 1, padding: '14px 20px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--text)', fontSize: '14px' }} />
                            <button style={{ width: '50px', height: '50px', background: 'var(--primary)', borderRadius: '12px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: '1200px', margin: '80px auto 0', paddingTop: '32px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500' }}>© 2024 HealthConnect Inc. All rights reserved.</span>
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <Activity size={20} color="var(--text-muted)" style={{ opacity: 0.5 }} />
                        <Shield size={20} color="var(--text-muted)" style={{ opacity: 0.5 }} />
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
