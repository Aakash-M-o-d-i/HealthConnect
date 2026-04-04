import React from "react";
import { User, Stethoscope, Calendar, FileText } from "lucide-react";

const PrescriptionCard = ({ prescription }) => {
    if (!prescription) return null;

    return (
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold font-lexend text-foreground">Prescription Details</h3>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    ✅ Valid Prescription
                </span>
            </div>

            {/* Patient & Doctor Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <User size={16} className="text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Patient Name</p>
                            <p className="font-semibold text-foreground">{prescription.patient?.name}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">UHID</p>
                        <p className="font-mono text-sm text-primary font-bold">{prescription.patient?.health_id}</p>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Stethoscope size={16} className="text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Doctor</p>
                            <p className="font-semibold text-foreground">{prescription.doctor?.name}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Specialization</p>
                        <p className="text-sm text-muted-foreground">{prescription.doctor?.specialization}</p>
                    </div>
                </div>
            </div>

            {/* Date & RX Code */}
            <div className="flex items-center gap-6 pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{prescription.date}</span>
                </div>
                <div className="flex items-center gap-2">
                    <FileText size={14} className="text-muted-foreground" />
                    <span className="text-sm font-mono text-primary font-bold">{prescription.rx_code}</span>
                </div>
            </div>

            {/* Medicines Table */}
            <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Medicines</h4>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-2 px-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">#</th>
                                <th className="text-left py-2 px-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">Medicine Name</th>
                                <th className="text-left py-2 px-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">Dosage</th>
                                <th className="text-left py-2 px-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">Duration</th>
                                <th className="text-left py-2 px-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">Instructions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prescription.medicines?.map((med, index) => (
                                <tr key={index} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                                    <td className="py-3 px-3 text-muted-foreground">{index + 1}</td>
                                    <td className="py-3 px-3 font-medium text-foreground">{med.name}</td>
                                    <td className="py-3 px-3 text-muted-foreground">{med.dosage}</td>
                                    <td className="py-3 px-3 text-muted-foreground">{med.duration}</td>
                                    <td className="py-3 px-3 text-muted-foreground">{med.instructions}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Notes */}
            {prescription.notes && (
                <div className="bg-secondary/50 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Doctor's Notes</p>
                    <p className="text-sm text-foreground">{prescription.notes}</p>
                </div>
            )}
        </div>
    );
};

export default PrescriptionCard;
