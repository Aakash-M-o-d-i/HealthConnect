import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ThemeToggle from "./ThemeToggle";
import { LogOut, User, Search, LayoutDashboard, Stethoscope } from "lucide-react";

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    if (!user) return null;

    const navLinks = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Search Patient", href: "/search", icon: Search },
    ];

    return (
        <nav className="sticky top-0 z-50 glass border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/dashboard" className="flex items-center gap-2">
                            <div className="p-1.5 bg-primary rounded-lg">
                                <Stethoscope className="text-white" size={20} />
                            </div>
                            <span className="text-xl font-bold font-lexend text-foreground">HealthConnect<span className="text-primary">.doctor</span></span>
                        </Link>

                        <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = location.pathname === link.href;
                                return (
                                    <Link
                                        key={link.name}
                                        to={link.href}
                                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${isActive
                                                ? "border-primary text-foreground"
                                                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                                            }`}
                                    >
                                        <Icon size={16} className="mr-2" />
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />

                        <div className="flex items-center gap-3 pl-4 border-l border-border">
                            <div className="flex flex-col items-end hidden md:flex">
                                <span className="text-sm font-semibold text-foreground">Dr. {user.name || "Specialist"}</span>
                                <span className="text-[10px] text-primary uppercase tracking-wider font-black">{user.specialization || "Physician"}</span>
                                {user.experience && (
                                    <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">{user.experience} Experience</span>
                                )}
                            </div>
                            <button
                                onClick={logout}
                                className="p-2 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
