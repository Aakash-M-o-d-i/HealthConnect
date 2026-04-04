import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    Users,
    Calendar,
    ClipboardList,
    Clock,
    Search,
    PlusCircle,
    PencilLine,
    ChevronRight,
    ArrowUpRight,
    Loader2
} from "lucide-react";
import api from "../services/api";

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get("/doctor/dashboard");
                setStats(response.data.stats || {
                    total_patients: 124,
                    today_visits: 12,
                    prescriptions_written: 45,
                    pending_tasks: 3
                });
                setAppointments(response.data.appointments || [
                    { id: 1, patient_name: "Rahul Sharma", time: "09:30 AM", type: "Follow-up", status: "Completed" },
                    { id: 2, patient_name: "Anita Desai", time: "10:15 AM", type: "New Patient", status: "In Progress" },
                    { id: 3, patient_name: "Vivek Roy", time: "11:00 AM", type: "General Checkup", status: "Waiting" },
                    { id: 4, patient_name: "Meera Iyer", time: "11:45 AM", type: "Consultation", status: "Waiting" }
                ]);
            } catch (error) {
                // Silent fallback for network/CORS issues in demo mode
                if (error.code === 'ERR_NETWORK') {
                    console.warn("Network error: Falling back to local data storage.");
                } else {
                    console.error("Dashboard error:", error);
                }

                // Always set mock values on any API failure
                setStats({
                    total_patients: 124,
                    today_visits: 12,
                    prescriptions_written: 45,
                    pending_tasks: 3
                });
                setAppointments([
                    { id: 1, patient_name: "Rahul Sharma", time: "09:30 AM", type: "Follow-up", status: "Completed" },
                    { id: 2, patient_name: "Anita Desai", time: "10:15 AM", type: "New Patient", status: "In Progress" },
                    { id: 3, patient_name: "Vivek Roy", time: "11:00 AM", type: "General Checkup", status: "Waiting" },
                    { id: 4, patient_name: "Meera Iyer", time: "11:45 AM", type: "Consultation", status: "Waiting" }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    const statCards = [
        { label: "Total Patients", value: stats.total_patients_seen || stats.total_patients || 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Today's Visits", value: stats.today_visits, icon: Calendar, color: "text-green-500", bg: "bg-green-500/10" },
        { label: "Prescriptions Written", value: stats.prescriptions_written, icon: ClipboardList, color: "text-purple-500", bg: "bg-purple-500/10" },
        { label: "Pending Tasks", value: stats.pending_tasks, icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
    ];

    const quickActions = [
        { label: "Search Patient", href: "/search", icon: Search, color: "bg-primary" },
        { label: "Create Visit", href: "/visits/create", icon: PlusCircle, color: "bg-green-600" },
        { label: "Write Prescription", href: "/prescriptions/create", icon: PencilLine, color: "bg-purple-600" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Welcome, Doctor</h1>
                <p className="text-muted-foreground">Here is what's happening in your clinic today.</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                                +12% <ArrowUpRight size={14} />
                            </span>
                        </div>
                        <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Today's Appointments */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-foreground">Today's Appointments</h2>
                        <button className="text-sm text-primary font-semibold hover:underline">View All</button>
                    </div>
                    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-muted/50 border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Patient</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Time</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Type</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {appointments.map((apt) => (
                                    <tr
                                        key={apt.id}
                                        onClick={() => navigate(`/patient/${apt.patient_uhid || 'p1'}`)}
                                        className="hover:bg-muted/30 transition-colors group cursor-pointer"
                                    >
                                        <td className="px-6 py-4 text-sm font-semibold text-foreground">{apt.patient_name}</td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">{apt.time}</td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">{apt.type}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${apt.status === "Completed" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                                                apt.status === "In Progress" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                                                    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                                                }`}>
                                                {apt.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="p-2 rounded-lg group-hover:bg-muted text-muted-foreground transition-colors group-hover:text-primary inline-block">
                                                <ChevronRight size={18} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-foreground">Quick Actions</h2>
                    <div className="flex flex-col gap-4">
                        {quickActions.map((action, idx) => (
                            action.href ? (
                                <Link
                                    key={idx}
                                    to={action.href}
                                    className="group flex items-center p-4 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all gap-4"
                                >
                                    <div className={`p-3 rounded-xl ${action.color} text-white group-hover:scale-110 transition-transform`}>
                                        <action.icon size={24} />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="font-bold text-foreground">{action.label}</div>
                                        <div className="text-xs text-muted-foreground">Launch tool instantly</div>
                                    </div>
                                    <ChevronRight size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                                </Link>
                            ) : (
                                <button
                                    key={idx}
                                    onClick={action.onClick}
                                    className="group flex items-center w-full p-4 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all gap-4 text-left"
                                >
                                    <div className={`p-3 rounded-xl ${action.color} text-white group-hover:scale-110 transition-transform`}>
                                        <action.icon size={24} />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="font-bold text-foreground">{action.label}</div>
                                        <div className="text-xs text-muted-foreground">Reset all mock data</div>
                                    </div>
                                    <ChevronRight size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                                </button>
                            )
                        ))}
                    </div>

                    <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20 mt-4">
                        <h3 className="font-bold text-primary mb-2 flex items-center gap-2">
                            <Clock size={18} /> Tip of the day
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Use the UHID search to quickly pull up a patient's historical medical records and previous vitals.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
