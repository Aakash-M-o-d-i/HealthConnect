import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import VitalsForm from "../components/common/VitalsForm";
import {
    Stethoscope,
    User,
    ChevronLeft,
    Save,
    FileText,
    Activity,
    Loader2,
    CheckCircle2,
    PencilLine
} from "lucide-react";

const CreateVisit = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const patientId = searchParams.get("patientId"); // This is the UHID

    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        symptoms: "",
        diagnosis: "",
        notes: "",
    });

    const [vitals, setVitals] = useState({
        blood_pressure: "",
        temperature: "",
        pulse: "",
        weight: "",
        spo2: "",
    });

    useEffect(() => {
        if (!patientId) {
            navigate("/search");
            return;
        }

        const fetchPatient = async () => {
            try {
                const response = await api.get(`/patients/${patientId}`);
                const data = response.data.profile;
                setPatient({
                    ...data,
                    healthId: data.health_id
                });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching patient", error);
                setLoading(false);
            }
        };

        fetchPatient();
    }, [patientId, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await api.post("/visits", {
                uhid: patientId,
                ...formData,
                vitals,
                facility: "HealthConnect Clinic"
            });

            setTimeout(() => {
                setIsSubmitting(false);
                navigate(`/patient/${patientId}?visitCreated=true`);
            }, 500);
        } catch (error) {
            console.error("Failed to create visit", error);
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <Link
                to={`/patient/${patientId}`}
                className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
            >
                <ChevronLeft size={16} />
                Back to Profile
            </Link>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Record New Visit</h1>
                    <p className="text-muted-foreground mt-1 flex items-center gap-2">
                        <User size={14} className="text-primary" />
                        Patient: <span className="font-bold text-foreground">{patient?.name}</span> ({patient?.healthId})
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Vitals Section */}
                <div className="bg-card p-8 rounded-3xl border border-border shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-primary/10 rounded-xl text-primary">
                            <Activity size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-foreground">Initial Vitals</h2>
                    </div>
                    <VitalsForm vitals={vitals} setVitals={setVitals} />
                </div>

                {/* Clinical Notes Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-card p-8 rounded-3xl border border-border shadow-sm h-full">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-orange-500/10 rounded-xl text-orange-600">
                                <FileText size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-foreground">Symptoms & Complaints</h2>
                        </div>
                        <textarea
                            className="w-full min-h-[150px] p-4 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none font-medium"
                            placeholder="Record patient complaints, symptoms, and duration..."
                            value={formData.symptoms}
                            onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                            required
                        />
                    </div>

                    <div className="bg-card p-8 rounded-3xl border border-border shadow-sm h-full">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-500/10 rounded-xl text-green-600">
                                <Stethoscope size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-foreground">Diagnosis</h2>
                        </div>
                        <textarea
                            className="w-full min-h-[150px] p-4 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none font-bold text-foreground"
                            placeholder="Enter clinical diagnosis and assessment..."
                            value={formData.diagnosis}
                            onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="bg-card p-8 rounded-3xl border border-border shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-secondary rounded-xl text-muted-foreground">
                            <PencilLine size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-foreground">Doctor's Observation Notes</h2>
                    </div>
                    <textarea
                        className="w-full min-h-[100px] p-4 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                        placeholder="Additional notes for the record (not shared with patient)..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                    <Link
                        to={`/patient/${patientId}`}
                        className="px-8 py-4 bg-secondary text-foreground font-bold rounded-2xl hover:bg-muted transition-all text-center"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-70 flex items-center justify-center gap-2 min-w-[200px]"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                <span>Saving Record...</span>
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                <span>Save Clinical Record</span>
                            </>
                        )}
                    </button>
                </div>
            </form>

            <div className="bg-green-600/5 border border-green-600/20 p-6 rounded-3xl flex items-start gap-4">
                <div className="p-2 bg-green-600/10 rounded-full text-green-600">
                    <CheckCircle2 size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-green-800 dark:text-green-400">Workflow Tip</h4>
                    <p className="text-sm text-green-700/80 dark:text-green-500/80 leading-relaxed">
                        After saving this visit, you will be redirected to the patient's profile where you can instantly write a digital prescription based on this diagnosis.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CreateVisit;
