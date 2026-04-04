import React, { useState } from "react";
import { Search, AlertCircle, CheckCircle2, Loader2, RotateCcw, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PrescriptionCard from "../components/common/PrescriptionCard";
import DispenseConfirmModal from "../components/common/DispenseConfirmModal";
import api from "../services/api";

const VerifyPrescription = () => {
    const [rxCode, setRxCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [dispensed, setDispensed] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!rxCode.trim()) return;

        setLoading(true);
        setResult(null);
        setError("");
        setDispensed(false);

        try {
            const upperCode = rxCode.toUpperCase().trim();
            const response = await api.get(`/pharmacy/verify/${upperCode}`);
            const data = response.data;

            if (data.status === "valid") {
                setResult(data.prescription);
            } else if (data.status === "dispensed") {
                setError(data.message);
            }
        } catch (err) {
            if (err.response?.status === 404) {
                setError("Prescription not found. Please check the RX code and try again.");
            } else {
                setError(err.response?.data?.message || "Failed to verify prescription. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDispense = async () => {
        setShowModal(false);
        setLoading(true);

        try {
            const response = await api.post(`/pharmacy/dispense/${result.rx_code}`);
            if (response.data.status === "success") {
                setDispensed(true);
            } else {
                setError(response.data.message || "Failed to dispense prescription.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to dispense prescription. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setRxCode("");
        setResult(null);
        setError("");
        setDispensed(false);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-1 text-center"
            >
                <h1 className="text-3xl font-black font-lexend text-foreground tracking-tight">Verify Prescription</h1>
                <p className="text-muted-foreground text-sm">Enter an RX code to verify patient details and dispense medicines.</p>
            </motion.div>

            {/* Search Bar */}
            <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onSubmit={handleVerify}
                className="flex flex-col sm:flex-row gap-4 p-2 bg-white rounded-2xl border-2 border-primary/20 shadow-xl shadow-slate-200/50"
            >
                <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                        <Search size={20} strokeWidth={2.5} />
                    </div>
                    <input
                        type="text"
                        placeholder="Enter RX Code"
                        className="block w-full pl-12 pr-6 py-4 bg-transparent text-foreground font-mono text-lg tracking-wider placeholder:text-muted-foreground/60 focus:outline-none transition-all"
                        value={rxCode}
                        onChange={(e) => setRxCode(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading || !rxCode.trim()}
                    className="px-10 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-primary/25 text-lg"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={22} />
                            <span>Verifying...</span>
                        </>
                    ) : (
                        <>
                            <span>Verify</span>
                            <ArrowRight size={22} strokeWidth={2.5} />
                        </>
                    )}
                </button>
            </motion.form>

            <AnimatePresence mode="wait">
                {/* Error State */}
                {error && (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white border-2 border-destructive/20 rounded-2xl p-8 flex items-start gap-6 shadow-lg shadow-destructive/10"
                    >
                        <div className="p-4 rounded-2xl bg-destructive/10 shrink-0 border border-destructive/20">
                            <AlertCircle className="text-destructive" size={32} />
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-bold text-foreground font-lexend">Verification Failed</h3>
                                <p className="text-muted-foreground leading-relaxed mt-1">{error}</p>
                            </div>
                            <button
                                onClick={handleReset}
                                className="inline-flex items-center gap-2 text-sm text-primary font-bold hover:gap-3 transition-all px-4 py-2 bg-primary/10 rounded-lg"
                            >
                                <RotateCcw size={16} strokeWidth={2.5} />
                                Try Another Code
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Valid Result */}
                {result && !dispensed && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                <CheckCircle2 className="text-emerald-500" size={24} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-foreground">Prescription Verified</h2>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Safe to Dispense</p>
                            </div>
                        </div>

                        <PrescriptionCard prescription={result} />

                        {/* Dispense Button */}
                        <motion.button
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowModal(true)}
                            disabled={loading}
                            className="w-full py-5 px-8 bg-emerald-500 text-white text-xl font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-4 group"
                        >
                            <CheckCircle2 size={28} className="group-hover:scale-110 transition-transform" />
                            <span>Dispense Prescription</span>
                        </motion.button>
                    </motion.div>
                )}

                {/* Dispensed Success */}
                {dispensed && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white border-2 border-emerald-500 rounded-3xl p-12 text-center space-y-6 shadow-2xl shadow-emerald-500/10 relative overflow-hidden"
                    >
                        
                        <div className="relative space-y-6">
                            <div className="mx-auto w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 shadow-inner">
                                <CheckCircle2 className="text-emerald-500" size={48} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-4xl font-black font-lexend text-foreground tracking-tight">Dispensed Successfully!</h3>
                                <p className="text-muted-foreground text-lg max-w-md mx-auto">
                                    Prescription <strong className="text-primary font-mono">{result?.rx_code}</strong> has been marked as dispensed and settled.
                                </p>
                            </div>
                            <div className="pt-4">
                                <button
                                    onClick={handleReset}
                                    className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 active:scale-95"
                                >
                                    <RotateCcw size={20} strokeWidth={2.5} />
                                    Verify Another
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Dispense Confirm Modal */}
            <DispenseConfirmModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleDispense}
                rxCode={result?.rx_code}
                patientName={result?.patient?.name}
                doctorName={result?.doctor?.name}
                specialization={result?.doctor?.specialization}
            />
        </div>
    );
};

export default VerifyPrescription;
