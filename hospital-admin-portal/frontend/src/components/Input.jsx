import React from 'react';
import { cn } from '../lib/utils';

const Input = ({ label, icon: Icon, className = '', error, ...props }) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-semibold text-foreground ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
            <Icon size={18} />
          </div>
        )}
        <input
          className={cn(
            "w-full bg-secondary text-foreground border border-border rounded-xl px-4 py-2.5 outline-none transition-all duration-200",
            "focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground",
            Icon && "pl-11"
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-destructive ml-1">{error}</p>}
    </div>
  );
};

export default Input;
