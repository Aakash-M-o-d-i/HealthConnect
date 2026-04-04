import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import StatsCard from "../components/common/StatsCard";
import { ClipboardCheck, Clock, XCircle, PackageCheck, ArrowRight, Loader2 } from "lucide-react";

const PharmacyDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ verified_today: 0, pending: 0, rejected: 0, total_dispensed: 0 });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await api.get("/pharmacy/dashboard");
            setStats(response.data.stats);
            setRecentActivity(response.data.recent_activity || []);
        } catch (error) {
            console.error("Failed to fetch dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-lexend text-foreground">
                        Welcome back, <span className="text-primary">{user?.name || "Pharmacy"}</span>
                    </h1>
                    <p className="text-muted-foreground mt-1">Here's your dispensing overview for today.</p>
                </div>
                <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="Dispensed Today" value={stats.verified_today} icon={ClipboardCheck} color="success" subtitle="↑ Today's count" />
                <StatsCard title="Pending Orders" value={stats.pending} icon={Clock} color="warning" subtitle="● On hold" />
                <StatsCard title="Rejected" value={stats.rejected} icon={XCircle} color="destructive" subtitle="⚠ Requires action" />
                <StatsCard title="Total Dispensed" value={stats.total_dispensed} icon={PackageCheck} color="primary" subtitle="All time" />
            </div>

            {/* CTA - Verify Prescription */}
            <div className="bg-card border border-border rounded-2xl p-8 text-center space-y-4 shadow-sm">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <ClipboardCheck className="text-primary" size={32} />
                </div>
                <h2 className="text-2xl font-bold font-lexend text-foreground">New Prescription?</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                    Quickly verify and process medications by scanning the RX QR code or manually entering the reference number.
                </p>
                <button
                    onClick={() => navigate("/verify")}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                >
                    <ClipboardCheck size={20} />
                    Verify Prescription
                    <ArrowRight size={16} />
                </button>
            </div>

            {/* Recent Activity Table */}
            <div className="bg-card border border-border rounded-xl shadow-sm">
                <div className="flex items-center justify-between p-6 pb-4 border-b border-border">
                    <h3 className="text-lg font-bold font-lexend text-foreground">Recent Activity</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-3 px-6 text-xs text-muted-foreground uppercase tracking-wider font-medium">RX Code</th>
                                <th className="text-left py-3 px-6 text-xs text-muted-foreground uppercase tracking-wider font-medium">Patient Name</th>
                                <th className="text-left py-3 px-6 text-xs text-muted-foreground uppercase tracking-wider font-medium">Doctor</th>
                                <th className="text-left py-3 px-6 text-xs text-muted-foreground uppercase tracking-wider font-medium">Medicines</th>
                                <th className="text-left py-3 px-6 text-xs text-muted-foreground uppercase tracking-wider font-medium">Time</th>
                                <th className="text-left py-3 px-6 text-xs text-muted-foreground uppercase tracking-wider font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentActivity.length > 0 ? (
                                recentActivity.map((item, index) => (
                                    <tr key={index} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                                        <td className="py-4 px-6 font-mono text-primary font-bold text-xs">{item.rx_code}</td>
                                        <td className="py-4 px-6 font-semibold text-foreground">{item.patient_name}</td>
                                        <td className="py-4 px-6 text-muted-foreground">{item.doctor_name}</td>
                                        <td className="py-4 px-6 text-muted-foreground text-xs">{item.medicines}</td>
                                        <td className="py-4 px-6 text-muted-foreground">{item.time}</td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${item.status === "Dispensed"
                                                    ? "bg-emerald-500/10 text-emerald-500"
                                                    : item.status === "Rejected"
                                                        ? "bg-red-500/10 text-red-500"
                                                        : "bg-amber-500/10 text-amber-500"
                                                }`}>
                                                {item.status === "Dispensed" ? "● " : "○ "}{item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-muted-foreground">
                                        No recent activity. Start by verifying a prescription.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PharmacyDashboard;
