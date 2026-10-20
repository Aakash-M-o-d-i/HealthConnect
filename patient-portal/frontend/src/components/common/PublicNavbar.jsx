import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, Shield, ExternalLink, Menu, X, Stethoscope, Pill, ChevronDown, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const PublicNavbar = ({ darkMode, setDarkMode }) => {
    const { user } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    return (
        <header style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            background: darkMode ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.85)',
            borderBottom: '1px solid ' + (darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'),
            transition: 'background-color 0.3s ease, border-color 0.3s ease'
        }}>
            <div style={{
                maxWidth: '1320px',
                margin: '0 auto',
                padding: '0 24px',
                height: '72px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '20px'
            }}>
                {/* Brand Logo & National Status Indicator */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '11px',
                        background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        boxShadow: '0 8px 18px rgba(37, 99, 235, 0.25)',
                        position: 'relative',
                        flexShrink: 0
                    }}>
                        <Shield size={22} strokeWidth={2.4} />
                        <span style={{
                            position: 'absolute',
                            bottom: '-1px',
                            right: '-1px',
                            width: '9px',
                            height: '9px',
                            borderRadius: '50%',
                            background: '#10b981',
                            border: '2px solid ' + (darkMode ? '#0f172a' : '#ffffff')
                        }} />
                    </div>

                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                                fontSize: '19px',
                                fontWeight: '800',
                                color: 'var(--text)',
                                letterSpacing: '-0.4px',
                                fontFamily: 'Outfit, sans-serif'
                            }}>
                                HealthConnect
                            </span>
                            <span style={{
                                fontSize: '10px',
                                fontWeight: '800',
                                padding: '2px 7px',
                                borderRadius: '100px',
                                background: darkMode ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5',
                                color: '#10b981',
                                border: '1px solid ' + (darkMode ? 'rgba(16, 185, 129, 0.25)' : '#a7f3d0'),
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                ABDM Node
                            </span>
                        </div>
                        <span style={{
                            fontSize: '11px',
                            color: 'var(--text-muted)',
                            fontWeight: '600',
                            letterSpacing: '0.1px',
                            display: 'block'
                        }}>
                            National Digital Health Grid
                        </span>
                    </div>
                </Link>

                {/* Center Navigation Links (Clean & Scannable) */}
                <nav className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
                    <a href="#hero-sandbox" style={{
                        color: 'var(--text)',
                        fontWeight: '600',
                        fontSize: '14px',
                        textDecoration: 'none',
                        opacity: 0.85,
                        transition: 'opacity 0.2s'
                    }}>
                        Live Sandbox
                    </a>
                    <a href="#features" style={{
                        color: 'var(--text)',
                        fontWeight: '600',
                        fontSize: '14px',
                        textDecoration: 'none',
                        opacity: 0.85,
                        transition: 'opacity 0.2s'
                    }}>
                        Architecture
                    </a>
                    <a href="#how-it-works" style={{
                        color: 'var(--text)',
                        fontWeight: '600',
                        fontSize: '14px',
                        textDecoration: 'none',
                        opacity: 0.85,
                        transition: 'opacity 0.2s'
                    }}>
                        Clinical Pipeline
                    </a>
                    <Link to="/about" style={{
                        color: 'var(--text)',
                        fontWeight: '600',
                        fontSize: '14px',
                        textDecoration: 'none',
                        opacity: 0.85,
                        transition: 'opacity 0.2s'
                    }}>
                        Standards
                    </Link>
                </nav>

                {/* Right Side: Ecosystem Switcher + Theme Toggle + Auth */}
                <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {/* Compact Ecosystem Portal Pill */}
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '7px 12px',
                                borderRadius: '10px',
                                border: '1px solid ' + (darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'),
                                background: darkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
                                color: 'var(--text)',
                                fontSize: '12px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6' }} />
                            Switch Portal
                            <ChevronDown size={14} style={{ opacity: 0.6 }} />
                        </button>

                        {portalDropdownOpen && (
                            <div style={{
                                position: 'absolute',
                                top: 'calc(100% + 8px)',
                                right: 0,
                                width: '240px',
                                background: darkMode ? '#1e293b' : '#ffffff',
                                borderRadius: '14px',
                                border: '1px solid ' + (darkMode ? '#334155' : '#e2e8f0'),
                                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                                padding: '8px',
                                zIndex: 1100,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px'
                            }}>
                                <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', padding: '6px 10px', letterSpacing: '0.5px' }}>
                                    Cross-Portal Ecosystem
                                </div>
                                <a
                                    href="http://localhost:3001"
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '9px 12px',
                                        borderRadius: '8px',
                                        textDecoration: 'none',
                                        color: 'var(--text)',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        background: 'transparent',
                                        transition: 'background-color 0.15s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkMode ? '#334155' : '#f1f5f9'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Stethoscope size={16} color="#2563eb" />
                                        <span>Doctor Suite</span>
                                    </div>
                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>:3001 ↗</span>
                                </a>

                                <a
                                    href="http://localhost:3002"
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '9px 12px',
                                        borderRadius: '8px',
                                        textDecoration: 'none',
                                        color: 'var(--text)',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        background: 'transparent',
                                        transition: 'background-color 0.15s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkMode ? '#334155' : '#f1f5f9'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Pill size={16} color="#059669" />
                                        <span>Pharmacy Terminal</span>
                                    </div>
                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>:3002 ↗</span>
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={() => setDarkMode && setDarkMode(!darkMode)}
                        style={{
                            background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                            border: '1px solid ' + (darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'),
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            transition: 'all 0.2s'
                        }}
                        aria-label="Toggle theme"
                    >
                        {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                    </button>

                    {/* Auth CTA Buttons */}
                    {user ? (
                        <Link
                            to="/dashboard"
                            style={{
                                padding: '9px 18px',
                                fontSize: '13px',
                                fontWeight: '700',
                                borderRadius: '10px',
                                background: 'var(--primary)',
                                color: 'white',
                                textDecoration: 'none',
                                boxShadow: '0 4px 14px rgba(26, 115, 232, 0.25)'
                            }}
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Link
                                to="/login"
                                style={{
                                    padding: '8px 16px',
                                    fontSize: '13px',
                                    fontWeight: '700',
                                    borderRadius: '10px',
                                    color: 'var(--text)',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s'
                                }}
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                style={{
                                    padding: '8px 18px',
                                    fontSize: '13px',
                                    fontWeight: '700',
                                    borderRadius: '10px',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    textDecoration: 'none',
                                    boxShadow: '0 4px 14px rgba(26, 115, 232, 0.25)',
                                    transition: 'transform 0.15s, box-shadow 0.15s'
                                }}
                            >
                                Register ABHA
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="show-mobile-flex"
                    onClick={toggleMobileMenu}
                    style={{
                        display: 'none',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text)',
                        cursor: 'pointer',
                        padding: '6px'
                    }}
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Mobile Drawer Menu */}
            {mobileMenuOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    top: '72px',
                    background: darkMode ? 'rgba(15, 23, 42, 0.98)' : 'rgba(255, 255, 255, 0.98)',
                    zIndex: 999,
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                }}>
                    <a href="#hero-sandbox" onClick={toggleMobileMenu} style={{ color: 'var(--text)', fontSize: '16px', fontWeight: '700', textDecoration: 'none' }}>Live Sandbox</a>
                    <a href="#features" onClick={toggleMobileMenu} style={{ color: 'var(--text)', fontSize: '16px', fontWeight: '700', textDecoration: 'none' }}>Architecture</a>
                    <a href="#how-it-works" onClick={toggleMobileMenu} style={{ color: 'var(--text)', fontSize: '16px', fontWeight: '700', textDecoration: 'none' }}>Clinical Pipeline</a>
                    <Link to="/about" onClick={toggleMobileMenu} style={{ color: 'var(--text)', fontSize: '16px', fontWeight: '700', textDecoration: 'none' }}>Standards</Link>
                    
                    <div style={{ height: '1px', background: 'var(--border)', margin: '8px 0' }} />
                    <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Connected Portals</span>
                    <a href="http://localhost:3001" target="_blank" rel="noreferrer" style={{ color: '#2563eb', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Stethoscope size={18} /> Doctor Clinical Suite (:3001)
                    </a>
                    <a href="http://localhost:3002" target="_blank" rel="noreferrer" style={{ color: '#059669', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Pill size={18} /> Pharmacy Terminal (:3002)
                    </a>

                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <Link to="/login" onClick={toggleMobileMenu} style={{ padding: '12px', textAlign: 'center', borderRadius: '10px', border: '1px solid var(--border)', color: 'var(--text)', fontWeight: '700', textDecoration: 'none' }}>
                            Sign In
                        </Link>
                        <Link to="/register" onClick={toggleMobileMenu} style={{ padding: '12px', textAlign: 'center', borderRadius: '10px', background: 'var(--primary)', color: 'white', fontWeight: '700', textDecoration: 'none' }}>
                            Register ABHA ID
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default PublicNavbar;
