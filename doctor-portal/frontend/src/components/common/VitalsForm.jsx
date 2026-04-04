import React from "react";
import { Activity, Thermometer, Heart, Weight, Waves } from "lucide-react";

const VitalsForm = ({ vitals, setVitals }) => {
    const handleChange = (field, value) => {
        setVitals((prev) => ({ ...prev, [field]: value }));
    };

    const fields = [
        { id: "blood_pressure", label: "Blood Pressure", icon: Activity, placeholder: "120/80", unit: "mmHg" },
        { id: "temperature", label: "Temperature", icon: Thermometer, placeholder: "98.6", unit: "°F" },
        { id: "pulse", label: "Pulse Rate", icon: Heart, placeholder: "72", unit: "bpm" },
        { id: "weight", label: "Patient Weight", icon: Weight, placeholder: "70", unit: "kg" },
        { id: "spo2", label: "Oxygen Saturation", icon: Waves, placeholder: "98", unit: "%" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fields.map((field) => (
                <div key={field.id} className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground flex items-center gap-2 ml-1">
                        <field.icon size={14} />
                        {field.label}
                    </label>
                    <div className="relative group">
                        <input
                            type="text"
                            className="w-full pl-4 pr-16 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            placeholder={field.placeholder}
                            value={vitals[field.id] || ""}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-xs font-bold text-muted-foreground uppercase">
                            {field.unit}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default VitalsForm;
