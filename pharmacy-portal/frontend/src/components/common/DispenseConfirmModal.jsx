import React from "react";
import { AlertTriangle, CheckCircle, X, User, Stethoscope } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DispenseConfirmModal = ({ isOpen, onClose, onConfirm, rxCode, patientName, doctorName, specialization }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/70"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative bg-white rounded-3xl border-2 border-slate-200 shadow-2xl max-w-md w-full overflow-hidden"
                    >
                        {/* Status Bar */}
                        <div className="h-1.5 bg-amber-500 w-full" />

                        <div className="p-8 space-y-6">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="text-center space-y-2">
                                <div className="mx-auto w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-2 rotate-3 hover:rotate-0 transition-transform">
                                    <AlertTriangle className="text-amber-500" size={32} />
                                </div>
                                <h3 className="text-2xl font-bold font-lexend text-foreground">Confirm Dispensing</h3>
                                <p className="text-muted-foreground">
                                    Please review the prescription details before marking it as dispensed.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="bg-secondary/30 rounded-2xl p-5 border border-border/50 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">RX Code</span>
                                        <span className="text-sm font-mono font-bold text-primary px-2 py-1 bg-primary/10 rounded-md">
                                            {rxCode}
                                        </span>
                                    </div>

                                    <div className="pt-3 border-t border-border/50 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                <User size={16} className="text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Patient</p>
                                                <p className="text-sm font-semibold text-foreground">{patientName}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-emerald-500/10">
                                                <Stethoscope size={16} className="text-emerald-500" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Prescribing Doctor</p>
                                                <p className="text-sm font-semibold text-foreground">
                                                    {doctorName}
                                                    <span className="ml-2 text-xs font-normal text-muted-foreground">({specialization})</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-destructive/5 rounded-xl p-4 border border-destructive/10">
                                <p className="text-xs text-center text-muted-foreground leading-relaxed">
                                    <span className="font-bold text-destructive">Warning:</span> This action cannot be undone. The prescription will be marked as <strong className="text-foreground">Dispensed</strong> system-wide.
                                </p>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-3.5 px-4 rounded-2xl border border-border text-foreground font-semibold hover:bg-secondary transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className="flex-1 py-3.5 px-4 rounded-2xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-95"
                                >
                                    <CheckCircle size={20} />
                                    Dispense
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DispenseConfirmModal;
