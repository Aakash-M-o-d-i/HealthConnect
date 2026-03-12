import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, LogIn, UserPlus, Globe } from 'lucide-react';

const PublicNavbar = ({ darkMode, setDarkMode }) => {
    return (
        <nav className="public-navbar" style={{
            background: darkMode ? 'rgba(11, 15, 26, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border)',
            padding: '20px 48px',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                <div className="logo-icon" style={{
                    width: '40px', height: '40px', borderRadius: '12px',
                    fontSize: '18px', fontWeight: '900', background: 'var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)'
                }}>HC</div>
                <span className="logo-text" style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text)', letterSpacing: '-0.5px' }}>HealthConnect</span>
            </Link>

            <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                <Link to="/#features" style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--primary)'} onMouseOut={(e) => e.target.style.color = 'var(--text)'}>Framework</Link>
                <Link to="/#services" style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--primary)'} onMouseOut={(e) => e.target.style.color = 'var(--text)'}>Ecosystem</Link>
                <Link to="/about" style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--primary)'} onMouseOut={(e) => e.target.style.color = 'var(--text)'}>Engineering</Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '20px', paddingLeft: '32px', borderLeft: '1px solid var(--border)' }}>
                    <button
                        onClick={() => setDarkMode && setDarkMode(!darkMode)}
                        style={{
                            background: 'var(--surface)', border: '1px solid var(--border)',
                            width: '40px', height: '40px', borderRadius: '12px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: 'var(--text-muted)'
                        }}
                        aria-label="Toggle clinical theme"
                    >
                        {darkMode
                            ? <Sun size={18} strokeWidth={2.2} />
                            : <Moon size={18} strokeWidth={2.2} />}
                    </button>

                    <Link to="/login" className="btn btn-outline" style={{
                        padding: '10px 24px', borderRadius: '12px',
                        fontWeight: '800', fontSize: '14px', gap: '8px',
                        border: '1.5px solid var(--border)', color: 'var(--text)'
                    }}>
                        <LogIn size={16} strokeWidth={2.5} /> VERIFY SESSION
                    </Link>
                    <Link to="/register" className="btn btn-primary" style={{
                        padding: '10px 24px', borderRadius: '12px',
                        fontWeight: '800', fontSize: '14px', gap: '8px',
                        background: 'var(--primary)', border: 'none', color: 'white',
                        boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)'
                    }}>
                        <UserPlus size={16} strokeWidth={2.5} /> NEW UHID
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default PublicNavbar;
