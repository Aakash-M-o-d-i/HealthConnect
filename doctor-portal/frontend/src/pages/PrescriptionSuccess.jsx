import React, { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
    CheckCircle2,
    Copy,
    Check,
    Printer,
    ArrowRight,
    LayoutDashboard,
    PlusCircle,
    FileText,
    User
} from "lucide-react";

const PrescriptionSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const rxCode = searchParams.get("rxCode") || "RX-NOT-FOUND";
    const patientName = searchParams.get("patientName") || "Patient";

    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(rxCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-2xl mx-auto py-12 animate-in zoom-in-95 duration-500">
            <div className="bg-card rounded-3xl border border-border shadow-xl overflow-hidden">
                {/* Success Header */}
                <div className="bg-green-600 p-12 text-center text-white relative">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full"></div>
                        <div className="absolute top-20 -right-10 w-20 h-20 bg-white rounded-full"></div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6 border border-white/30">
                            <CheckCircle2 size={48} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-bold font-lexend mb-2">Prescription Generated</h1>
                        <p className="text-white/80 font-medium">Successfully securely stored in the patient registry</p>
                    </div>
                </div>

                <div className="p-10 space-y-8">
                    {/* RX Code Box */}
                    <div className="space-y-3 text-center">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Patient Token / RX Code</span>
                        <div className="flex items-center justify-center gap-4 bg-muted/50 p-6 rounded-2xl border-2 border-dashed border-border group relative transition-all hover:bg-muted">
                            <span className="text-4xl md:text-5xl font-black font-mono tracking-tighter text-foreground">
                                {rxCode}
                            </span>
                            <button
                                onClick={copyToClipboard}
                                className={`p-3 rounded-xl transition-all ${copied ? "bg-green-600 text-white" : "bg-primary text-white hover:scale-105"
                                    }`}
                                title="Copy code"
                            >
                                {copied ? <Check size={20} /> : <Copy size={20} />}
                            </button>
                        </div>
                        <p className="text-sm text-muted-foreground">Share this code with the patient for pharmacy pickup</p>
                    </div>

                    {/* Details Summary */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/30 p-4 rounded-xl border border-border">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1 text-xs font-bold uppercase tracking-wider">
                                <User size={14} /> Patient
                            </div>
                            <div className="font-bold text-foreground truncate">{patientName}</div>
                        </div>
                        <div className="bg-muted/30 p-4 rounded-xl border border-border">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1 text-xs font-bold uppercase tracking-wider">
                                <FileText size={14} /> Status
                            </div>
                            <div className="font-bold text-green-600 flex items-center gap-1">
                                Active <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 space-y-3">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => window.print()}
                                className="flex-grow py-4 px-6 border-2 border-border font-bold rounded-2xl hover:bg-muted transition-all flex items-center justify-center gap-2 text-foreground"
                            >
                                <Printer size={20} /> Print Slip
                            </button>
                            <Link
                                to="/search"
                                className="flex-grow py-4 px-6 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                            >
                                New Patient <PlusCircle size={20} />
                            </Link>
                        </div>
                        <Link
                            to="/dashboard"
                            className="w-full py-4 px-6 font-bold text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-2"
                        >
                            <LayoutDashboard size={20} /> Back to Dashboard
                        </Link>
                    </div>
                </div>

                {/* Info Footer */}
                <div className="bg-muted/30 p-6 border-t border-border flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <ArrowRight size={20} />
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        The pharmacy can access the medication list by entering this RX code on their portal. No physical paper is required for dispensing, though you can print a copy for the patient's reference.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrescriptionSuccess;
