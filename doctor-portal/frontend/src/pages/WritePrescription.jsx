import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import MedicineRow from "../components/common/MedicineRow";
import {
    PencilLine,
    User,
    ChevronLeft,
    Plus,
    Send,
    ClipboardCheck,
    Loader2,
    FileText,
    AlertCircle
} from "lucide-react";

const WritePrescription = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const patientId = searchParams.get("patientId"); // This is the UHID

    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [medicines, setMedicines] = useState([
        { name: "", dosage: "", duration: "", instructions: "" }
    ]);

    const [notes, setNotes] = useState("");

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

    const addMedicine = () => {
        setMedicines([...medicines, { name: "", dosage: "", duration: "", instructions: "" }]);
    };

    const removeMedicine = (index) => {
        if (medicines.length > 1) {
            const newMedicines = medicines.filter((_, i) => i !== index);
            setMedicines(newMedicines);
        }
    };

    const updateMedicine = (index, field, value) => {
        const newMedicines = [...medicines];
        newMedicines[index][field] = value;
        setMedicines(newMedicines);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await api.post("/prescriptions", {
                uhid: patientId,
                medicines,
                diagnosis: notes || "General Consultation",
                facility: "HealthConnect Clinic"
            });

            const newPrescription = response.data;

            setTimeout(() => {
                setIsSubmitting(false);
                navigate(`/prescriptions/success?rxCode=${newPrescription.rx_code}&patientName=${encodeURIComponent(patient.name)}`);
            }, 500);
        } catch (error) {
            console.error("Failed to generate prescription", error);
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
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <Link
                to={`/patient/${patientId}`}
                className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
            >
                <ChevronLeft size={16} />
                Back to Profile
            </Link>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Digital Prescription</h1>
                    <p className="text-muted-foreground mt-1 flex items-center gap-2">
                        <User size={14} className="text-primary" />
                        Patient: <span className="font-bold text-foreground">{patient?.name}</span> ({patient?.healthId})
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
                    <div className="bg-muted/50 px-8 py-4 border-b border-border flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <ClipboardCheck size={20} className="text-primary" />
                            <h2 className="font-bold text-foreground">Medicines & Dosage</h2>
                        </div>
                        <span className="text-xs font-bold text-muted-foreground uppercase">{medicines.length} Medicines added</span>
                    </div>

                    <div className="p-8 space-y-6">
                        {medicines.map((med, index) => (
                            <MedicineRow
                                key={index}
                                index={index}
                                medicine={med}
                                updateMedicine={updateMedicine}
                                removeMedicine={removeMedicine}
                            />
                        ))}

                        <button
                            type="button"
                            onClick={addMedicine}
                            className="w-full py-4 border-2 border-dashed border-border rounded-2xl text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all font-bold flex items-center justify-center gap-2"
                        >
                            <Plus size={20} />
                            Add Another Medication
                        </button>
                    </div>
                </div>

                <div className="bg-card p-8 rounded-3xl border border-border shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-secondary rounded-xl text-muted-foreground">
                            <FileText size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-foreground">Special Advice / Notes</h2>
                    </div>
                    <textarea
                        className="w-full min-h-[120px] p-4 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none font-medium text-foreground"
                        placeholder="Advice on diet, lifestyle, or follow-up instructions..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
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
                        className="px-10 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-70 flex items-center justify-center gap-3 min-w-[240px]"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={22} className="animate-spin" />
                                <span>Generating RX...</span>
                            </>
                        ) : (
                            <>
                                <Send size={20} />
                                <span>Generate Digital RX</span>
                            </>
                        )}
                    </button>
                </div>
            </form>

            <div className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-3xl flex items-start gap-4">
                <div className="p-2 bg-amber-500/10 rounded-full text-amber-600">
                    <AlertCircle size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-amber-800 dark:text-amber-400">Security Check</h4>
                    <p className="text-sm text-amber-700/80 dark:text-amber-500/80 leading-relaxed">
                        By generating this prescription, you are digitally signing it with your clinical ID. This record will be accessible to the patient and authorized pharmacies via the generated RX code.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WritePrescription;
