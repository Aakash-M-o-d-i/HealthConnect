import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import {
    User,
    Phone,
    MapPin,
    Calendar,
    Clock,
    History,
    ClipboardList,
    PencilLine,
    PlusCircle,
    ChevronRight,
    Loader2,
    Fingerprint,
    HeartPulse,
    Activity,
    AlertCircle
} from "lucide-react";

const PatientDetails = () => {
    const { id } = useParams(); // This is the UHID (health_id)
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [visits, setVisits] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [activeTab, setActiveTab] = useState("history"); // history, prescriptions, info
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const response = await api.get(`/patients/${id}`);
                const data = response.data;
                setPatient({
                    ...data.profile,
                    healthId: data.profile.health_id,
                    bloodGroup: data.profile.blood_group,
                    age: data.profile.dob ? new Date().getFullYear() - new Date(data.profile.dob).getFullYear() : "N/A"
                });
                setVisits(data.visit_history || []);
                setPrescriptions((data.prescriptions || []).map(p => ({
                    ...p,
                    rxCode: p.rx_code,
                    date: p.issue_date || p.created_at
                })));
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch patient data", error);
                setLoading(false);
            }
        };

        fetchPatientData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="text-center py-20">
                <AlertCircle size={48} className="mx-auto text-destructive mb-4" />
                <h2 className="text-2xl font-bold">Patient Not Found</h2>
                <Link to="/search" className="text-primary hover:underline mt-4 inline-block font-semibold">Back to Search</Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Patient Header */}
            <div className="bg-card p-8 rounded-3xl border border-border shadow-sm flex flex-col lg:flex-row justify-between gap-8">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center text-primary border-2 border-primary/20">
                        <User size={48} strokeWidth={1.5} />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-bold text-foreground">{patient.name}</h1>
                            <span className="px-3 py-1 bg-secondary rounded-full text-xs font-bold uppercase tracking-wider text-muted-foreground">{patient.gender || "N/A"} • {patient.age} Yrs</span>
                        </div>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                            <span className="flex items-center gap-2 text-muted-foreground">
                                <Fingerprint size={16} className="text-primary" />
                                <span className="font-bold text-foreground">{patient.healthId}</span>
                            </span>
                            <span className="flex items-center gap-2 text-muted-foreground">
                                <Phone size={16} />
                                <span>{patient.phone || "N/A"}</span>
                            </span>
                            <span className="flex items-center gap-2 text-muted-foreground">
                                <HeartPulse size={16} className="text-red-500" />
                                <span>Blood Group: <span className="font-bold text-foreground">{patient.bloodGroup || "N/A"}</span></span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Link
                        to={`/visits/create?patientId=${patient.healthId}`}
                        className="flex-grow sm:flex-grow-0 px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                    >
                        <PlusCircle size={20} />
                        <span>Create Visit</span>
                    </Link>
                    <Link
                        to={`/prescriptions/create?patientId=${patient.healthId}`}
                        className="flex-grow sm:flex-grow-0 px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
                    >
                        <PencilLine size={20} />
                        <span>Write Prescription</span>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Tabs */}
                    <div className="flex border-b border-border gap-8 overflow-x-auto no-scrollbar">
                        {[
                            { id: "history", label: "Visit History", icon: History },
                            { id: "prescriptions", label: "Prescriptions", icon: ClipboardList },
                            { id: "info", label: "Personal Info", icon: User }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 flex items-center gap-2 whitespace-nowrap border-b-2 transition-all font-bold text-sm ${activeTab === tab.id
                                    ? "border-primary text-primary"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-[300px]">
                        {activeTab === "history" && (
                            <div className="space-y-4">
                                {visits.length > 0 ? visits.map((visit) => (
                                    <div key={visit.id} className="bg-card p-6 rounded-2xl border border-border hover:border-primary/30 transition-all group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <div className="text-sm font-bold text-primary mb-1">{visit.date}</div>
                                                <h3 className="text-xl font-bold text-foreground">{visit.diagnosis || "General Visit"}</h3>
                                            </div>
                                            <div className="p-2 bg-secondary rounded-lg text-muted-foreground group-hover:text-primary transition-colors">
                                                <Activity size={20} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest block mb-1">Doctor</span>
                                                <p className="text-foreground">{visit.doctor_name}</p>
                                            </div>
                                            <div>
                                                <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest block mb-1">Facility</span>
                                                <p className="text-foreground">{visit.facility || "HealthConnect Clinic"}</p>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-12 text-muted-foreground">No visit history found.</div>
                                )}
                            </div>
                        )}

                        {activeTab === "prescriptions" && (
                            <div className="space-y-4">
                                {prescriptions.length > 0 ? prescriptions.map((px) => (
                                    <div key={px.id} className="bg-card p-6 rounded-2xl border border-border group hover:shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600">
                                                <ClipboardList size={24} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-foreground">{px.rxCode || px.rx_code}</div>
                                                <div className="text-xs text-muted-foreground">{px.date || px.issue_date}</div>
                                            </div>
                                        </div>
                                        <div className="flex-grow">
                                            <div className="text-sm text-foreground line-clamp-1">
                                                {px.medicines && px.medicines.length > 0 ? px.medicines.map(m => m.name).join(", ") : "No medicines listed"}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${px.status === "Dispensed" ? "bg-green-100 text-green-700 font-bold" : "bg-muted text-muted-foreground font-bold"
                                                }`}>
                                                {px.status || "Active"}
                                            </span>
                                            <button className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                                                Details <ChevronRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-12 text-muted-foreground">No prescriptions found.</div>
                                )}
                            </div>
                        )}

                        {activeTab === "info" && (
                            <div className="bg-card p-8 rounded-3xl border border-border divide-y divide-border">
                                <div className="py-4 first:pt-0 grid grid-cols-3">
                                    <span className="text-sm font-bold text-muted-foreground">Full Name</span>
                                    <span className="text-sm font-semibold col-span-2">{patient.name}</span>
                                </div>
                                <div className="py-4 grid grid-cols-3">
                                    <span className="text-sm font-bold text-muted-foreground">Contact</span>
                                    <div className="col-span-2 space-y-1">
                                        <p className="text-sm font-semibold">{patient.phone}</p>
                                        <p className="text-sm text-muted-foreground">{patient.email}</p>
                                    </div>
                                </div>
                                <div className="py-4 grid grid-cols-3">
                                    <span className="text-sm font-bold text-muted-foreground">Address</span>
                                    <span className="text-sm font-semibold col-span-2 leading-relaxed">{patient.address || "N/A"}</span>
                                </div>
                                <div className="py-4 last:pb-0 grid grid-cols-3">
                                    <span className="text-sm font-bold text-muted-foreground">Emergency</span>
                                    <span className="text-sm font-semibold col-span-2 text-red-500">{patient.emergency_contact || "N/A"}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-primary p-6 rounded-3xl text-white shadow-lg shadow-primary/20">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Activity size={20} /> Latest Vitals
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-white/20">
                                <span className="text-white/70 text-sm">Blood Pressure</span>
                                <span className="font-bold">
                                    {visits.length > 0 && visits[0].blood_pressure ? visits[0].blood_pressure : "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/20">
                                <span className="text-white/70 text-sm">Heart Rate</span>
                                <span className="font-bold">
                                    {visits.length > 0 && visits[0].pulse ? `${visits[0].pulse} bpm` : "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/20">
                                <span className="text-white/70 text-sm">Temperature</span>
                                <span className="font-bold">
                                    {visits.length > 0 && visits[0].temperature ? `${visits[0].temperature} °F` : "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/20">
                                <span className="text-white/70 text-sm">SpO2</span>
                                <span className="font-bold">
                                    {visits.length > 0 && visits[0].spo2 ? `${visits[0].spo2}%` : "N/A"}
                                </span>
                            </div>
                        </div>
                        <p className="text-[10px] text-white/50 mt-4 text-center italic">
                            {visits.length > 0 ? "Vitals from last visit" : "No visit history available"}
                        </p>
                    </div>

                    <div className="bg-card p-6 rounded-3xl border border-border">
                        <h3 className="font-bold text-foreground mb-4">Known Allergies</h3>
                        <div className="flex flex-wrap gap-2">
                            {patient.allergies && patient.allergies.length > 0 ? patient.allergies.map((a, i) => (
                                <span key={i} className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg text-xs font-bold">{a}</span>
                            )) : (
                                <span className="text-sm text-muted-foreground">None reported</span>
                            )}
                        </div>
                    </div>

                    <div className="bg-muted/50 p-6 rounded-3xl border border-border border-dashed">
                        <h3 className="font-bold text-foreground text-sm mb-2">Quick Note</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Patient data is fetched from the shared HealthConnect database in real-time.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDetails;
