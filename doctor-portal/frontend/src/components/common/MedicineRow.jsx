import React from "react";
import { Trash2, Pill, Clock, Calendar, Info } from "lucide-react";

export const COMMON_MEDICINES = [
    "Paracetamol 500mg", "Amoxicillin 500mg", "Ibuprofen 400mg", "Cetirizine 10mg",
    "Azithromycin 500mg", "Metformin 500mg", "Amlodipine 5mg", "Atorvastatin 10mg",
    "Omeprazole 20mg", "Losartan 50mg", "Levothyroxine 50mcg", "Gabapentin 300mg",
    "Metoprolol 25mg", "Hydrochlorothiazide 12.5mg", "Albuterol Inhaler", "Sertraline 50mg",
    "Escitalopram 10mg", "Prednisone 5mg", "Rosuvastatin 10mg", "Furosemide 20mg",
    "Pantoprazole 40mg", "Valsartan 80mg", "Tramadol 50mg", "Warfarin 5mg",
    "Clopidogrel 75mg", "Ranitidine 150mg", "Ciprofloxacin 500mg", "Doxycycline 100mg",
    "Fluconazole 150mg", "Insulin Glargine", "Montelukast 10mg", "Spironolactone 25mg",
    "Tamsulosin 0.4mg", "Venlafaxine 75mg", "Zolpidem 5mg", "Alprazolam 0.5mg",
    "Clonazepam 0.5mg", "Diazepam 5mg", "Lorazepam 1mg", "Lisinopril 10mg",
    "Simvastatin 20mg", "Augmentin 625mg", "Digoxin 0.25mg", "Nitroglycerin 0.5mg",
    "Amoxicillin/Clavulanate 500/125mg", "Citalopram 20mg", "Duloxetine 30mg", "Fluoxetine 20mg",
    "Pravastatin 20mg", "Meloxicam 15mg", "Trazodone 50mg", "Carvedilol 6.25mg",
    "Potassium Chloride 10mEq", "Clindamycin 300mg", "Cephalexin 500mg", "Methylprednisolone 4mg",
    "Ethinyl Estradiol/Norgestimate", "Viibryd 10mg", "Buspirone 10mg", "Hydroxyzine 25mg",
    "Promethazine 25mg", "Ondansetron 4mg", "Cyclobenzaprine 10mg", "Baclofen 10mg",
    "Methocarbamol 500mg", "Allopurinol 100mg", "Colchicine 0.6mg", "Finasteride 5mg",
    "Estradiol 1mg", "Progesterone 100mg", "Sumatriptan 50mg", "Rizatriptan 10mg",
    "Topiramate 25mg", "Lamotrigine 25mg", "Quetiapine 25mg", "Aripiprazole 5mg",
    "Risperidone 1mg", "Olanzapine 5mg", "Methylphenidate 10mg", "Adderall 10mg",
    "Vyvanse 30mg", "Donepezil 5mg", "Memantine 10mg", "Latanoprost 0.005%",
    "Timolol 0.5%", "Brimonidine 0.15%", "Dorzolamide 2%", "Diclofenac 50mg",
    "Naproxen 500mg", "Mupirocin 2% Ointment", "Silver Sulfadiazine 1% Cream",
    "Ketoconazole 2% Cream", "Hydrocortisone 1% Cream", "Clotrimazole 1% Cream",
    "Terbinafine 250mg", "Valacyclovir 500mg", "Acyclovir 400mg", "Oseltamivir 75mg",
    "Levofloxacin 500mg", "Moxifloxacin 400mg", "Nitrofurantoin 100mg", "SMZ/TMP DS 800/160mg",
    "Glimepiride 2mg", "Pioglitazone 15mg", "Gliclazide 80mg", "Sitagliptin 100mg"
].sort();

const MedicineRow = ({ medicine, index, updateMedicine, removeMedicine }) => {
    const handleChange = (field, value) => {
        updateMedicine(index, field, value);
    };

    return (
        <div className="bg-muted/30 p-6 rounded-2xl border border-border relative group animate-in zoom-in-95 duration-200">
            <button
                type="button"
                onClick={() => removeMedicine(index)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                title="Remove Medicine"
            >
                <Trash2 size={18} />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Medicine Name */}
                <div className="lg:col-span-5 space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1 flex items-center gap-1.5">
                        <Pill size={12} className="text-primary" /> Medicine Name <span className="text-destructive">*</span>
                    </label>
                    <input
                        type="text"
                        list={`medicine-suggestions-${index}`}
                        className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-semibold"
                        placeholder="e.g. Paracetamol 500mg"
                        value={medicine.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        required
                    />
                    <datalist id={`medicine-suggestions-${index}`}>
                        {COMMON_MEDICINES.map((med, i) => (
                            <option key={i} value={med} />
                        ))}
                    </datalist>
                </div>

                {/* Dosage */}
                <div className="lg:col-span-3 space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1 flex items-center gap-1.5">
                        <Clock size={12} /> Dosage (M-A-N) <span className="text-destructive">*</span>
                    </label>
                    <input
                        type="text"
                        className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-center font-mono tracking-widest"
                        placeholder="1-0-1"
                        value={medicine.dosage}
                        onChange={(e) => handleChange("dosage", e.target.value)}
                        required
                    />
                </div>

                {/* Duration */}
                <div className="lg:col-span-4 space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1 flex items-center gap-1.5">
                        <Calendar size={12} /> Duration <span className="text-destructive">*</span>
                    </label>
                    <input
                        type="text"
                        className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        placeholder="e.g. 5 days"
                        value={medicine.duration}
                        onChange={(e) => handleChange("duration", e.target.value)}
                        required
                    />
                </div>

                {/* Instructions */}
                <div className="lg:col-span-12 space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1 flex items-center gap-1.5">
                        <Info size={12} /> Special Instructions
                    </label>
                    <input
                        type="text"
                        className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none italic"
                        placeholder="e.g. After food, avoid cold drinks"
                        value={medicine.instructions}
                        onChange={(e) => handleChange("instructions", e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default MedicineRow;
