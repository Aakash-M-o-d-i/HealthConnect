import React from "react";

const StatsCard = ({ title, value, icon: Icon, color = "primary", subtitle }) => {
    const colorMap = {
        primary: "bg-primary/10 text-primary",
        success: "bg-emerald-500/10 text-emerald-500",
        warning: "bg-amber-500/10 text-amber-500",
        destructive: "bg-red-500/10 text-red-500",
    };

    return (
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground font-medium">{title}</p>
                <div className={`p-2 rounded-lg ${colorMap[color] || colorMap.primary}`}>
                    <Icon size={20} />
                </div>
            </div>
            <p className="text-3xl font-bold font-lexend text-foreground">{value}</p>
            {subtitle && (
                <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
        </div>
    );
};

export default StatsCard;
