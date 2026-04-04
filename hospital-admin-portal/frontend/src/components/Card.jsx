import React from 'react';
import { cn } from '../lib/utils';

const Card = ({ children, title, subtitle, className = '', headerAction, ...props }) => {
  return (
    <div 
      className={cn(
        "bg-card text-card-foreground rounded-2xl border border-border shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl",
        className
      )}
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div>
            {title && <h3 className="text-xl font-lexend font-bold tracking-tight">{title}</h3>}
            {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          {headerAction && (
            <div>{headerAction}</div>
          )}
        </div>
      )}
      <div className="px-6 py-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
