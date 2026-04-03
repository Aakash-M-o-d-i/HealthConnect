import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
    Search,
    User,
    Phone,
    Fingerprint,
    ArrowRight,
    ChevronRight,
    Loader2,
    AlertCircle,
    Clock,
    History
} from "lucide-react";

const SearchPatient = () => {
    const navigate = useNavigate();
    const [searchType, setSearchType] = useState("healthId"); // healthId, phone, govtId
    const [searchValue, setSearchValue] = useState("");
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState("");
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        const query = searchValue.trim();
        if (!query) {
            setResults([]);
            setSearched(false);
            return;
        }

        setError("");
        setIsSearching(true);
        setSearched(true);

        try {
            const response = await api.get(`/patients/search?q=${encodeURIComponent(query)}`);
            const patients = response.data.map(p => ({
                id: p.health_id,
                name: p.name,
                healthId: p.health_id,
                phone: p.phone || "N/A",
                gender: p.gender || "N/A",
                bloodGroup: p.blood_group || "N/A",
                lastVisit: "Recent"
            }));
            setResults(patients);
            setIsSearching(false);
        } catch (err) {
            console.error("Search error:", err);
            setError("Failed to fetch patients. Please try again.");
            setIsSearching(false);
        }
    };

    const searchTypes = [
        { id: "healthId", label: "Health ID (UHID)", icon: Fingerprint, placeholder: "e.g. HID-1234-5678" },
        { id: "govtId", label: "Aadhaar / Govt ID", icon: User, placeholder: "Enter Government ID" },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-foreground">Find Patient</h1>
                <p className="text-muted-foreground mt-2">Search the central registry to retrieve medical history</p>
            </div>

            {/* Search Bar */}
            <div className="bg-card p-2 rounded-2xl border border-border shadow-lg">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
                    <div className="flex-grow relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                            {(() => {
                                const activeType = searchTypes.find(t => t.id === searchType);
                                const IconComp = activeType ? activeType.icon : Search;
                                return <IconComp size={20} />;
                            })()}
                        </div>
                        <input
                            type="text"
                            className="w-full pl-12 pr-4 py-4 bg-transparent text-foreground font-medium rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all border-none"
                            placeholder={searchTypes.find(t => t.id === searchType).placeholder}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 p-1 bg-muted rounded-xl">
                        {searchTypes.map((type) => (
                            <button
                                key={type.id}
                                type="button"
                                onClick={() => setSearchType(type.id)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${searchType === type.id
                                    ? "bg-card text-primary shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={isSearching}
                        className="md:w-32 py-3 px-6 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                    >
                        {isSearching ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                        <span>Search</span>
                    </button>

                    {searched && !isSearching && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearchValue("");
                                setResults([]);
                                setSearched(false);
                            }}
                            className="p-3 bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-all"
                            title="Clear search"
                        >
                            <AlertCircle size={20} className="rotate-45" />
                        </button>
                    )}
                </form>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
                {isSearching ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-4">
                        <Loader2 className="animate-spin text-primary" size={40} />
                        <p className="text-muted-foreground animate-pulse">Syncing with global health registry...</p>
                    </div>
                ) : searched ? (
                    results.length > 0 ? (
                        <div className="grid gap-4">
                            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider pl-1">Found {results.length} Match</h2>
                            {results.map((patient) => (
                                <div
                                    key={patient.id}
                                    onClick={() => navigate(`/patient/${patient.healthId}`)}
                                    className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-6"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                                            <User size={32} />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{patient.name}</h3>
                                            <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1.5"><Fingerprint size={14} className="text-primary" /> {patient.healthId}</span>
                                                <span className="flex items-center gap-1.5"><Phone size={14} /> {patient.phone}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <div className="hidden sm:flex flex-col items-end">
                                            <span className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Last Visit</span>
                                            <span className="font-semibold text-foreground flex items-center gap-1.5">
                                                <History size={14} /> {patient.lastVisit}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-primary font-bold">
                                            <span>View Full Profile</span>
                                            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-border">
                            <div className="mx-auto w-16 h-16 bg-card rounded-full flex items-center justify-center mb-4 text-muted-foreground">
                                <AlertCircle size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-foreground">No Patient Found</h3>
                            <p className="text-muted-foreground mt-1 max-w-xs mx-auto text-sm">
                                We couldn't find any patient matching "{searchValue}". <br />
                                <span className="font-bold">Suggestions:</span> Try searching for "Rahul", "Anita", or "9876543210".
                            </p>
                        </div>
                    )
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                            <Search size={40} className="text-primary/40" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">Awaiting Input</h3>
                        <p className="text-muted-foreground mt-1 max-w-sm">
                            Enter the patient's UHID or phone number above to access their complete medical record.
                        </p>
                    </div>
                )}
            </div>

            {/* Quick Access Info */}
            <div className="bg-primary/5 rounded-2xl border border-primary/10 p-6 flex flex-col md:flex-row gap-6 items-start">
                <div className="p-3 bg-card rounded-xl shadow-sm">
                    <Clock size={24} className="text-primary" />
                </div>
                <div>
                    <h4 className="font-bold text-foreground mb-1 text-base">Privacy & Compliance Note</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        By searching for a patient, you are accessing protected health information. Ensure you have the patient's verbal consent to pull their records for clinical use. All searches are audited.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SearchPatient;
