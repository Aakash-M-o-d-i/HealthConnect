import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
    LogOut, 
    LayoutDashboard, 
    Users, 
    ShieldCheck, 
    Settings, 
    HeartPulse,
    Menu,
    X
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { cn } from "../lib/utils";

const Navbar = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: "Dashboard", href: "/", icon: LayoutDashboard },
        { name: "Doctors", href: "/doctors", icon: Users },
        { name: "Pharmacies", href: "/pharmacies", icon: ShieldCheck },
        { name: "Settings", href: "/settings", icon: Settings },
    ];

    return (
        <nav className="sticky top-0 z-50 glass border-b border-border shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="p-1.5 bg-primary rounded-xl group-hover:scale-105 transition-transform duration-200">
                                <HeartPulse className="text-white" size={20} />
                            </div>
                            <span className="text-xl font-bold font-lexend text-foreground tracking-tight">
                                HealthConnect<span className="text-primary">.admin</span>
                            </span>
                        </Link>

                        <div className="hidden md:ml-10 md:flex md:space-x-4">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = location.pathname === link.href;
                                return (
                                    <Link
                                        key={link.name}
                                        to={link.href}
                                        className={cn(
                                            "inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                                            isActive
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                        )}
                                    >
                                        <Icon size={16} className="mr-2" />
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <ThemeToggle />

                        <div className="hidden md:flex items-center gap-3 pl-4 border-l border-border ml-2">
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-semibold text-foreground">Admin User</span>
                                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Hospital Admin</span>
                            </div>
                            <button
                                className="p-2 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-lg md:hidden hover:bg-accent text-muted-foreground transition-colors"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden glass border-t border-border animate-in slide-in-from-top duration-300">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = location.pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={cn(
                                        "flex items-center px-3 py-3 rounded-xl text-base font-medium transition-colors",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                    )}
                                >
                                    <Icon size={20} className="mr-3" />
                                    {link.name}
                                </Link>
                            );
                        })}
                        <div className="pt-4 pb-2 border-t border-border mt-4">
                            <button className="flex items-center w-full px-3 py-3 rounded-xl text-base font-medium text-destructive hover:bg-destructive/10 transition-colors">
                                <LogOut size={20} className="mr-3" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 font-inter">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500">
                {children}
            </main>
            <footer className="border-t border-border bg-muted/30 py-6">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>© 2026 HealthConnect Admin Portal. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link to="#" className="hover:text-primary">Privacy Policy</Link>
                        <Link to="#" className="hover:text-primary">Terms of Service</Link>
                        <Link to="#" className="hover:text-primary">Contact Support</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
