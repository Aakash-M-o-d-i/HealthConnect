import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import {
    Stethoscope, Lock, Mail, AlertCircle, Loader2,
    Shield, Activity, FileText, Sparkles,
    Eye, EyeOff, ExternalLink, Pill, Award
} from "lucide-react";

const LoginPage = () => {
    const { login, user } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // If already logged in, redirect to dashboard
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        const result = await login(email, password);

        if (result.success) {
            navigate("/dashboard");
        } else {
            setError(result.message);
        }
        setIsSubmitting(false);
    };

    const handleQuickLogin = async (demoEmail, demoPass) => {
        setEmail(demoEmail);
        setPassword(demoPass);
        setError("");
        setIsSubmitting(true);
        const result = await login(demoEmail, demoPass);
        if (result.success) {
            navigate("/dashboard");
        } else {
            setError(result.message);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
            {/* Slim Accreditation & Portal Bar */}
            <div className="bg-slate-900 border-b border-slate-800 text-slate-300 px-6 py-2 text-xs flex justify-between items-center flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                    <span className="font-bold text-sky-400 tracking-wider">
                        NMC HEALTHCARE PROFESSIONAL REGISTRY (HPR) GATEWAY
                    </span>
                    <span className="text-slate-600 hidden md:inline">|</span>
                    <span className="text-slate-400 hidden md:inline text-[11px]">
                        TLS 1.3 Encrypted Clinical Telemetry • HSM Digital Key Store
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">Portals:</span>
                    <a
                        href="http://localhost:5173"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sky-300 hover:text-white bg-sky-500/10 hover:bg-sky-500/20 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors"
                    >
                        Patient (:5173) <ExternalLink size={10} />
                    </a>
                    <a
                        href="http://localhost:5175"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-300 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors"
                    >
                        Pharmacy (:5175) <ExternalLink size={10} />
                    </a>
                </div>
            </div>

            {/* Main Clinical Gateway Body */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10">
                <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    
                    {/* Left Column: Clinical Workstation Showcase */}
                    <div className="lg:col-span-7 space-y-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-3">
                                <Award size={13} /> National Health Mission Clinical Provider Node
                            </div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-lexend text-foreground tracking-tight leading-tight">
                                Point-of-Care Clinical Intelligence & Cryptographic Prescribing
                            </h1>
                            <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
                                Seamlessly resolve citizen ABHA health IDs, query consent-governed longitudinal medical summaries, 
                                and generate tamper-proof electronic prescriptions with instant pharmacy network fulfillment.
                            </p>
                        </div>

                        {/* Interactive Encounter Telemetry Preview Card */}
                        <div className="bg-card border border-border rounded-2xl p-5 shadow-lg relative overflow-hidden">
                            <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-1.5 bg-emerald-500/10 text-emerald-600 rounded-lg">
                                        <Activity size={16} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                            Live Encounter Simulation • Room 302
                                        </div>
                                        <div className="text-xs sm:text-sm font-bold text-foreground">
                                            Patient: Rahul Sharma (32M) • HID-1001
                                        </div>
                                    </div>
                                </div>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-600">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Vitals Synced
                                </span>
                            </div>

                            {/* Vitals Telemetry Row */}
                            <div className="grid grid-cols-4 gap-2 mb-4">
                                <div className="bg-secondary/60 rounded-xl p-2 text-center">
                                    <span className="text-[9px] text-muted-foreground font-bold uppercase block">BP (mmHg)</span>
                                    <span className="text-xs sm:text-sm font-black text-foreground">120/80</span>
                                </div>
                                <div className="bg-secondary/60 rounded-xl p-2 text-center">
                                    <span className="text-[9px] text-muted-foreground font-bold uppercase block">Pulse</span>
                                    <span className="text-xs sm:text-sm font-black text-foreground">72 bpm</span>
                                </div>
                                <div className="bg-secondary/60 rounded-xl p-2 text-center">
                                    <span className="text-[9px] text-muted-foreground font-bold uppercase block">SpO2</span>
                                    <span className="text-xs sm:text-sm font-black text-foreground">98%</span>
                                </div>
                                <div className="bg-secondary/60 rounded-xl p-2 text-center">
                                    <span className="text-[9px] text-muted-foreground font-bold uppercase block">Temp</span>
                                    <span className="text-xs sm:text-sm font-black text-foreground">98.4°F</span>
                                </div>
                            </div>

                            {/* E-Rx Generation Preview */}
                            <div className="bg-background rounded-xl p-2.5 border border-border flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2.5">
                                    <FileText className="text-primary w-4 h-4 flex-shrink-0" />
                                    <div>
                                        <span className="font-bold text-foreground text-xs block">E-Prescription Hash: RXLOUKBB</span>
                                        <span className="text-muted-foreground font-mono text-[10px]">SHA-256: 0x7f83b165... Verified</span>
                                    </div>
                                </div>
                                <span className="text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-[11px]">
                                    Digitally Signed ✓
                                </span>
                            </div>
                        </div>

                        {/* Feature Badges Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-card border border-border">
                                <Shield className="text-primary w-4 h-4 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="text-xs font-bold text-foreground">Instant ABHA Resolution</h4>
                                    <p className="text-[11px] text-muted-foreground">Access prior clinical encounters across ABDM hospital networks.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-card border border-border">
                                <Pill className="text-emerald-600 w-4 h-4 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="text-xs font-bold text-foreground">Tamper-Proof E-Prescriptions</h4>
                                    <p className="text-[11px] text-muted-foreground">Single-use cryptographic hashes eliminate prescription reuse.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Practitioner Authentication */}
                    <div className="lg:col-span-5">
                        <div className="bg-card border border-border rounded-2xl p-6 sm:p-7 shadow-xl relative">
                            {/* Card Header */}
                            <div className="text-center mb-5">
                                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-2.5">
                                    <Stethoscope className="text-primary w-7 h-7" />
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black font-lexend text-foreground tracking-tight">
                                    Clinical Provider Login
                                </h2>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Authenticate to access patient clinical consultation charts
                                </p>
                            </div>

                            {/* Hackathon Evaluator Quick-Login Bar */}
                            <div className="bg-secondary/60 border border-border rounded-xl p-3 mb-4">
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-primary uppercase tracking-wider mb-2">
                                    <Sparkles size={13} /> Evaluator 1-Click Login
                                </div>
                                <div className="space-y-1.5">
                                    <button
                                        type="button"
                                        onClick={() => handleQuickLogin("aakashmodi@gmail.com", "password")}
                                        className="w-full text-left px-3 py-1.5 rounded-lg bg-card hover:bg-primary/10 border border-border hover:border-primary/30 text-xs font-semibold transition-all flex items-center justify-between"
                                    >
                                        <div>
                                            <span className="font-bold text-foreground block">Dr. Aakash Modi</span>
                                            <span className="text-muted-foreground text-[10px]">Emergency Medicine (5 yrs)</span>
                                        </div>
                                        <span className="text-[11px] font-bold text-primary">Login →</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleQuickLogin("doctor@gmail.com", "password")}
                                        className="w-full text-left px-3 py-1.5 rounded-lg bg-card hover:bg-primary/10 border border-border hover:border-primary/30 text-xs font-semibold transition-all flex items-center justify-between"
                                    >
                                        <div>
                                            <span className="font-bold text-foreground block">Dr. Health</span>
                                            <span className="text-muted-foreground text-[10px]">General Physician</span>
                                        </div>
                                        <span className="text-[11px] font-bold text-primary">Login →</span>
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="p-2.5 mb-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                                    <AlertCircle size={15} className="flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Standard Form */}
                            <form onSubmit={handleSubmit} className="space-y-3.5">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider ml-1" htmlFor="email">
                                        Clinical Email / HPR ID
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                                            <Mail size={15} />
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="doctor@hospital.com"
                                            className="block w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-border rounded-xl bg-background text-foreground transition-all focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider ml-1" htmlFor="password">
                                        Password
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                                            <Lock size={15} />
                                        </div>
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="block w-full pl-9 pr-9 py-2 text-xs sm:text-sm border border-border rounded-xl bg-background text-foreground transition-all focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full mt-1 py-2.5 px-4 bg-primary text-white font-bold text-xs sm:text-sm rounded-xl transition-all hover:bg-primary/90 focus:ring-4 focus:ring-primary/20 disabled:opacity-70 flex items-center justify-center gap-2 shadow-md shadow-primary/20"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin" size={16} />
                                            <span>Authenticating Practitioner...</span>
                                        </>
                                    ) : (
                                        "Access Clinical Suite"
                                    )}
                                </button>
                            </form>

                            {/* Compliance Footnote */}
                            <div className="mt-4 pt-3 border-t border-border text-center">
                                <p className="text-[10px] text-muted-foreground leading-normal">
                                    Verified practitioners only. Sessions are cryptographically logged under National Digital Health Mission standards.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LoginPage;