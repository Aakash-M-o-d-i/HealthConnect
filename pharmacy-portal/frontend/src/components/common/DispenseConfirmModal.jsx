import React from "react";
import { AlertTriangle, CheckCircle, X } from "lucide-react";

const DispenseConfirmModal = ({ isOpen, onClose, onConfirm, rxCode, patientName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal */}
            <div className="relative bg-card rounded-2xl border border-border shadow-2xl max-w-md w-full mx-4 p-6 space-y-5">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-secondary text-muted-foreground"
                >
                    <X size={18} />
                </button>

                <div className="text-center">
                    <div className="mx-auto w-14 h-14 bg-amber-500/10 rounded-full flex items-center justify-center mb-3">
                        <AlertTriangle className="text-amber-500" size={28} />
                    </div>
                    <h3 className="text-xl font-bold font-lexend text-foreground">Confirm Dispensing</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        Are you sure you want to dispense this prescription?
                    </p>
                </div>

                <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">RX Code</span>
                        <span className="text-sm font-mono font-bold text-primary">{rxCode}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Patient</span>
                        <span className="text-sm font-semibold text-foreground">{patientName}</span>
                    </div>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                    This action cannot be undone. The prescription will be marked as <strong className="text-foreground">Dispensed</strong> across all portals.
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 px-4 rounded-xl border border-border text-foreground font-medium hover:bg-secondary transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                    >
                        <CheckCircle size={18} />
                        Dispense
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DispenseConfirmModal;
