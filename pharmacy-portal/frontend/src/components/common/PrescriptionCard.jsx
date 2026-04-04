import React from "react";
import { User, Stethoscope, Calendar, FileText, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const PrescriptionCard = ({ prescription }) => {
    if (!prescription) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-xl shadow-slate-200/50 space-y-6 relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold font-lexend text-foreground">Prescription Details</h3>
                    <p className="text-sm text-muted-foreground">Issued on {prescription.date}</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm">
                    <CheckCircle2 size={16} className="animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider">Valid Prescription</span>
                </div>
            </div>

            {/* Patient & Doctor Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                        <div className="p-3 rounded-xl bg-primary/10 shadow-inner">
                            <User size={20} className="text-primary" />
                        </div>
                        <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Patient Name</p>
                            <p className="font-bold text-foreground text-lg">{prescription.patient?.name}</p>
                        </div>
                    </div>
                    <div className="px-4">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">UHID</p>
                        <p className="font-mono text-sm text-primary font-bold tracking-tight">{prescription.patient?.health_id}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                        <div className="p-3 rounded-xl bg-emerald-500/10 shadow-inner">
                            <Stethoscope size={20} className="text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Doctor</p>
                            <p className="font-bold text-foreground text-lg">{prescription.doctor?.name}</p>
                        </div>
                    </div>
                    <div className="px-4">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Specialization</p>
                        <p className="text-sm text-muted-foreground font-medium">{prescription.doctor?.specialization}</p>
                    </div>
                </div>
            </div>

            {/* Medicines Table */}
            <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <h4 className="text-sm font-bold text-foreground uppercase tracking-widest">Medicines</h4>
                </div>
                <div className="overflow-hidden rounded-2xl border border-border/50 bg-secondary/30">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-secondary/50 border-b border-border/50">
                                <tr>
                                    <th className="py-4 px-4 text-[10px] text-muted-foreground uppercase tracking-wider font-bold">#</th>
                                    <th className="py-4 px-4 text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Medicine Name</th>
                                    <th className="py-4 px-4 text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Dosage</th>
                                    <th className="py-4 px-4 text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Duration</th>
                                    <th className="py-4 px-4 text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Instructions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                {prescription.medicines?.map((med, index) => (
                                    <tr key={index} className="hover:bg-primary/5 transition-colors group/row">
                                        <td className="py-4 px-4 text-muted-foreground font-medium">{index + 1}</td>
                                        <td className="py-4 px-4 font-bold text-foreground group-hover/row:text-primary transition-colors">{med.name}</td>
                                        <td className="py-4 px-4">
                                            <span className="px-2 py-1 rounded-md bg-secondary text-xs font-semibold text-muted-foreground">
                                                {med.dosage}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-muted-foreground font-medium">{med.duration}</td>
                                        <td className="py-4 px-4 text-muted-foreground text-xs leading-relaxed max-w-[200px]">
                                            {med.instructions}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Notes */}
            {prescription.notes && (
                <div className="bg-amber-500/5 rounded-2xl p-6 border border-amber-500/10 flex gap-4">
                    <FileText className="text-amber-500 shrink-0" size={20} />
                    <div>
                        <p className="text-[10px] text-amber-600 uppercase tracking-wider font-bold mb-1">Doctor's Notes</p>
                        <p className="text-sm text-foreground leading-relaxed italic">"{prescription.notes}"</p>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default PrescriptionCard;
