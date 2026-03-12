import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    Pill,
    User,
    Info,
    LogOut,
    Sun,
    Moon,
    ClipboardList,
    ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ darkMode, setDarkMode }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: 'Health Dashboard', path: '/dashboard' },
        { icon: FileText, label: 'My Records', path: '/records' },
        { icon: Pill, label: 'Pharmacy Wallet', path: '/prescriptions' },
        { icon: User, label: 'Health Profile', path: '/profile' },
        { icon: Info, label: 'About Ecosystem', path: '/about' },
    ];

    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'P';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="sidebar">

            {/* Logo */}
            <div className="sidebar-logo" style={{ padding: '32px 24px' }}>
                <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                    <div className="logo-icon" style={{ borderRadius: '10px', width: '40px', height: '40px', fontSize: '18px' }}>HC</div>
                    <div>
                        <div className="logo-text" style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text)' }}>HealthConnect</div>
                        <span className="logo-sub" style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: '800', letterSpacing: '1px' }}>PATIENT PORTAL</span>
                    </div>
                </Link>
            </div>

            {/* Nav */}
            <nav className="sidebar-nav" style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="nav-label" style={{ paddingLeft: '12px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '16px', marginTop: '8px' }}>PLATFORM SERVICES</div>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${active ? 'active' : ''}`}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '14px',
                                padding: '16px 20px', borderRadius: '14px',
                                textDecoration: 'none', color: active ? 'var(--primary)' : 'var(--text-muted)',
                                background: active ? 'var(--primary-light)' : 'transparent',
                                fontWeight: active ? '800' : '600',
                                transition: 'all 0.2s',
                                borderLeft: active ? '4px solid var(--primary)' : '4px solid transparent'
                            }}
                        >
                            <Icon size={22} strokeWidth={active ? 3 : 2} />
                            <span style={{ fontSize: '15px' }}>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="sidebar-footer" style={{ padding: '32px 24px', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                        style={{
                            background: 'var(--danger-light)', color: 'var(--danger)',
                            border: '1.5px solid transparent', fontWeight: '800', width: '100%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            gap: '12px', padding: '14px', borderRadius: '14px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <LogOut size={18} strokeWidth={2.5} />
                        TERMINATE SESSION
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
